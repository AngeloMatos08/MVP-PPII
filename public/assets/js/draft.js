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

    timeAtual = timesDisponiveis[indiceAleatorio];
    console.log('Time sorteado:', timeAtual);

    filtrarJogadoresPorTime();
}

function filtrarJogadoresPorTime() {
    const jogadoresFiltrados = listaDeJogadores.filter(jogador => jogador.time_id === timeAtual);
    console.log('Jogadores filtrados pelo time sorteado:', jogadoresFiltrados);
}
puxarJogadores();