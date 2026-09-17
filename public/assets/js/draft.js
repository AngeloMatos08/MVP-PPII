// Dev2-> AngeloMatos08: Aqui ficarão os jogadores "puxados do banco de dados"
let listaDeJogadores = [];
// Dev2-> AngeloMatos08: Aqui ficará o time sorteado e o ano definido pela função sortear()
let timeAtual = null;
let nomeTimeAtual = null;
let anoAtual = null;

// Dev2-> AngeloMatos08: Aqui ficará o time escolhido pelo usuário
let timeEscolhido = [];

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

    exibirJogadoresNaTela(jogadoresFiltrados);
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
    container.innerHTML = `<h2>Escolha um jogador do time: ${timeAtual}</h2>`;

    jogadoresFiltrados.forEach((jogador) => {
        const itemJogador = document.createElement('div');
        itemJogador.style.margin = "10px 0";
        
        const jaFoiEscolhido = timeEscolhido.some(j => j.nome === jogador.nome);

        if (jaFoiEscolhido) {
            itemJogador.style.color = 'gray';
            itemJogador.style.textDecoration = 'line-through';
            itemJogador.innerHTML = `<span>${jogador.nome} (${jogador.funcoes}) - Overall: ${jogador.overall} - Já escolhido</span>`;
        } else {
            // Dev2-> AngeloMatos08: Garante a conversão para Array em qualquer formato de dados do JSON
            let listaFuncoes = [];
            if (Array.isArray(jogador.funcoes)) {
                listaFuncoes = jogador.funcoes;
            } else if (typeof jogador.funcoes === 'string') {
                listaFuncoes = jogador.funcoes.split(',').map(f => f.trim());
            } else {
                listaFuncoes = [jogador.funcoes];
            }

            let htmlFuncoes = '';
            const idUnicoSelect = `select-funcao-${jogador.nome.replace(/\s+/g, '')}`;

            // Dev2-> AngeloMatos08: Se o atleta tiver 2+ funções, cria o dropdown
            if (listaFuncoes.length > 1) {
                htmlFuncoes = `<select id="${idUnicoSelect}">
                    <option value="" disabled selected>Escolha a função...</option>`;
                listaFuncoes.forEach(funcao => {
                    htmlFuncoes += `<option value="${funcao}">${funcao}</option>`;
                });
                htmlFuncoes += `</select>`;
            } else {
                htmlFuncoes = `<span>(${listaFuncoes[0]})</span>`;
            }

            itemJogador.innerHTML = `
                <span><strong>${jogador.nome}</strong></span>
                ${htmlFuncoes}
                <span>- Overall: ${jogador.overall}</span>
                <button onclick="prepararEscolha('${jogador.nome}', ${JSON.stringify(listaFuncoes).replace(/"/g, '&quot;')})">Selecionar</button>
            `;
        }

        container.appendChild(itemJogador);
    });
}

// Dev2-> AngeloMatos08: Lê o dropdown com segurança
function prepararEscolha(nomeJogador, listaFuncoes) {
    let funcaoSelecionada = '';

    if (listaFuncoes.length > 1) {
        const idUnicoSelect = `select-funcao-${nomeJogador.replace(/\s+/g, '')}`;
        const selectElement = document.getElementById(idUnicoSelect);
        
        if (selectElement) {
            funcaoSelecionada = selectElement.value;
        }

        if (!funcaoSelecionada) {
            alert(`⚠️ Por favor, selecione qual função o jogador ${nomeJogador} vai exercer!`);
            return;
        }
    } else {
        funcaoSelecionada = listaFuncoes[0];
    }

    escolherJogador(nomeJogador, funcaoSelecionada);
}

// Dev2-> AngeloMatos08: Valida a nova regra de limite (até 2 da mesma função, máximo 1 das restantes)
function validarEContarFuncao(funcao) {
    const funcaoFormatada = funcao.toLowerCase();

    if (timeEscolhido.length >= 5) {
        alert("⚠️ O seu time já possui 5 jogadores!");
        return false;
    }

    if (funcoesPreenchidas[funcaoFormatada] >= 2) {
        alert(`❌ Você já possui 2 jogadores na função ${funcao}! O limite máximo de repetição é 2.`);
        return false;
    }

    const jaExisteAlgumaFuncaoDuplicada = Object.values(funcoesPreenchidas).some(qtd => qtd >= 2);

    if (jaExisteAlgumaFuncaoDuplicada && funcoesPreenchidas[funcaoFormatada] >= 1) {
        alert(`❌ Você já possui uma função duplicada no time. As funções restantes só podem ter 1 jogador!`);
        return false;
    }

    if (funcoesPreenchidas[funcaoFormatada] !== undefined) {
        funcoesPreenchidas[funcaoFormatada]++;
    }

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

    const painelControles = document.querySelector('.painel-controles');
    if (painelControles) {
        painelControles.style.display = 'none';
    }

    const container = document.getElementById('container-jogadores');
    container.innerHTML = `
        <h2>Draft Concluído!</h2>
        <p><strong>Média Geral do Time:</strong> ${mediaOverall}</p>
        <ul>
            ${timeEscolhido.map(j => `<li>${j.nome} - ${j.funcao} (Overall: ${j.overall})</li>`).join('')}
        </ul>
    `;
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