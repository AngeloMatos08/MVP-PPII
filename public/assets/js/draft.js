// Dev2-> AngeloMatos08: Aqui ficarão os jogadores "puxados do banco de dados"
let listaDeJogadores = [];
// Dev2-> AngeloMatos08: Aqui ficará o time sorteado e o ano definido pela função sortear()
let timeAtual = null;
let nomeTimeAtual = null;
let anoAtual = null;

// Dev2-> AngeloMatos08: Aqui ficará o time escolhido pelo usuário
let timeEscolhido = [];
let jogadorEmSelecao = null;

const coresPorTime = {
    loud: { inicio: '13FF00', fim: '13FF00' },
    leviatan: { inicio: '69ABDC', fim: '69ABDC' },
    furia: { inicio: '000000', fim: 'EEEEEE' },
    optic: { inicio: '92C950', fim: '92C950' },
    edg: { inicio: 'FF0000', fim: 'FF0000' },
    edwardgaming: { inicio: 'FF0000', fim: 'FF0000' },
    paperrex: { inicio: 'FF07CD', fim: 'FF07CD' },
    drx: { inicio: '0D0282', fim: '0D0282' },
    zetadivision: { inicio: 'EEEEEE', fim: '000000' },
    fnatic: { inicio: 'FF5900', fim: 'FF5900' },
    '100thieves': { inicio: 'F23535', fim: 'F23535' },
    kru: { inicio: 'FF198F', fim: 'FF198F' },
    xerxia: { inicio: 'FF198F', fim: 'FF198F' },
    fpx: { inicio: 'FF0600', fim: 'FF0600' },
    teamliquid: { inicio: 'EEEEEE', fim: '001538' },
    boomesports: { inicio: '515761', fim: 'B30314' },
    xset: { inicio: 'F40F30', fim: 'F40F30' },
    evilgeniuses: { inicio: '202D5A', fim: '202D5A' },
    bilibiligaming: { inicio: 'FF198F', fim: '36D0F4' },
};

let funcoesPreenchidas = {
    duelista: 0,
    sentinela: 0,
    iniciador: 0,
    controlador: 0
}

// Função atualizada para puxar da API do MongoDB
async function puxarJogadores() {
    try {
        // Altera a rota do arquivo local para a rota do servidor backend
        const response = await fetch('http://localhost:3000/api/jogadores');
        listaDeJogadores = await response.json();
        console.log('Jogadores carregados do Banco de Dados!', listaDeJogadores);

        iniciarDraft();
    } catch (error) {
        console.error('Erro ao carregar jogadores do banco:', error);
    }
}

function iniciarDraft() {
    console.log('Iniciando o draft com os jogadores:' + listaDeJogadores.length + ' jogadores.');
    if (listaDeJogadores.length > 0) {
        sortear();
    } else {
        console.log('Nenhum jogador disponível para o draft.');
    }
}

// Parte do sorteio/draft
function definirTimeAtual(timeId, ano = null) {
    timeAtual = timeId;

    const jogadorExemplo = listaDeJogadores.find(jogador => jogador.time_id === timeId);
    nomeTimeAtual = jogadorExemplo ? jogadorExemplo.nome_time : null;
    anoAtual = ano ?? (jogadorExemplo ? jogadorExemplo.ano : null);
}

function sortear() {
    const timesDisponiveis = [...new Set(listaDeJogadores.map(jogador => jogador.time_id))];
    console.log('Times disponíveis para sorteio:', timesDisponiveis);

    const indiceAleatorio = Math.floor(Math.random() * timesDisponiveis.length);
    const timeSorteado = timesDisponiveis[indiceAleatorio];
    definirTimeAtual(timeSorteado);
    console.log('Time sorteado:', timeAtual);

    filtrarJogadoresPorTime();
}

function filtrarJogadoresPorTime() {
    const jogadoresFiltrados = listaDeJogadores.filter(jogador => jogador.time_id === timeAtual);
    console.log('Jogadores filtrados pelo time sorteado:', jogadoresFiltrados);

    jogadorEmSelecao = null;
    resetarSeletorFuncao();
    atualizarDestaqueTime(jogadoresFiltrados[0]);
    exibirJogadoresNaTela(jogadoresFiltrados);
}

function obterListaFuncoes(jogador) {
    if (Array.isArray(jogador.funcoes)) {
        return jogador.funcoes;
    }
    if (typeof jogador.funcoes === 'string') {
        return jogador.funcoes.split(',').map(funcao => funcao.trim()).filter(Boolean);
    }
    return jogador.funcoes ? [jogador.funcoes] : [];
}

function normalizarNomeFuncao(funcao) {
    return String(funcao).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
}

function normalizarCorHex(cor, fallback) {
    if (!cor) return fallback;
    const valor = String(cor).trim().replace(/^#/, '');
    return /^[0-9a-f]{3}([0-9a-f]{3})?$/i.test(valor) ? `#${valor}` : fallback;
}

function funcaoPermitida(funcao) {
    const funcaoFormatada = normalizarNomeFuncao(funcao);
    if (timeEscolhido.length >= 5 || funcoesPreenchidas[funcaoFormatada] === undefined) return false;
    if (funcoesPreenchidas[funcaoFormatada] >= 2) return false;

    const existeFuncaoDuplicada = Object.values(funcoesPreenchidas).some(quantidade => quantidade >= 2);
    return !existeFuncaoDuplicada || funcoesPreenchidas[funcaoFormatada] === 0;
}

function jogadorPodeSerEscolhido(jogador) {
    if (jogadorJaFoiEscolhido(jogador.nome) || timeEscolhido.length >= 5) return false;
    return obterListaFuncoes(jogador).some(funcaoPermitida);
}

function obterIconeFuncao(funcao) {
    const funcaoNormalizada = normalizarNomeFuncao(funcao);
    const funcoes = {
        duelista: 'duelista',
        sentinela: 'sentinela',
        iniciador: 'iniciador',
        controlador: 'controlador'
    };
    const nomeArquivo = funcoes[funcaoNormalizada];
    return nomeArquivo ? `assets/images/roles/${nomeArquivo}.svg` : null;
}

function atualizarDestaqueTime(jogador) {
    if (!jogador) return;

    const nome = jogador.nome_time || 'Time';
    const nomeNormalizado = nome.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, '');
    const logo = document.getElementById('team-logo');
    const monograma = document.getElementById('team-monogram');
    const nomeElemento = document.getElementById('team-name');
    const campeonato = document.getElementById('team-championship');
    const ranking = document.getElementById('team-ranking');
    const destaque = document.getElementById('team-highlight');
    const logosPorTime = {
        loud: ['Loud.svg', 'loud.svg', 'loud.png'],
        leviatan: ['Leviatan.svg', 'leviatan.svg', 'LEV.svg', 'lev.svg', 'lev.png', 'Lev.svg', 'Lev.png'],
        furia: ['furia.svg', 'Furia.svg', 'furia.png'],
        optic: ['optic.svg', 'Optic.svg', 'optic.png'],
        edg: ['edward gaming.png', 'edward_gaming.svg', 'Edward_Gaming.svg'],
        edwardgaming: ['edward gaming.png', 'edward_gaming.svg', 'Edward_Gaming.svg'],
        paperrex: ['paperrex.svg', 'PaperRex.svg', 'paperrex.png', 'prx.svg'],
        drx: ['drx.svg', 'DRX.svg', 'drx.png'],
        zetadivision: ['zetadivision.svg', 'zeta.svg', 'zetadivision.png'],
        fnatic: ['fnatic.svg', 'Fnatic.svg', 'fnatic.png'],
        '100thieves': ['100t.svg', '100thieves.svg', '100Thieves.svg', '100thieves.png'],
        kru: ['kru.svg', 'KRU.svg', 'kru.png'],
        xerxia: ['xerxia.svg', 'Xerxia.svg', 'xerxia.png'],
        fpx: ['fpx.svg', 'FPX.svg', 'fpx.png'],
        teamliquid: ['teamliquid.svg', 'TeamLiquid.svg', 'teamliquid.png'],
        boomesports: ['boomesports.svg', 'BoomEsports.svg', 'boomesports.png']
    };
    const arquivosLogo = logosPorTime[nomeNormalizado] || [`${nomeNormalizado}.svg`, `${nomeNormalizado}.png`];

    if (nomeElemento) nomeElemento.textContent = nome;
    if (campeonato) campeonato.textContent = jogador.ano ? `Champions ${jogador.ano}` : 'Temporada';
    if (logo && monograma) {
        let tentativaLogo = 0;
        logo.onerror = () => {
            tentativaLogo++;
            if (tentativaLogo < arquivosLogo.length) {
                logo.src = `assets/images/logos_times/${arquivosLogo[tentativaLogo]}`;
                return;
            }
            logo.classList.add('hidden');
            monograma.classList.remove('hidden');
        };
        logo.onload = () => {
            logo.classList.remove('hidden');
            monograma.classList.add('hidden');
        };
        logo.src = `assets/images/logos_times/${arquivosLogo[0]}`;
        logo.alt = `Logo ${nome}`;
        monograma.textContent = nome.slice(0, 3).toUpperCase();
    }
    if (destaque) {
        const coresDoTime = coresPorTime[nomeNormalizado] || {};
        const corInicio = normalizarCorHex(coresDoTime.inicio || jogador.cor_primaria || jogador.corPrimaria, '#167d38');
        const corFim = normalizarCorHex(coresDoTime.fim || jogador.cor_secundaria || jogador.corSecundaria, '#11d83d');
        destaque.style.setProperty('--team-color-start', corInicio);
        destaque.style.setProperty('--team-color-end', corFim);
    }
}

function carregarTimePorAno(nomeTime, ano) {
    const jogadoresDoTime = listaDeJogadores.filter(jogador => jogador.nome_time === nomeTime && jogador.ano === ano);

    if (!jogadoresDoTime.length) {
        alert(`⚠️ Não foi possível encontrar o time ${nomeTime} no ano ${ano}.`);
        return;
    }

    timeAtual = jogadoresDoTime[0].time_id;
    nomeTimeAtual = nomeTime;
    anoAtual = ano;

    filtrarJogadoresPorTime();
}

// Dev2-> AngeloMatos08: Trata funções se forem Array ou String para renderizar o <select>
function exibirJogadoresNaTela(jogadoresFiltrados) {
    const container = document.getElementById('container-jogadores');
    if (!container) return;
    container.replaceChildren();

    jogadoresFiltrados.forEach((jogador) => {
        const itemJogador = document.createElement('div');
        itemJogador.className = 'player-row flex min-h-12 cursor-pointer items-center gap-2 px-3 py-2 transition-colors hover:bg-white/5 focus:outline-none focus:ring-1 focus:ring-inset focus:ring-emerald-400';
        itemJogador.setAttribute('role', 'button');

        const jaFoiEscolhido = timeEscolhido.some(j => j.nome === jogador.nome);
        const podeSerEscolhido = jogadorPodeSerEscolhido(jogador);
        const informacoes = document.createElement('div');
        informacoes.className = 'min-w-0 flex-1';
        const nome = document.createElement('p');
        nome.className = 'truncate text-sm font-medium';
        nome.textContent = jogador.nome;
        informacoes.appendChild(nome);

        if (jaFoiEscolhido || !podeSerEscolhido) {
            itemJogador.classList.add('opacity-40');
            itemJogador.tabIndex = -1;
            itemJogador.setAttribute('aria-disabled', 'true');
            if (jaFoiEscolhido) nome.classList.add('line-through');
            const aviso = document.createElement('p');
            aviso.className = 'text-[11px] text-white/50';
            aviso.textContent = jaFoiEscolhido ? 'Já escolhido' : 'Sem funções disponíveis';
            informacoes.appendChild(aviso);
            itemJogador.appendChild(informacoes);
        } else {
            itemJogador.tabIndex = 0;
            itemJogador.setAttribute('aria-disabled', 'false');
            const listaFuncoes = obterListaFuncoes(jogador);
            const icones = document.createElement('div');
            icones.className = 'flex shrink-0 items-center gap-1';
            listaFuncoes.forEach(funcao => {
                const caminhoIcone = obterIconeFuncao(funcao);
                if (!caminhoIcone) return;
                const icone = document.createElement('img');
                icone.src = caminhoIcone;
                icone.alt = String(funcao);
                icone.title = String(funcao);
                icone.className = 'h-4 w-4';
                icones.appendChild(icone);
            });

            const overall = document.createElement('span');
            overall.className = 'w-7 shrink-0 text-right text-xs font-bold tabular-nums';
            overall.textContent = jogador.overall ?? '--';

            itemJogador.append(informacoes, icones);
            itemJogador.appendChild(overall);
            itemJogador.setAttribute('aria-label', `Selecionar ${jogador.nome}, overall ${jogador.overall ?? 'indisponível'}`);
            itemJogador.addEventListener('click', () => prepararEscolha(jogador.nome, listaFuncoes));
            itemJogador.addEventListener('keydown', evento => {
                if (evento.key === 'Enter' || evento.key === ' ') {
                    evento.preventDefault();
                    prepararEscolha(jogador.nome, listaFuncoes);
                }
            });
        }

        container.appendChild(itemJogador);
    });
}

function resetarSeletorFuncao() {
    const titulo = document.getElementById('role-picker-title');
    const dica = document.getElementById('role-picker-hint');
    const opcoes = document.getElementById('role-picker-options');
    if (titulo) titulo.textContent = 'Escolha a função de um jogador';
    if (dica) dica.textContent = 'Selecione um atleta na lista';
    if (!opcoes) return;

    opcoes.replaceChildren();
    const instrucao = document.createElement('span');
    instrucao.className = 'text-xs text-white/45';
    instrucao.textContent = 'As opções aparecem aqui';
    opcoes.appendChild(instrucao);
}

function atualizarSeletorFuncao(nomeJogador, listaFuncoes) {
    const titulo = document.getElementById('role-picker-title');
    const dica = document.getElementById('role-picker-hint');
    const opcoes = document.getElementById('role-picker-options');
    if (titulo) titulo.textContent = `Escolha a função de ${nomeJogador}`;
    if (dica) dica.textContent = 'Clique em uma função permitida para adicionar ao roster';
    if (!opcoes) return;

    opcoes.replaceChildren();
    listaFuncoes.forEach(funcao => {
        const iconeSrc = obterIconeFuncao(funcao);
        const permitido = funcaoPermitida(funcao);
        const botao = document.createElement('button');
        botao.type = 'button';
        botao.disabled = !permitido;
        botao.className = `flex min-w-16 flex-col items-center gap-1 rounded-md px-2 py-1.5 text-[10px] transition focus:outline-none focus:ring-2 focus:ring-emerald-300 ${permitido ? 'hover:bg-white/10' : 'cursor-not-allowed opacity-30 grayscale'}`;
        botao.setAttribute('aria-label', `${funcao}${permitido ? '' : ', indisponível pelas regras do roster'}`);
        if (iconeSrc) {
            const icone = document.createElement('img');
            icone.src = iconeSrc;
            icone.alt = '';
            icone.className = 'h-9 w-9';
            botao.appendChild(icone);
        }
        const rotulo = document.createElement('span');
        rotulo.textContent = funcao;
        botao.appendChild(rotulo);
        if (permitido) {
            botao.addEventListener('click', () => {
                if (jogadorEmSelecao) escolherJogador(jogadorEmSelecao.nome, funcao);
            });
        }
        opcoes.appendChild(botao);
    });
}

function atualizarRoster() {
    const container = document.getElementById('roster-list');
    const resumo = document.getElementById('roster-summary');
    if (!container) return;
    container.replaceChildren();

    if (timeEscolhido.length === 0) {
        const mensagem = document.createElement('p');
        mensagem.className = 'px-1 py-2 text-sm text-white/45';
        mensagem.textContent = 'Escolha jogadores para montar o roster.';
        container.appendChild(mensagem);
    }

    timeEscolhido.forEach(jogador => {
        const linha = document.createElement('div');
        linha.className = 'flex min-h-8 items-center gap-2 rounded-sm bg-gradient-to-r from-teal-900/90 to-emerald-500 px-2.5 py-1 text-sm shadow-sm';
        const overall = document.createElement('span');
        overall.className = 'w-7 shrink-0 text-right text-[1rem] tabular-nums';
        overall.textContent = jogador.overall;
        const nome = document.createElement('span');
        nome.className = 'min-w-0 flex-1 truncate';
        nome.textContent = jogador.nome;
        const funcao = document.createElement('span');
        funcao.className = 'shrink-0 rounded bg-black/15 px-1.5 py-0.5 text-[10px] uppercase';
        funcao.textContent = jogador.funcao;
        const iconeSrc = obterIconeFuncao(jogador.funcao);
        if (iconeSrc) {
            const icone = document.createElement('img');
            icone.src = iconeSrc;
            icone.alt = String(jogador.funcao);
            icone.className = 'h-5 w-5 shrink-0';
            linha.append(overall, nome, funcao, icone);
        } else {
            linha.append(overall, nome, funcao);
        }
        container.appendChild(linha);
    });

    if (resumo) {
        const total = timeEscolhido.reduce((soma, jogador) => soma + Number(jogador.overall || 0), 0);
        resumo.textContent = timeEscolhido.length ? `${timeEscolhido.length}/5 jogadores · Overall médio ${Math.round(total / timeEscolhido.length)}` : '';
    }
}

// Dev2-> AngeloMatos08: Lê o dropdown com segurança
function prepararEscolha(nomeJogador, listaFuncoes) {
    const jogador = listaDeJogadores.find(item => item.nome === nomeJogador && item.time_id === timeAtual);
    if (!jogador || jogadorJaFoiEscolhido(nomeJogador)) return;

    const funcoesDisponiveis = listaFuncoes.filter(funcaoPermitida);
    if (funcoesDisponiveis.length === 0) return;

    if (listaFuncoes.length === 1) {
        const funcao = listaFuncoes[0];
        if (funcaoPermitida(funcao) && confirm(`Adicionar ${nomeJogador} ao roster como ${funcao}?`)) {
            escolherJogador(nomeJogador, funcao);
        }
        return;
    }

    jogadorEmSelecao = jogador;
    atualizarSeletorFuncao(nomeJogador, listaFuncoes);
}

// Dev2-> AngeloMatos08: Valida a nova regra de limite (até 2 da mesma função, máximo 1 das restantes)
function validarEContarFuncao(funcao) {
    const funcaoFormatada = normalizarNomeFuncao(funcao);
    if (!funcaoPermitida(funcao)) return false;
    funcoesPreenchidas[funcaoFormatada]++;
    return true;
}

// Dev2-> AngeloMatos08: Processa a escolha garantindo que a busca no JSON use 'j.nome'
function escolherJogador(nomeJogador, funcaoJogador) {
    if (jogadorJaFoiEscolhido(nomeJogador)) {
        alert(`❌ O jogador ${nomeJogador} já foi escolhido em outro ano!`);
        return;
    }

    if (!validarEContarFuncao(funcaoJogador)) {
        return;
    }

    const objetoJogador = listaDeJogadores.find(j => j.nome === nomeJogador && j.time_id === timeAtual);

    timeEscolhido.push({
        nome: nomeJogador,
        funcao: funcaoJogador,
        overall: objetoJogador ? objetoJogador.overall : 0
    });
    atualizarRoster();

    console.log('Jogador escolhido:', nomeJogador, 'Função:', funcaoJogador, timeEscolhido);

    if (timeEscolhido.length === 5) {
        finalizarDraft();
    } else {
        sortear(); // Dev2-> AngeloMatos08: Opcional - Sorteia um novo time após a escolha. Se quiser ficar no mesmo time, mude de volta para 'filtrarJogadoresPorTime()'.
    }
}

function jogadorJaFoiEscolhido(nomeJogador) {
    return timeEscolhido.some(jogador => jogador.nome === nomeJogador);
}

function finalizarDraft() {
    const somaOverall = timeEscolhido.reduce((soma, jogador) => soma + jogador.overall, 0);
    const mediaOverall = somaOverall / timeEscolhido.length;

    const resumo = document.getElementById('roster-summary');
    if (resumo) resumo.textContent = `Draft concluído · Overall médio ${mediaOverall.toFixed(1)}`;
    document.querySelectorAll('.painel-controles button').forEach(botao => { botao.disabled = true; });
}
// Dev2-> AngeloMatos08: Função de reroll do draft selecionando outro time aleatório criando o botão de reroll
function carregarTimePorId(timeId) {
    const jogadorExemplo = listaDeJogadores.find(jogador => jogador.time_id === timeId);

    if (!jogadorExemplo) {
        alert(`⚠️ Não foi possível localizar o time ${timeId}.`);
        return;
    }

    definirTimeAtual(timeId, jogadorExemplo.ano);
    filtrarJogadoresPorTime();
}

function rerollOutroTime() {
    const timesDisponiveis = [...new Set(listaDeJogadores.map(jogador => jogador.time_id))]
        .filter(timeId => timeId !== timeAtual);

    if (timesDisponiveis.length === 0) {
        alert('⚠️ Não há outro time disponível para sortear.');
        return;
    }

    const indiceAleatorio = Math.floor(Math.random() * timesDisponiveis.length);
    const novoTimeId = timesDisponiveis[indiceAleatorio];

    carregarTimePorId(novoTimeId);
}

function rerollMesmoTimeOutroAno() {
    const nomeTimeRef = nomeTimeAtual || (listaDeJogadores.find(jogador => jogador.time_id === timeAtual)?.nome_time ?? null);

    if (!nomeTimeRef) {
        alert('⚠️ Não foi possível identificar o time atual.');
        return;
    }

    const opcoesAno = listaDeJogadores.filter(jogador => jogador.nome_time === nomeTimeRef && jogador.ano !== anoAtual);

    if (opcoesAno.length === 0) {
        alert('Este time não possui outras temporadas cadastradas.');
        return;
    }

    const anosDisponiveis = [...new Set(opcoesAno.map(jogador => jogador.ano))];
    const anoSorteado = anosDisponiveis[Math.floor(Math.random() * anosDisponiveis.length)];

    carregarTimePorAno(nomeTimeRef, anoSorteado);
}

puxarJogadores();