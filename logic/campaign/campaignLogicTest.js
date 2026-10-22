
const Campaign = require("./campaign");

// Times fictícios para testar as regras sem depender do banco.
const timeJogador = {
    nome: "Time Frankenstein"
};

const adversarios = [];

// Simula o resultado de uma partida.
// O vencedor precisa ter um nome, assim como ocorre em Match.
function criarPartida(vencedor) {
    return {
        vencedor: vencedor
    };
}

function executarTestes() {
    console.log("===== TESTES DAS REGRAS DA CAMPANHA =====");

    // TESTE 1: sete vitórias devem tornar o time campeão.
    const campanhaCampea = new Campaign(
        timeJogador,
        adversarios
    );

    for (let i = 0; i < 7; i++) {
        campanhaCampea.registrarResultado(
            criarPartida(timeJogador)
        );
    }

    console.log("\n--- Teste 1: sete vitórias ---");
    console.log("Vitórias:", campanhaCampea.vitorias);
    console.log("Derrotas:", campanhaCampea.derrotas);
    console.log("Estado:", campanhaCampea.estado);

    if (
        campanhaCampea.vitorias === 7 &&
        campanhaCampea.estado === "campeão"
    ) {
        console.log("RESULTADO: PASSOU");
    } else {
        console.log("RESULTADO: FALHOU");
    }

    // TESTE 2: uma derrota elimina o time imediatamente.
    const campanhaEliminada = new Campaign(
        timeJogador,
        adversarios
    );

    campanhaEliminada.registrarResultado(
        criarPartida(timeJogador)
    );

    campanhaEliminada.registrarResultado(
        criarPartida(timeJogador)
    );

    campanhaEliminada.registrarResultado(
        criarPartida({ nome: "Time Rival" })
    );

    console.log("\n--- Teste 2: derrota após duas vitórias ---");
    console.log("Vitórias:", campanhaEliminada.vitorias);
    console.log("Derrotas:", campanhaEliminada.derrotas);
    console.log("Estado:", campanhaEliminada.estado);

    if (
        campanhaEliminada.vitorias === 2 &&
        campanhaEliminada.derrotas === 1 &&
        campanhaEliminada.estado === "eliminado"
    ) {
        console.log("RESULTADO: PASSOU");
    } else {
        console.log("RESULTADO: FALHOU");
    }

    // TESTE 3: não permitir resultados após o encerramento.
    console.log("\n--- Teste 3: campanha encerrada ---");

    try {
        campanhaEliminada.registrarResultado(
            criarPartida(timeJogador)
        );

        console.log("RESULTADO: FALHOU");
        console.log("A campanha aceitou uma nova partida.");
    } catch (erro) {
        console.log("RESULTADO: PASSOU");
        console.log("Mensagem:", erro.message);
    }

    console.log("\n===== FIM DOS TESTES =====");
}

executarTestes();
