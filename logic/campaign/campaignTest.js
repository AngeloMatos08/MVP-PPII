
const Match = require("../matches/matches");
const { simularPartida } = require("../matches/matchesLogic");
const Campaign = require("./campaign");
const { VITORIAS_PARA_TITULO } = Campaign;

const {
    carregarJogadores,
    obterTimesHistoricos,
    selecionarAdversariosAleatorios,
    obterJogadoresDoTime,
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


// TESTES ISOLADOS DA CLASSE CAMPAIGN
function testarRegrasCampaign() {
    console.log("\n===== TESTES DAS REGRAS DA CAMPANHA =====");

    let testesAprovados = 0;
    let testesExecutados = 0;

    function verificar(condicao, descricao) {
        testesExecutados++;

        if (condicao) {
            testesAprovados++;
            console.log(`[PASSOU] ${descricao}`);
        } else {
            console.error(`[FALHOU] ${descricao}`);
        }
    }

    // TESTE 1: ESTADO INICIAL
    const campanhaInicial = new Campaign(timeJogador, []);

    verificar(
        campanhaInicial.vitorias === 0
        && campanhaInicial.derrotas === 0
        && campanhaInicial.estado === "em andamento",
        "Inicialização correta da campanha"
    );

    // TESTE 2: REGISTRO DE UMA VITÓRIA
    const campanhaVitoria = new Campaign(timeJogador, []);

    campanhaVitoria.registrarResultado({
        vencedor: { nome: timeJogador.nome }
    });

    verificar(
        campanhaVitoria.vitorias === 1
        && campanhaVitoria.derrotas === 0
        && campanhaVitoria.estado === "em andamento",
        "Vitória contabilizada corretamente"
    );

    // TESTE 3: REGISTRO DE UMA DERROTA
    const campanhaDerrota = new Campaign(timeJogador, []);

    campanhaDerrota.registrarResultado({
        vencedor: { nome: "Time Rival" }
    });

    verificar(
        campanhaDerrota.vitorias === 0
        && campanhaDerrota.derrotas === 1
        && campanhaDerrota.estado === "eliminado",
        "Derrota provoca eliminação imediata"
    );

    // TESTE 4: QUATRO VITÓRIAS CONSECUTIVAS
    const campanhaCampea = new Campaign(timeJogador, []);

    for (let i = 0; i < VITORIAS_PARA_TITULO; i++) {
        campanhaCampea.registrarResultado({
            vencedor: { nome: timeJogador.nome }
        });
    }

    verificar(
        campanhaCampea.vitorias === VITORIAS_PARA_TITULO
        && campanhaCampea.derrotas === 0
        && campanhaCampea.estado === "campeão",
        "Quatro vitórias garantem o título"
    );

    // TESTE 5: BLOQUEIO APÓS ELIMINAÇÃO
    let bloqueioDerrota = false;

    try {
        campanhaDerrota.registrarResultado({
            vencedor: { nome: timeJogador.nome }
        });
    } catch (erro) {
        bloqueioDerrota = true;
    }

    verificar(
        bloqueioDerrota,
        "Campanha eliminada não aceita novos resultados"
    );

    // TESTE 6: BLOQUEIO APÓS CONQUISTAR O TÍTULO
    let bloqueioTitulo = false;

    try {
        campanhaCampea.registrarResultado({
            vencedor: { nome: timeJogador.nome }
        });
    } catch (erro) {
        bloqueioTitulo = true;
    }

    verificar(
        bloqueioTitulo,
        "Campanha campeã não aceita novos resultados"
    );

    // TESTE 7: BLOQUEIO DE PARTIDA SEM VENCEDOR
    let bloqueioSemVencedor = false;

    try {
        campanhaInicial.registrarResultado({
            vencedor: null
        });
    } catch (erro) {
        bloqueioSemVencedor = true;
    }

    verificar(
        bloqueioSemVencedor,
        "Partida sem vencedor não é contabilizada"
    );

    // RESUMO DOS TESTES
    console.log("\n===== RESUMO DOS TESTES =====");
    console.log("Testes executados:", testesExecutados);
    console.log("Testes aprovados:", testesAprovados);
    console.log("Testes reprovados:", testesExecutados - testesAprovados);

    if (testesAprovados !== testesExecutados) {
        throw new Error(
            "Existem testes reprovados nas regras da campanha."
        );
    }
}


// TESTES DA PROGRESSÃO DA CAMPANHA
function testarProgressaoCampaign() {
    console.log("\n===== TESTES DA PROGRESSÃO DA CAMPANHA =====");

    let testesAprovados = 0;
    let testesExecutados = 0;

    function verificar(condicao, descricao) {
        testesExecutados++;

        if (condicao) {
            testesAprovados++;
            console.log(`[PASSOU] ${descricao}`);
        } else {
            console.error(`[FALHOU] ${descricao}`);
        }
    }

    // TESTE 1: TRÊS VITÓRIAS SEGUIDAS DE UMA DERROTA
    const campanhaDerrota = new Campaign(timeJogador, []);

    for (let i = 0; i < 3; i++) {
        campanhaDerrota.registrarResultado({
            vencedor: { nome: timeJogador.nome }
        });
    }

    campanhaDerrota.registrarResultado({
        vencedor: { nome: "Time Rival" }
    });

    verificar(
        campanhaDerrota.vitorias === 3
        && campanhaDerrota.derrotas === 1
        && campanhaDerrota.estado === "eliminado",
        "Três vitórias seguidas de uma derrota encerram a campanha corretamente"
    );

    // TESTE 2: TRÊS VITÓRIAS SEGUIDAS DE MAIS UMA VITÓRIA
    const campanhaTitulo = new Campaign(timeJogador, []);

    for (let i = 0; i < VITORIAS_PARA_TITULO - 1; i++) {
        campanhaTitulo.registrarResultado({
            vencedor: { nome: timeJogador.nome }
        });
    }

    campanhaTitulo.registrarResultado({
        vencedor: { nome: timeJogador.nome }
    });

    verificar(
        campanhaTitulo.vitorias === VITORIAS_PARA_TITULO
        && campanhaTitulo.derrotas === 0
        && campanhaTitulo.estado === "campeão",
        "Quarta vitória encerra a campanha com o título"
    );

    // TESTE 3: TENTATIVA DE REGISTRAR RESULTADO APÓS ELIMINAÇÃO
    let erroAposEliminacao = false;

    try {
        campanhaDerrota.registrarResultado({
            vencedor: { nome: timeJogador.nome }
        });
    } catch (erro) {
        erroAposEliminacao = true;
    }

    verificar(
        erroAposEliminacao
        && campanhaDerrota.vitorias === 3
        && campanhaDerrota.derrotas === 1
        && campanhaDerrota.estado === "eliminado",
        "Resultado posterior à eliminação é bloqueado sem alterar os contadores"
    );

    // TESTE 4: TENTATIVA DE REGISTRAR RESULTADO APÓS O TÍTULO
    let erroAposTitulo = false;

    try {
        campanhaTitulo.registrarResultado({
            vencedor: { nome: "Time Rival" }
        });
    } catch (erro) {
        erroAposTitulo = true;
    }

    verificar(
        erroAposTitulo
        && campanhaTitulo.vitorias === VITORIAS_PARA_TITULO
        && campanhaTitulo.derrotas === 0
        && campanhaTitulo.estado === "campeão",
        "Resultado posterior ao título é bloqueado sem alterar os contadores"
    );

    // RESUMO DOS TESTES
    console.log("\n===== RESUMO DA PROGRESSÃO =====");
    console.log("Testes executados:", testesExecutados);
    console.log("Testes aprovados:", testesAprovados);
    console.log("Testes reprovados:", testesExecutados - testesAprovados);

    if (testesAprovados !== testesExecutados) {
        throw new Error(
            "Existem testes reprovados na progressão da campanha."
        );
    }
}


// TESTES DA SELEÇÃO DOS ADVERSÁRIOS
function testarSelecaoAdversarios(jogadores) {
    console.log("\n===== TESTES DA SELEÇÃO DE ADVERSÁRIOS =====");

    let testesAprovados = 0;
    let testesExecutados = 0;

    function verificar(condicao, descricao) {
        testesExecutados++;

        if (condicao) {
            testesAprovados++;
            console.log(`[PASSOU] ${descricao}`);
        } else {
            console.error(`[FALHOU] ${descricao}`);
        }
    }

    // TESTE 1: IDENTIFICAÇÃO DOS TIMES HISTÓRICOS
    const timesHistoricos = obterTimesHistoricos(jogadores);

    const idsHistoricos = timesHistoricos.map(
        time => time.timeId
    );

    verificar(
        idsHistoricos.length === new Set(idsHistoricos).size,
        "Identificação dos times sem IDs repetidos"
    );

    // TESTE 2: SELEÇÃO DE EXATAMENTE SETE ADVERSÁRIOS
    const adversarios = selecionarAdversariosAleatorios(
        jogadores,
        7
    );

    verificar(
        adversarios.length === 7,
        "A seleção aceita a quantidade solicitada de adversários"
    );

    // TESTE 3: AUSÊNCIA DE ADVERSÁRIOS REPETIDOS
    const idsAdversarios = adversarios.map(
        adversario => adversario.timeId
    );

    verificar(
        idsAdversarios.length === new Set(idsAdversarios).size,
        "Nenhum adversário selecionado mais de uma vez"
    );

    // TESTE 4: TODOS OS ADVERSÁRIOS POSSUEM CINCO JOGADORES
    const todosCompletos = adversarios.every(adversario => {
        const jogadoresDoTime = obterJogadoresDoTime(
            jogadores,
            adversario.timeId
        );

        return jogadoresDoTime.length === 5;
    });

    verificar(
        todosCompletos,
        "Todos os adversários possuem exatamente cinco jogadores"
    );

    // TESTE 5: EXCLUSÃO DE TIMES INFORMADOS
    const idsExcluidos = [adversarios[0].timeId];

    const adversariosSemExcluidos =
        selecionarAdversariosAleatorios(
            jogadores,
            7,
            idsExcluidos
        );

    verificar(
        !adversariosSemExcluidos.some(
            adversario => idsExcluidos.includes(adversario.timeId)
        ),
        "Times excluídos não aparecem na seleção"
    );

    // TESTE 6: QUANTIDADE INSUFICIENTE DE TIMES
    let erroQuantidadeInsuficiente = false;

    try {
        selecionarAdversariosAleatorios(
            jogadores,
            1000
        );
    } catch (erro) {
        erroQuantidadeInsuficiente = true;
    }

    verificar(
        erroQuantidadeInsuficiente,
        "Erro quando não existem adversários suficientes"
    );

    // TESTE 7: MONTAGEM DE UM TIME HISTÓRICO
    const timeMontado = montarTimeHistorico(
        jogadores,
        adversarios[0].timeId
    );

    verificar(
        timeMontado.jogadores.length === 5
        && timeMontado.jogadores.every(jogador =>
            typeof jogador.nome === "string"
            && typeof jogador.funcao === "string"
            && typeof jogador.overall === "number"
        ),
        "Montagem correta dos jogadores do time histórico"
    );

    // RESUMO DOS TESTES
    console.log("\n===== RESUMO DA SELEÇÃO =====");
    console.log("Testes executados:", testesExecutados);
    console.log("Testes aprovados:", testesAprovados);
    console.log("Testes reprovados:", testesExecutados - testesAprovados);

    if (testesAprovados !== testesExecutados) {
        throw new Error(
            "Existem testes reprovados na seleção dos adversários."
        );
    }
}


// CONFIGURAÇÃO DO MAPA DE TESTE
const mapaTeste = {
    nome: "Ascent",
    ladoFavorecido: "defesa",
    ladoInicialTimeA: "ataque"
};


// EXECUÇÃO DA CAMPANHA COMPLETA
async function executarTestes() {
    console.log("===== TESTE DA CAMPANHA COMPLETA =====\n");

    // 1. TESTA AS REGRAS DA CAMPANHA
    testarRegrasCampaign();

    // 2. TESTA A PROGRESSÃO DA CAMPANHA
    testarProgressaoCampaign();

    // 3. CARREGA OS JOGADORES DO BANCO
    const jogadoresBanco = await carregarJogadores();

    console.log(
        "\nTotal de jogadores recebidos do banco:",
        jogadoresBanco.length
    );

    // 4. IDENTIFICA OS TIMES HISTÓRICOS
    const timesHistoricos = obterTimesHistoricos(jogadoresBanco);

    console.log(
        "Total de times históricos encontrados:",
        timesHistoricos.length
    );

    // 5. TESTA A SELEÇÃO DOS ADVERSÁRIOS
    testarSelecaoAdversarios(jogadoresBanco);

    // 6. SORTEIA OS ADVERSÁRIOS NECESSÁRIOS PARA A CAMPANHA
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

    // 7. CRIA A CAMPANHA
    const campanhaTeste = new Campaign(
        timeJogador,
        adversariosSelecionados
    );

    console.log("\n===== ESTADO INICIAL DA CAMPANHA =====");
    console.log("Vitórias:", campanhaTeste.vitorias);
    console.log("Derrotas:", campanhaTeste.derrotas);
    console.log("Estado:", campanhaTeste.estado);

    // 8. ENFRENTA OS ADVERSÁRIOS EM SEQUÊNCIA
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

        // Quatro vitórias garantem o título
        if (campanhaTeste.estado === "campeão") {
            console.log("\nO Time Frankenstein conquistou o título!");
            break;
        }
    }

    // 9. EXIBE O RESULTADO FINAL
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
