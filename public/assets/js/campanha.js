const CAMPAIGN_API_URL = 'http://localhost:3000/api/campanha';
const SESSION_KEY = 'mvpDraftTime';

const state = {
    campanha: null,
    indicePartidaAtual: 0,
    rodadaAtual: 0,
    timer: null,
    finalizado: false,
    timeJogador: null
};

function getPlayerTeamName() {
    const payload = JSON.parse(sessionStorage.getItem(SESSION_KEY) || 'null');
    return payload?.nome || 'Meu Time';
}

function setStatus(text, tone = 'neutral') {
    const status = document.getElementById('campaign-status');
    if (!status) return;

    status.textContent = text;
    status.dataset.tone = tone;
}

function setFeedStatus(text) {
    const status = document.getElementById('feed-status');
    if (status) status.textContent = text;
}

function updateProgressSummary(wins = 0, losses = 0) {
    wins = Number(wins);
    losses = Number(losses);
    const totalWinsRequired = Number(state.campanha?.vitoriasNecessarias || 4);

    const winsEl = document.getElementById('campaign-record-wins');
    const lossesEl = document.getElementById('campaign-record-losses');
    const progressText = document.getElementById('campaign-progress-text');
    const progressFill = document.getElementById('campaign-progress-fill');

    if (winsEl) winsEl.textContent = `${wins}V`;
    if (lossesEl) lossesEl.textContent = `${losses}D`;
    if (progressText) progressText.textContent = `${wins} / ${totalWinsRequired} vitórias`;
    if (progressFill) {
        const percentage = Math.min((wins / totalWinsRequired) * 100, 100);
        progressFill.style.width = `${percentage}%`;
    }
}

function appendFeed(message, roundLabel = '') {
    const feedList = document.getElementById('feed-list');
    if (!feedList) return;

    const item = document.createElement('li');
    const label = document.createElement('span');
    label.className = 'feed-round';
    label.textContent = roundLabel || 'Evento';

    const details = document.createElement('span');
    details.className = 'feed-message';
    details.textContent = message;

    item.append(label, details);

    feedList.appendChild(item);
    feedList.scrollTop = feedList.scrollHeight;
}

function resetFeed() {
    const feedList = document.getElementById('feed-list');
    if (!feedList) return;
    feedList.innerHTML = '';
}

function renderScore(placarA, placarB) {
    const scorePlayer = document.getElementById('score-player');
    const scoreOpponent = document.getElementById('score-opponent');

    if (scorePlayer) scorePlayer.textContent = String(placarA);
    if (scoreOpponent) scoreOpponent.textContent = String(placarB);
}

function renderRosterList(listId, players, titleText) {
    const list = document.getElementById(listId);
    if (!list) return;

    list.innerHTML = '';

    const roster = Array.isArray(players) ? players : [];
    roster.forEach((jogador) => {
        const item = document.createElement('li');
        const nome = document.createElement('span');
        nome.textContent = jogador.nome || 'Jogador';

        const funcao = document.createElement('span');
        funcao.className = 'player-role';
        funcao.textContent = jogador.funcao || '—';

        const overall = document.createElement('span');
        overall.className = 'player-overall';
        overall.textContent = jogador.overall ?? '—';

        item.append(nome, funcao, overall);
        list.appendChild(item);
    });

    const titular = document.getElementById(listId === 'player-roster-list' ? 'player-team-name' : 'opponent-roster-title');
    if (titular && titleText) {
        titular.textContent = titleText;
    }
}

function renderMatchHeader(partida) {
    const playerTeamName = document.getElementById('player-team-name');
    const opponentTeamName = document.getElementById('opponent-team-name');
    const playerSide = document.getElementById('player-team-side');
    const opponentSide = document.getElementById('opponent-team-side');
    const mapName = document.getElementById('map-name');
    const mapSide = document.getElementById('map-side');
    const matchNumber = document.getElementById('match-number');
    const matchRound = document.getElementById('match-round');
    const opponentRosterTitle = document.getElementById('opponent-roster-title');

    if (playerTeamName) playerTeamName.textContent = state.timeJogador || getPlayerTeamName();
    if (opponentTeamName) opponentTeamName.textContent = partida?.adversarioNome || partida?.adversario || 'Adversário';
    if (opponentRosterTitle) opponentRosterTitle.textContent = `${partida?.adversarioNome || partida?.adversario || 'Adversário'}${partida?.adversarioAno ? ` — ${partida.adversarioAno}` : ''}`;

    const ladoJogador = partida?.ladoInicialTimeJogador ?? '—';
    const ladoAdversario = partida?.ladoInicialAdversario ?? '—';
    if (playerSide) playerSide.textContent = `Lado inicial: ${ladoJogador}`;
    if (opponentSide) opponentSide.textContent = `Lado inicial: ${ladoAdversario}`;

    if (mapName) mapName.textContent = `Mapa: ${partida?.mapaNome || partida?.mapa || '—'}`;
    if (mapSide) mapSide.textContent = `Lado favorecido: ${partida?.ladoFavorecido || '—'}`;
    if (matchNumber) matchNumber.textContent = `Confronto ${partida?.numeroConfronto || state.indicePartidaAtual + 1}`;
    if (matchRound) matchRound.textContent = `Round ${state.rodadaAtual || 0}`;

    const timeJogadorDetalhes = state.campanha?.timeJogadorDetalhes?.jogadores || [];
    renderRosterList('player-roster-list', timeJogadorDetalhes, state.timeJogador || getPlayerTeamName());
    renderRosterList('opponent-roster-list', partida?.adversarioDetalhes?.jogadores || [], `${partida?.adversarioNome || 'Adversário'}${partida?.adversarioAno ? ` — ${partida.adversarioAno}` : ''}`);
}

function flipToNextMatch() {
    if (!state.campanha || !Array.isArray(state.campanha.partidas)) return;

    const nextIndex = state.indicePartidaAtual + 1;
    if (nextIndex >= state.campanha.partidas.length) {
        setStatus('Campanha concluída', state.campanha.estado === 'campeão' ? 'success' : 'danger');
        return;
    }

    state.indicePartidaAtual = nextIndex;
    state.rodadaAtual = 0;
    iniciarAnimacaoPartida(state.campanha.partidas[state.indicePartidaAtual]);
}

function finalizeMatch(partida) {
    const resultBox = document.getElementById('campaign-action-panel');
    const resultTitle = document.getElementById('result-title');
    const resultMessage = document.getElementById('result-message');
    const nextBtn = document.getElementById('next-match-button');

    if (resultBox) resultBox.classList.remove('hidden');

    const equipeJogador = state.timeJogador || getPlayerTeamName();
    const venceu = String(partida?.vencedor || '').toLowerCase() === String(equipeJogador).toLowerCase();
    const estadoPartida = partida?.estadoCampanha || 'em andamento';

    updateProgressSummary(partida?.vitorias ?? 0, partida?.derrotas ?? 0);

    if (resultTitle) {
        resultTitle.textContent = venceu ? 'Vitória conquistada' : 'Derrota na campanha';
    }

    if (resultMessage) {
        resultMessage.textContent = venceu
            ? `Você venceu ${partida?.adversarioNome || partida?.adversario || 'o adversário'} por ${partida?.placar || '0 x 0'} e avançou na campanha.`
            : `Sua campanha acabou neste confronto. ${partida?.adversarioNome || partida?.adversario || 'O adversário'} venceu por ${partida?.placar || '0 x 0'}.`;
    }

    setStatus(
        estadoPartida === 'em andamento' ? 'Em andamento' : estadoPartida,
        estadoPartida === 'campeão' ? 'success' : estadoPartida === 'eliminado' ? 'danger' : 'warning'
    );

    if (nextBtn) {
        const campanhaEmAndamento = estadoPartida === 'em andamento';
        const temProximoConfronto = state.indicePartidaAtual + 1 < (state.campanha?.partidas?.length ?? 0);

        nextBtn.classList.toggle('hidden', !(campanhaEmAndamento && temProximoConfronto));

        if (campanhaEmAndamento && temProximoConfronto) {
            nextBtn.textContent = 'Próximo confronto';
            nextBtn.onclick = () => {
                nextBtn.classList.add('hidden');
                flipToNextMatch();
            };
        }
    }

    if (estadoPartida === 'campeão') {
        setStatus('Campeão', 'success');
        if (resultTitle) resultTitle.textContent = 'Campeão do torneio';
        const totalVitorias = Number(state.campanha?.vitoriasNecessarias || 4);
        if (resultMessage) resultMessage.textContent = `${totalVitorias} vitórias foram conquistadas. Sua campanha terminou em título.`;
        if (nextBtn) nextBtn.classList.add('hidden');
    }

    if (estadoPartida === 'eliminado') {
        setStatus('Eliminado', 'danger');
        if (resultTitle) resultTitle.textContent = 'Campanha encerrada';
        if (resultMessage) resultMessage.textContent = 'Você sofreu a primeira derrota e foi eliminado da competição.';
        if (nextBtn) nextBtn.classList.add('hidden');
    }
}

function iniciarAnimacaoPartida(partida) {
    if (!partida) return;

    const rounds = Array.isArray(partida.historicoRodadas) ? partida.historicoRodadas : [];
    state.rodadaAtual = 0;
    state.finalizado = false;
    const campaignTitle = document.getElementById('campaign-title');
    if (campaignTitle) {
        campaignTitle.textContent = `${state.timeJogador || getPlayerTeamName()} x ${partida.adversarioNome || partida.adversario || 'adversário'}`;
    }
    renderMatchHeader(partida);
    resetFeed();
    renderScore(0, 0);
    setFeedStatus('Partida em andamento');
    appendFeed(`Partida iniciada contra ${partida.adversarioNome || partida.adversario || 'adversário'} em ${partida.mapaNome || partida.mapa || 'mapa'}.`, 'Inicio');

    if (resultBoxVisible()) {
        const resultBox = document.getElementById('campaign-action-panel');
        if (resultBox) resultBox.classList.add('hidden');
    }

    const resolveFinal = () => {
        state.finalizado = true;
        renderScore(parseInt(partida.placar?.split(' x ')[0] || 0, 10), parseInt(partida.placar?.split(' x ')[1] || 0, 10));
        document.getElementById('match-round').textContent = `Final ${partida.placar || '0 x 0'}`;
        setFeedStatus('Partida encerrada');
        appendFeed(`Partida encerrada: ${partida.vencedor || 'Sem vencedor'} vence por ${partida.placar || '0 x 0'}.`, 'Fim');
        finalizeMatch(partida);
    };

    if (rounds.length === 0) {
        resolveFinal();
        return;
    }

    const step = () => {
        if (state.finalizado) return;

        const rodada = rounds[state.rodadaAtual];
        if (!rodada) {
            resolveFinal();
            return;
        }

        const placarA = Number(rodada.placarA ?? 0);
        const placarB = Number(rodada.placarB ?? 0);
        renderScore(placarA, placarB);
        document.getElementById('match-round').textContent = `Round ${rodada.numero ?? state.rodadaAtual + 1}`;
        setFeedStatus(`Round ${rodada.numero ?? state.rodadaAtual + 1} de ${rounds.length}`);

        const vencedorLabel = rodada.vencedor === (state.timeJogador || getPlayerTeamName()) ? 'Meu time' : (partida.adversarioNome || partida.adversario || 'Adversário');
        appendFeed(`${vencedorLabel} vence a rodada ${rodada.numero}. Placar: ${placarA} x ${placarB}.`, `R${rodada.numero ?? state.rodadaAtual + 1}`);

        state.rodadaAtual += 1;

        if (state.rodadaAtual >= rounds.length) {
            resolveFinal();
            return;
        }

        state.timer = setTimeout(step, 850);
    };

    state.timer = setTimeout(step, 700);
}

function resultBoxVisible() {
    const box = document.getElementById('campaign-action-panel');
    return box && !box.classList.contains('hidden');
}

async function carregarCampanha() {
    const timeJogador = JSON.parse(sessionStorage.getItem(SESSION_KEY) || 'null');
    if (!timeJogador || !Array.isArray(timeJogador.jogadores) || timeJogador.jogadores.length !== 5) {
        document.getElementById('campaign-title').textContent = 'Time não encontrado';
        setStatus('Sem dados da campanha', 'danger');
        return;
    }

    state.timeJogador = timeJogador.nome || 'Meu Time';

    try {
        const resposta = await fetch(CAMPAIGN_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ timeJogador })
        });

        if (!resposta.ok) {
            const erro = await resposta.json().catch(() => ({}));
            throw new Error(erro.erro || `Erro ao iniciar campanha: ${resposta.status}`);
        }

        const data = await resposta.json();
        state.campanha = data;
        document.getElementById('campaign-title').textContent = `${state.timeJogador} x ${data.partidas?.[0]?.adversarioNome || 'adversário'}`;
        updateProgressSummary(0, 0);
        setStatus('Em andamento', 'neutral');
        document.getElementById('progress-caption').textContent = `Título · ${data.vitoriasNecessarias || 4} vitórias`;

        if (!Array.isArray(data.partidas) || data.partidas.length === 0) {
            appendFeed('Nenhum adversário válido foi encontrado para a campanha.', 'Aviso');
            return;
        }

        state.indicePartidaAtual = 0;
        iniciarAnimacaoPartida(data.partidas[0]);
    } catch (erro) {
        console.error(erro);
        setStatus('Erro na campanha', 'danger');
        setFeedStatus('Falha ao carregar');
        const title = document.getElementById('campaign-title');
        if (title) title.textContent = 'Campanha indisponível';
        appendFeed(erro.message || 'Não foi possível iniciar a campanha.', 'Erro');
    }
}

window.addEventListener('DOMContentLoaded', () => {
    const campaignTitle = document.getElementById('campaign-title');
    if (campaignTitle) campaignTitle.textContent = getPlayerTeamName();
    carregarCampanha();
});
