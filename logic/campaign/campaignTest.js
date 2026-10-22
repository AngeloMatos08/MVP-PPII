
const Match = require("../matches/matches");
const { simularPartida } = require("../matches/matchesLogic");
const Campaign = require("./campaign");

const {
    carregarJogadores,
    obterTimesHistoricos,
    selecionarAdversariosAleatorios,
    montarTimeHistorico
} = require("./campaignLogic");


// TIME FRANKENSTEIN FICTÍCIO PARA TESTES
const jogadoresFrankenstein = [
    { nome: "Jogador 1", funcao: "Duelista", overall: 95 },
    { nome: "Jogador 2", funcao: "Iniciador", overall: 92 },
    { nome: "Jogador 3", funcao: "Controlador", overall: 90 },
    { nome: "Jogador 4", funcao: "Sentinela", overall: 91 },
    { nome: "Jogador 5", funcao: "Sentinela", overall: 89 }
];

class Time {
    constructor(nome, jogadores) {
        this.nome = nome;
        this.jogadores = jogadores;
    }
}

const timeJogador = new Time(
    "Time Frankenstein",
    jogadoresFrankenstein
);


// CONFIGURAÇÃO DO MAPA DE TESTE
const mapaTeste = {
    nome: "Ascent",
    ladoFavorecido: "defesa",
    ladoInicialTimeA: "ataque"
};


// EXECUÇÃO DA CAMPANHA COMPLETA
async function executarTestes() {
    console.log("===== TESTE DA CAMPANHA COMPLETA =====\n");

    // 1. CARREGA OS JOGADORES DO BANCO
    const jogadoresBanco = await carregarJogadores();

    console.log(
        "Total de jogadores recebidos do banco:",
        jogadoresBanco.length
    );

    // 2. IDENTIFICA OS TIMES HISTÓRICOS
    const timesHistoricos = obterTimesHistoricos(jogadoresBanco);

    console.log(
        "Total de times históricos encontrados:",
        timesHistoricos.length
    );

    // 3. SORTEIA OS SETE ADVERSÁRIOS
    const adversariosSelecionados =
        selecionarAdversariosAleatorios(jogadoresBanco);

    console.log("\n===== ADVERSÁRIOS SORTEADOS =====");

    adversariosSelecionados.forEach((adversario, indice) => {
        console.log(
            `${indice + 1}. ${adversario.nome} (${adversario.ano})` +
            ` - ID: ${adversario.timeId}`
        );
    });

    console.log(
        "\nQuantidade de adversários selecionados:",
        adversariosSelecionados.length
    );

    // 4. CRIA A CAMPANHA
    const campanhaTeste = new Campaign(
        timeJogador,
        adversariosSelecionados
    );

    console.log("\n===== ESTADO INICIAL DA CAMPANHA =====");
    console.log("Vitórias:", campanhaTeste.vitorias);
    console.log("Derrotas:", campanhaTeste.derrotas);
    console.log("Estado:", campanhaTeste.estado);

    // 5. ENFRENTA OS ADVERSÁRIOS EM SEQUÊNCIA
    let numeroPartida = 0;

    for (const adversario of adversariosSelecionados) {
        // Não continua se a campanha já tiver terminado
        if (campanhaTeste.estado !== "em andamento") {
            break;
        }

        numeroPartida++;

        // Monta a equipe adversária com os dados do banco
        const timeRival = montarTimeHistorico(
            jogadoresBanco,
            adversario.timeId
        );

        // Cria uma nova partida
        const mapaPartida = { ...mapaTeste };

        const partidaTeste = new Match(
            timeJogador,
            timeRival,
            mapaPartida
        );

        console.log(`\n===== PARTIDA ${numeroPartida} =====`);
        console.log("Time A:", partidaTeste.timeA.nome);
        console.log("Time B:", partidaTeste.timeB.nome);
        console.log("Mapa:", mapaPartida.nome);
        console.log("Lado inicial do Time A:", partidaTeste.ladoA);
        console.log("Lado inicial do Time B:", partidaTeste.ladoB);
        console.log("Lado favorecido:", mapaPartida.ladoFavorecido);

        console.log("\n--- SIMULAÇÃO DA PARTIDA ---");

        // Simula as rodadas até a partida terminar
        simularPartida(partidaTeste);

        console.log(
            "Placar:",
            `${partidaTeste.timeA.nome} ${partidaTeste.placarA}` +
            ` x ${partidaTeste.placarB} ${partidaTeste.timeB.nome}`
        );

        console.log(
            "Rodadas jogadas:",
            partidaTeste.rodadasJogadas
        );

        console.log("Vencedor:", partidaTeste.vencedor.nome);

        // Registra o resultado na campanha
        campanhaTeste.registrarResultado(partidaTeste);

        console.log("\n--- ESTADO DA CAMPANHA ---");
        console.log("Vitórias:", campanhaTeste.vitorias);
        console.log("Derrotas:", campanhaTeste.derrotas);
        console.log("Estado:", campanhaTeste.estado);

        // Uma derrota encerra a campanha imediatamente
        if (campanhaTeste.estado === "eliminado") {
            console.log("\nO Time Frankenstein foi eliminado!");
            break;
        }

        // Sete vitórias garantem o título
        if (campanhaTeste.estado === "campeão") {
            console.log("\nO Time Frankenstein conquistou o título!");
            break;
        }
    }

    // 6. EXIBE O RESULTADO FINAL
    console.log("\n===== RESULTADO FINAL DA CAMPANHA =====");
    console.log("Partidas disputadas:", numeroPartida);
    console.log("Vitórias:", campanhaTeste.vitorias);
    console.log("Derrotas:", campanhaTeste.derrotas);
    console.log("Estado final:", campanhaTeste.estado);

    console.log("\n===== FIM DO TESTE =====");
}


// TRATA EVENTUAIS ERROS NO CARREGAMENTO OU NA SIMULAÇÃO
executarTestes().catch((erro) => {
    console.error("\nERRO AO EXECUTAR A CAMPANHA:");
    console.error(erro.message);
});
