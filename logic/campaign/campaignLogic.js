
const API_URL = "http://localhost:3000/api/jogadores";

// Busca os jogadores pela API conectada ao MongoDB Atlas
async function carregarJogadores() {
    const resposta = await fetch(API_URL);

    if (!resposta.ok) {
        throw new Error(
            `Erro ao buscar jogadores: HTTP ${resposta.status}`
        );
    }

    return await resposta.json();
}

// Identifica os times históricos cadastrados
function obterTimesHistoricos(jogadores) {
    const times = new Map();

    for (const jogador of jogadores) {
        if (!times.has(jogador.time_id)) {
            times.set(jogador.time_id, {
                timeId: jogador.time_id,
                nome: jogador.nome_time,
                ano: jogador.ano
            });
        }
    }

    return Array.from(times.values());
}


 // Seleciona adversários históricos aleatoriamente
function selecionarAdversariosAleatorios(
    jogadores,
    quantidade = 7,
    timesExcluidos = []
) {
    // Identifica todos os times históricos cadastrados
    const timesHistoricos = obterTimesHistoricos(jogadores);

    // Cria um conjunto com os IDs que não podem ser selecionados
    const idsExcluidos = new Set(timesExcluidos);

    // Mantém somente times completos e não excluídos
    const timesValidos = timesHistoricos.filter(time => {
        const jogadoresDoTime = obterJogadoresDoTime(
            jogadores,
            time.timeId
        );

        return jogadoresDoTime.length === 5
            && !idsExcluidos.has(time.timeId);
    });

// Diagnóstico temporário
console.log("Total de jogadores recebidos:", jogadores.length);
console.log("Total de times históricos:", timesHistoricos.length);
console.log("Times excluídos:", timesExcluidos);
console.log("Times válidos para sorteio:", timesValidos.length);

    if (timesValidos.length < quantidade) {
        throw new Error(
            `Não existem times suficientes para selecionar ${quantidade} adversários.`
        );
    }

    // Cria uma cópia para não alterar a lista original
    const timesEmbaralhados = [...timesValidos];

    // Embaralha os times usando o algoritmo Fisher-Yates
    for (let i = timesEmbaralhados.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));

        [
            timesEmbaralhados[i],
            timesEmbaralhados[j]
        ] = [
            timesEmbaralhados[j],
            timesEmbaralhados[i]
        ];
    }

    // Retorna somente a quantidade solicitada
    return timesEmbaralhados.slice(0, quantidade);
}


// Busca os jogadores pertencentes a um time
function obterJogadoresDoTime(jogadores, timeId) {
    return jogadores.filter(
        jogador => jogador.time_id === timeId
    );
}

// Monta um time histórico no formato esperado pela lógica das partidas
function montarTimeHistorico(jogadores, timeId) {
    const jogadoresDoTime = obterJogadoresDoTime(
        jogadores,
        timeId
    );

    if (jogadoresDoTime.length !== 5) {
        throw new Error(
            `O time ${timeId} possui ${jogadoresDoTime.length} jogadores, mas deveria possuir exatamente 5.`
        );
    }

    const jogadoresFormatados = jogadoresDoTime.map(jogador => {
        const funcao = jogador.funcoes?.[0];

        if (!funcao) {
            throw new Error(
                `O jogador ${jogador.nome} não possui função cadastrada.`
            );
        }

        return {
            nome: jogador.nome,
            funcao: funcao.charAt(0).toUpperCase()
                + funcao.slice(1),
            overall: jogador.overall
        };
    });

    return {
        nome: jogadoresDoTime[0].nome_time,
        jogadores: jogadoresFormatados
    };
}


// Seleciona aleatoriamente um mapa da lista recebida.
 function selecionarMapaAleatorio(mapas) {
    if (!Array.isArray(mapas) || mapas.length === 0) {
        throw new Error(
            "Não existem mapas disponíveis para a partida."
        );
    }

    const indiceAleatorio = Math.floor(
        Math.random() * mapas.length
    );

    const mapaSelecionado = mapas[indiceAleatorio];

    return {
        id: mapaSelecionado.mapa_id,
        nome: mapaSelecionado.nome_mapa,
        ladoFavorecido: mapaSelecionado.lado_favorecido
    };
}


module.exports = {
    carregarJogadores,
    obterTimesHistoricos,
    selecionarAdversariosAleatorios,
    obterJogadoresDoTime,
    montarTimeHistorico,
    selecionarMapaAleatorio
};
