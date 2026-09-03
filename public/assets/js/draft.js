// Dev2-> AngeloMatos08: Aqui ficarão os jogadores "puxados do banco de dados"
let listaDeJogadores = [];
// Dev2-> AngeloMatos08: Aqui ficará o time sorteado definido pela função sortear()
let timeAtual = null;

// Dev2-> AngeloMatos08: Função que puxa os jogadores do JSON

// Dev2-> AngeloMatos08: Pq async? Pq a função fetch() é assíncrona, ou seja, 
// ela não bloqueia a execução do código enquanto aguarda a resposta do servidor. 
// Isso significa que o código pode continuar sendo executado enquanto a requisição está 
// sendo processada, o que é importante para não travar a interface do usuário.
async function puxarJogadores() {
    try {
        // Dev2-> AngeloMatos08: Indo até o arquivo JSON que contém os jogadores
        const response = await fetch('assets/database/players.json');

        listaDeJogadores = await response.json();

        console.log('Jogadores carregados!', listaDeJogadores);
        
        // Dev2-> AngeloMatos08: Chamando a função que irá iniciar o draft
        iniciarDraft();
    } catch (error) {
        console.error('Erro ao carregar jogadores:', error);
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


//Parte do sorteio/draft
function sortear() {
    // Filtra os times disponiveis baseado na lista de jogadores puxada anteriormente
    // e em cada jogador ele pega o time_id,
    // e com o Set ele remove os duplicados
    const timesDisponiveis = [...new Set(listaDeJogadores.map(jogador => jogador.time_id))];
    console.log('Times disponíveis para sorteio:', timesDisponiveis);
    // Sorteia um índice aleatório baseado na quantidade de times disponíveis
    
    const indiceAleatorio = Math.floor(Math.random() * timesDisponiveis.length);
    // Pega o time sorteado baseado no índice aleatório
    timeAtual = timesDisponiveis[indiceAleatorio];
    console.log('Time sorteado:', timeAtual);
    // Executa a função que filtra os jogadores baseado no time sorteado junto do draft
    filtrarJogadoresPorTime();
}
// Função que filtra os jogadores baseado no time sorteado
function filtrarJogadoresPorTime() {
    const jogadoresFiltrados = listaDeJogadores.filter(jogador => jogador.time_id === timeAtual);
    console.log('Jogadores filtrados pelo time sorteado:', jogadoresFiltrados);

    //Função para exibir os jogadores filtrados no HTML
    exibirJogadoresNaTela(jogadoresFiltrados);
}

// Dev2-> AngeloMatos08: Função responsável por injetar os jogadores filtrados no HTML
function exibirJogadoresNaTela(jogadoresFiltrados) {
    // Dev2-> AngeloMatos08: Pega o container do HTML pelo ID
    const container = document.getElementById('container-jogadores');
    
    // Dev2-> AngeloMatos08: Limpa o container para remover os jogadores da rodada anterior
    container.innerHTML = `<h2>Escolha um jogador do time: ${timeAtual}</h2>`;

    // Dev2-> AngeloMatos08: Cria um elemento visual (card/botão) para cada jogador disponível
    jogadoresFiltrados.forEach(jogador => {
        const itemJogador = document.createElement('div');
        itemJogador.style.margin = "10px 0";
        
        itemJogador.innerHTML = `
            <span>${jogador.nome} (${jogador.funcao})</span>
            <button onclick="escolherJogador('${jogador.nome}')">Selecionar</button>
        `;
        
        // Dev2-> AngeloMatos08: Adiciona o jogador dentro do container na tela
        container.appendChild(itemJogador);
    });
}
puxarJogadores();