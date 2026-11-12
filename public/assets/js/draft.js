// Dev2-> AngeloMatos08: Aqui ficarão os jogadores "puxados do banco de dados"
let listaDeJogadores = [];
// Dev2-> AngeloMatos08: Aqui ficará o time sorteado e o ano definido pela função sortear()
let timeAtual = null;
let nomeTimeAtual = null;
let anoAtual = null;

// Dev2-> AngeloMatos08: Aqui ficará o time escolhido pelo usuário
let timeEscolhido = [];
let jogadorEmSelecao = null;

let funcoesPreenchidas = {
    duelista: 0,
    sentinela: 0,
    iniciador: 0,
    controlador: 0
}

// Contador único de rerolls compartilhados
let rerollsRestantes = 2;

const coresPorTime = {
    '100thieves': { inicio: 'F23535', fim: 'F23535' },
    acend: { inicio: '6738EC', fim: '6738EC' },
    bilibiligaming: { inicio: 'FF198F', fim: '36D0F4' },
    boomesports: { inicio: '515761', fim: 'B30314' },
    cloud9: { inicio: '26ACE2', fim: '26ACE2' },
    crazyraccoon: { inicio: 'F30614', fim: '000000' },
    drx: { inicio: '2307FF', fim: '2307FF' },
    edwardgaming: { inicio: 'FF0000', fim: 'FF0000' },
    envy: { inicio: '1179F4', fim: 'B7B7B7' },
    evilgeniuses: { inicio: '202D5A', fim: '202D5A' },
    fnatic: { inicio: 'FF5900', fim: 'FF5900' },
    fpx: { inicio: 'FF0600', fim: 'FF0600' },
    fullsense: { inicio: 'FD7B01', fim: 'FD7B01' },
    furia: { inicio: '000000', fim: 'EEEEEE' },
    futesports: { inicio: 'ED1A3A', fim: '121824' },
    gambit: { inicio: 'E4002B', fim: 'E4002B' },
    giantsgaming: { inicio: 'EEEEEE', fim: '000000' },
    keydstars: { inicio: '5C2A82', fim: '5C2A82' },
    kru: { inicio: 'FF198F', fim: 'FF198F' },
    leviatan: { inicio: '69ABDC', fim: '69ABDC' },
    loud: { inicio: '13FF00', fim: '13FF00' },
    navi: { inicio: 'FFED00', fim: 'FFED00' },
    nrg: { inicio: 'F73D0A', fim: 'F73D0A' },
    optic: { inicio: '92C950', fim: '92C950' },
    paperrex: { inicio: 'FF07CD', fim: 'FF07CD' },
    sentinels: { inicio: 'CE0037', fim: 'CE0037' },
    t1: { inicio: 'E2012D', fim: 'E2012D' },
    teamliquid: { inicio: 'EEEEEE', fim: '001538' },
    teamsecret: { inicio: 'EEEEEE', fim: 'EEEEEE' },
    teamvikings: { inicio: 'DBD595', fim: 'DBD595' },
    visionstrikers: { inicio: 'D40080', fim: 'D40080' },
    x10esports: { inicio: 'D2D1D2', fim: 'D2D1D2' },
    xerxia: { inicio: 'FF198F', fim: 'FF198F' },
    xset: { inicio: 'F40F30', fim: 'F40F30' },
    zetadivision: { inicio: 'EEEEEE', fim: '000000' }
};

function precarregarLogos() {
    const nomesTimes = [...new Set(listaDeJogadores.map(j => {
        const nome = j.nome_time || '';
        return nome.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, '');
    }))];

    nomesTimes.forEach(nomeNorm => {
        const arquivos = [`${nomeNorm}.png`, `${nomeNorm}.svg`];
        arquivos.forEach(arq => {
            const img = new Image();
            img.src = `assets/images/logos_times/${arq}`;
        });
    });
}

async function puxarJogadores() {
    try {
        const response = await fetch('http://localhost:3000/api/jogadores');
        listaDeJogadores = await response.json();
        console.log('Jogadores carregados do Banco de Dados!', listaDeJogadores);

        precarregarLogos();
        iniciarDraft();
    } catch (error) {
        console.error('Erro ao carregar jogadores do banco:', error);
    }
}

function iniciarDraft() {
    console.log('Iniciando o draft com ' + listaDeJogadores.length + ' jogadores.');
    if (listaDeJogadores.length > 0) {
        sortear();
    } else {
        console.log('Nenhum jogador disponível para o draft.');
    }
}

function definirTimeAtual(timeId, ano = null) {
    timeAtual = timeId;

    const jogadorExemplo = listaDeJogadores.find(jogador => jogador.time_id === timeId);
    nomeTimeAtual = jogadorExemplo ? jogadorExemplo.nome_time : null;
    anoAtual = ano ?? (jogadorExemplo ? jogadorExemplo.ano : null);
}

// Roleta geral para troca de times
function rodarRoletaTime(timeDestinoId, aoFinalizar) {
    const timesDisponiveis = [...new Set(listaDeJogadores.map(jogador => jogador.time_id))];
    if (timesDisponiveis.length <= 1) {
        aoFinalizar();
        return;
    }

    const destaque = document.getElementById('team-highlight');
    if (destaque) {
        destaque.classList.add('highlight-animating');
    }

    let passos = 12;
    let intervalo = 40;
    let passoAtual = 0;

    function girar() {
        passoAtual++;
        const randomTimeId = timesDisponiveis[Math.floor(Math.random() * timesDisponiveis.length)];
        const jogadorExemplo = listaDeJogadores.find(j => j.time_id === randomTimeId);
        if (jogadorExemplo) {
            atualizarDestaqueTime(jogadorExemplo);
        }

        if (passoAtual < passos) {
            intervalo += 25;
            setTimeout(girar, intervalo);
        } else {
            const jogadorFinal = listaDeJogadores.find(j => j.time_id === timeDestinoId);
            if (jogadorFinal) {
                atualizarDestaqueTime(jogadorFinal);
            }
            if (destaque) {
                destaque.classList.remove('highlight-animating');
                destaque.classList.add('highlight-pulse');
                setTimeout(() => destaque.classList.remove('highlight-pulse'), 400);
            }
            aoFinalizar();
        }
    }

    girar();
}

// Roleta específica apenas entre os anos do MESMO time
function rodarRoletaAno(nomeTime, anoDestino, aoFinalizar) {
    const opcoesAno = listaDeJogadores.filter(jogador => jogador.nome_time === nomeTime);
    const anosDisponiveis = [...new Set(opcoesAno.map(j => j.ano))];

    if (anosDisponiveis.length <= 1) {
        aoFinalizar();
        return;
    }

    const destaque = document.getElementById('team-highlight');
    if (destaque) {
        destaque.classList.add('highlight-animating');
    }

    let passos = 8;
    let intervalo = 50;
    let passoAtual = 0;

    function girarAno() {
        passoAtual++;
        const anoAleatorio = anosDisponiveis[Math.floor(Math.random() * anosDisponiveis.length)];
        const jogadorExemplo = opcoesAno.find(j => j.ano === anoAleatorio);
        if (jogadorExemplo) {
            atualizarDestaqueTime(jogadorExemplo);
        }

        if (passoAtual < passos) {
            intervalo += 30;
            setTimeout(girarAno, intervalo);
        } else {
            const jogadorFinal = opcoesAno.find(j => j.ano === anoDestino);
            if (jogadorFinal) {
                atualizarDestaqueTime(jogadorFinal);
            }
            if (destaque) {
                destaque.classList.remove('highlight-animating');
                destaque.classList.add('highlight-pulse');
                setTimeout(() => destaque.classList.remove('highlight-pulse'), 400);
            }
            aoFinalizar();
        }
    }

    girarAno();
}

function sortear() {
    const timesDisponiveis = [...new Set(listaDeJogadores.map(jogador => jogador.time_id))];
    const indiceAleatorio = Math.floor(Math.random() * timesDisponiveis.length);
    const timeSorteado = timesDisponiveis[indiceAleatorio];

    rodarRoletaTime(timeSorteado, () => {
        definirTimeAtual(timeSorteado);
        filtrarJogadoresPorTime();
    });
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

// Cálculo de Ataque, Defesa e Geral baseado nos fatores das funções
function calcularEstatisticasRoster() {
    if (timeEscolhido.length === 0) return { atk: '—', def: '—', geral: '—' };

    const fatoresFuncao = {
        duelista: { atkF: 1.40, defF: 1.00 },
        iniciador: { atkF: 1.25, defF: 1.15 },
        controlador: { atkF: 1.15, defF: 1.25 },
        sentinela: { atkF: 1.00, defF: 1.40 }
    };

    let somaAtk = 0;
    let somaDef = 0;

    timeEscolhido.forEach(jogador => {
        const funcaoNorm = normalizarNomeFuncao(jogador.funcao);
        const fator = fatoresFuncao[funcaoNorm] || { atkF: 1.00, defF: 1.00 };

        somaAtk += Number(jogador.overall) * fator.atkF;
        somaDef += Number(jogador.overall) * fator.defF;
    });

    const ataqueFinal = somaAtk / 5;
    const defesaFinal = somaDef / 5;
    const forcaGeral = (ataqueFinal + defesaFinal) / 2;

    return {
        atk: ataqueFinal.toFixed(1),
        def: defesaFinal.toFixed(1),
        geral: forcaGeral.toFixed(1),
    };
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
    const arquivosLogo = [`${nomeNormalizado}.png`, `${nomeNormalizado}.svg`];

    if (nomeElemento) nomeElemento.textContent = nome;
    if (campeonato) campeonato.textContent = jogador.ano ? `Champions ${jogador.ano}` : 'Temporada';

    atualizarBotoesReroll();

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

function atualizarBotoesReroll() {
    const btnOutroTime = document.getElementById('btn-outro-time');
    const btnOutroAno = document.getElementById('btn-outro-ano');

    if (btnOutroTime) btnOutroTime.textContent = `Outro Time (${rerollsRestantes})`;
    if (btnOutroAno) btnOutroAno.textContent = `Outro Ano (${rerollsRestantes})`;

    if (rerollsRestantes <= 0) {
        if (btnOutroTime) btnOutroTime.disabled = true;
        if (btnOutroAno) btnOutroAno.disabled = true;
    }
}

function carregarTimePorAno(nomeTime, ano) {
    const jogadoresDoTime = listaDeJogadores.filter(jogador => jogador.nome_time === nomeTime && jogador.ano === ano);

    if (!jogadoresDoTime.length) {
        alert(`⚠️ Não foi possível encontrar o time ${nomeTime} no ano ${ano}.`);
        return;
    }''

    timeAtual = jogadoresDoTime[0].time_id;
    nomeTimeAtual = nomeTime;
    anoAtual = ano;

    filtrarJogadoresPorTime();
}

function exibirJogadoresNaTela(jogadoresFiltrados) {
    const container = document.getElementById('players-wrapper') || document.getElementById('container-jogadores');
    if (!container) return;
    container.replaceChildren();

    jogadoresFiltrados.forEach((jogador) => {
        const itemJogador = document.createElement('div');
        itemJogador.className = 'player-item';

        const jaFoiEscolhido = timeEscolhido.some(j => j.nome === jogador.nome);
        const podeSerEscolhido = jogadorPodeSerEscolhido(jogador);

        const nome = document.createElement('p');
        nome.className = 'jogador-nome';
        nome.textContent = jogador.nome;

        const direita = document.createElement('div');
        direita.className = 'jogador-direita';

        // Renderiza os ícones e o overall independentemente de estar disponível ou não, para manter a aparência igual
        const listaFuncoes = obterListaFuncoes(jogador);
        const icones = document.createElement('div');
        icones.className = 'role-icons-wrapper';
        
        listaFuncoes.forEach(funcao => {
            const caminhoIcone = obterIconeFuncao(funcao);
            if (!caminhoIcone) return;
            const icone = document.createElement('img');
            icone.src = caminhoIcone;
            icone.alt = String(funcao);
            icone.title = String(funcao);
            icone.className = 'role-icon-small';
            icones.appendChild(icone);
        });

        const overall = document.createElement('span');
        overall.className = 'jogador-overall';
        overall.textContent = jogador.overall ?? '—';

        direita.appendChild(icones);
        direita.appendChild(overall);
        itemJogador.append(nome, direita);

        // Se o jogador NÃO puder ser escolhido, aplicamos a classe de desativado e não adicionamos eventos de clique
        if (jaFoiEscolhido || !podeSerEscolhido) {
            itemJogador.classList.add('player-item-disabled');
            itemJogador.tabIndex = -1;
            itemJogador.setAttribute('aria-disabled', 'true');
        } else {
            // Se estiver disponível, comporta-se normalmente como botão
            itemJogador.setAttribute('role', 'button');
            itemJogador.tabIndex = 0;
            itemJogador.setAttribute('aria-disabled', 'false');
            itemJogador.setAttribute('aria-label', `Selecionar ${jogador.nome}, overall ${jogador.overall ?? 'indisponível'}`);
            
            itemJogador.addEventListener('click', () => prepararEscolha(jogador.nome, listaFuncoes, itemJogador));
            itemJogador.addEventListener('keydown', evento => {
                if (evento.key === 'Enter' || evento.key === ' ') {
                    evento.preventDefault();
                    prepararEscolha(jogador.nome, listaFuncoes, itemJogador);
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
    opcoes.appendChild(instrucao);
}

function atualizarSeletorFuncao(nomeJogador, listaFuncoes) {
    const rolePicker = document.getElementById('role-picker');
    const titulo = document.getElementById('role-picker-title');
    const dica = document.getElementById('role-picker-hint');
    const opcoes = document.getElementById('role-picker-options');

    if (rolePicker) {
        rolePicker.classList.add('role-picker-active');
        setTimeout(() => {
            rolePicker.classList.remove('role-picker-active');
        }, 300);
    }

    if (titulo) titulo.textContent = `Escolha a função de ${nomeJogador}`;
    if (dica) dica.textContent = 'Clique na função para confirmar e adicionar à sua equipe';
    if (!opcoes) return;

    opcoes.replaceChildren();
    listaFuncoes.forEach(funcao => {
        const iconeSrc = obterIconeFuncao(funcao);
        const permitido = funcaoPermitida(funcao);
        const botao = document.createElement('button');
        botao.type = 'button';
        botao.disabled = !permitido;
        botao.className = `role-btn ${permitido ? '' : 'disabled'}`;
        botao.setAttribute('aria-label', `${funcao}${permitido ? '' : ', indisponível pelas regras do roster'}`);
        if (iconeSrc) {
            const icone = document.createElement('img');
            icone.src = iconeSrc;
            icone.alt = '';
            icone.className = 'role-picker-icon';
            botao.appendChild(icone);
        }
        const rotulo = document.createElement('span');
        rotulo.className = 'role-btn-label';
        rotulo.textContent = funcao;
        botao.appendChild(rotulo);
        if (permitido) {
            botao.addEventListener('click', () => {
                botao.classList.add('role-btn-selected');
                if (jogadorEmSelecao) escolherJogador(jogadorEmSelecao.nome, funcao);
            });
        }
        opcoes.appendChild(botao);
    });
}

function atualizarRoster() {
    const container = document.getElementById('roster-list');
    const resumo = document.getElementById('roster-summary');

    const statAtk = document.getElementById('stat-atk');
    const statDef = document.getElementById('stat-def');
    const statGeral = document.getElementById('stat-geral');
    const stats = calcularEstatisticasRoster();

    if (statAtk) statAtk.textContent = stats.atk;
    if (statDef) statDef.textContent = stats.def;
    if (statGeral) statGeral.textContent = stats.geral;

    if (!container) return;
    container.replaceChildren();

    timeEscolhido.forEach((jogador, index) => {
        const item = document.createElement('div');
        item.className = 'roster-item';

        setTimeout(() => {
            item.classList.add('active');
        }, 10);

        const overall = document.createElement('span');
        overall.className = 'jogador-overall';
        overall.textContent = jogador.overall;

        const nome = document.createElement('span');
        nome.className = 'jogador-nome';
        nome.textContent = jogador.nome;

        const funcao = document.createElement('span');
        funcao.className = 'funcao-nome';
        funcao.textContent = jogador.funcao;

        const direita = document.createElement('span');
        direita.className = 'roster-right';

        const iconeSrc = obterIconeFuncao(jogador.funcao);

        if (iconeSrc) {
            const icone = document.createElement('img');
            direita.appendChild(icone);
            direita.appendChild(overall);
            icone.src = iconeSrc;
            icone.alt = String(jogador.funcao);
            icone.className = 'roster-icon';
            item.append(nome, direita);
        } else {
            direita.appendChild(funcao);
            direita.appendChild(overall);
            item.append(nome, direita);
        }
        container.appendChild(item);
    });

    if (resumo) {
        resumo.textContent = timeEscolhido.length ? `${timeEscolhido.length}/5 JOGADORES` : '';
    }
}

function prepararEscolha(nomeJogador, listaFuncoes, elementoLinha) {
    const jogador = listaDeJogadores.find(item => item.nome === nomeJogador && item.time_id === timeAtual);
    if (!jogador || jogadorJaFoiEscolhido(nomeJogador)) return;

    const funcoesDisponiveis = listaFuncoes.filter(funcaoPermitida);
    if (funcoesDisponiveis.length === 0) return;

    if (elementoLinha) {
        document.querySelectorAll('.player-item').forEach(item => {
            item.classList.remove('player-item-selected');
        });
        elementoLinha.classList.add('player-item-pressed');
        elementoLinha.classList.add('player-item-selected');
        setTimeout(() => elementoLinha.classList.remove('player-item-pressed'), 300);
    }

    jogadorEmSelecao = jogador;
    atualizarSeletorFuncao(nomeJogador, listaFuncoes);
}

function validarEContarFuncao(funcao) {
    const funcaoFormatada = normalizarNomeFuncao(funcao);
    if (!funcaoPermitida(funcao)) return false;
    funcoesPreenchidas[funcaoFormatada]++;
    return true;
}

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
        sortear();
    }
}

function jogadorJaFoiEscolhido(nomeJogador) {
    return timeEscolhido.some(jogador => jogador.nome === nomeJogador);
}

function finalizarDraft() {
    const somaOverall = timeEscolhido.reduce((soma, jogador) => soma + jogador.overall, 0);
    const mediaOverall = somaOverall / timeEscolhido.length;

    const resumo = document.getElementById('roster-summary');
    if (resumo) {
        resumo.textContent = `Draft concluído`;
    }

    const containerAcoes = document.querySelector('.draft-section-right');
    if (containerAcoes) {
        let blocoAcoes = document.getElementById('draft-actions');

        if (!blocoAcoes) {
            blocoAcoes = document.createElement('div');
            blocoAcoes.id = 'draft-actions';
            blocoAcoes.className = 'draft-actions';
            containerAcoes.appendChild(blocoAcoes);
        }

        blocoAcoes.replaceChildren();

        const botaoCampanha = document.createElement('button');
        botaoCampanha.type = 'button';
        botaoCampanha.className = 'btn-primary btn-campaign';
        botaoCampanha.textContent = 'Começar campanha';

        botaoCampanha.addEventListener('click', () => {
            if (botaoCampanha.dataset.busy === 'true') return;

            botaoCampanha.dataset.busy = 'true';
            botaoCampanha.textContent = 'Preparando campanha...';

            const timeJogador = {
                nome: 'Meu Time',
                jogadores: timeEscolhido.map(jogador => ({
                    nome: jogador.nome,
                    funcao: jogador.funcao,
                    overall: Number(jogador.overall)
                }))
            };

            sessionStorage.setItem('mvpDraftTime', JSON.stringify(timeJogador));
            window.location.href = 'campanha.html';
        });

        blocoAcoes.appendChild(botaoCampanha);
    }

    document.querySelectorAll('.painel-controles button').forEach(botao => { botao.disabled = true; });
}

function carregarTimePorId(timeId) {
    const jogadorExemplo = listaDeJogadores.find(jogador => jogador.time_id === timeId);

    if (!jogadorExemplo) {
        alert(`⚠️ Não foi possível localizar o time ${timeId}.`);
        return;
    }

    rodarRoletaTime(timeId, () => {
        definirTimeAtual(timeId, jogadorExemplo.ano);
        filtrarJogadoresPorTime();
    });
}

function rerollOutroTime() {
    if (rerollsRestantes <= 0) {
        alert('❌ Você esgotou seus rerolls!');
        return;
    }

    const timesDisponiveis = [...new Set(listaDeJogadores.map(jogador => jogador.time_id))]
        .filter(timeId => timeId !== timeAtual);

    if (timesDisponiveis.length === 0) {
        alert('⚠️ Não há outro time disponível para sortear.');
        return;
    }

    rerollsRestantes--;
    const indiceAleatorio = Math.floor(Math.random() * timesDisponiveis.length);
    const novoTimeId = timesDisponiveis[indiceAleatorio];

    carregarTimePorId(novoTimeId);
}

function rerollMesmoTimeOutroAno() {
    if (rerollsRestantes <= 0) {
        alert('❌ Você esgotou seus rerolls!');
        return;
    }

    const nomeTimeRef = nomeTimeAtual || (listaDeJogadores.find(jogador => jogador.time_id === timeAtual)?.nome_time ?? null);

    if (!nomeTimeRef) {
        alert('❌ Não foi possível identificar o time atual.');
        return;
    }

    const opcoesAno = listaDeJogadores.filter(jogador => jogador.nome_time === nomeTimeRef && jogador.ano !== anoAtual);

    if (opcoesAno.length === 0) {
        alert('Este time não possui outras temporadas cadastradas.');
        return;
    }

    rerollsRestantes--;
    const anosDisponiveis = [...new Set(opcoesAno.map(jogador => jogador.ano))];
    const anoSorteado = anosDisponiveis[Math.floor(Math.random() * anosDisponiveis.length)];

    rodarRoletaAno(nomeTimeRef, anoSorteado, () => {
        carregarTimePorAno(nomeTimeRef, anoSorteado);
    });
}

puxarJogadores();