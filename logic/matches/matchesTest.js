
const assert = require("node:assert/strict");

const Match = require("./matches");

const {
    simularPartida,
    trocarLados
} = require("./matchesLogic");

// CRIA UM TIME PARA OS TESTES
class Time {
    constructor(nome, jogadores) {
        this.nome = nome;
        this.jogadores = jogadores;
    }
}

// JOGADORES DO TIME A
const jogadoresA = [
    { nome: "Aspas", funcao: "Duelista", overall: 98 },
    { nome: "Sacy", funcao: "Iniciador", overall: 94 },
    { nome: "pAncada", funcao: "Controlador", overall: 93 },
    { nome: "Saadhak", funcao: "Sentinela", overall: 91 },
    { nome: "Less", funcao: "Sentinela", overall: 92 }
];

// JOGADORES DO TIME B
const jogadoresB = [
    { nome: "yay", funcao: "Duelista", overall: 98 },
    { nome: "crashies", funcao: "Iniciador", overall: 91 },
    { nome: "Victor", funcao: "Duelista", overall: 93 },
    { nome: "Marved", funcao: "Controlador", overall: 92 },
    { nome: "FNS", funcao: "Sentinela", overall: 87 }
];

// TIMES
const timeA = new Time("LOUD", jogadoresA);
const timeB = new Time("FNATIC", jogadoresB);

// MAPA
const mapa = {
    nome: "Ascent",
    ladoFavorecido: "defesa",
    ladoInicialTimeA: "ataque"
};

// CRIA UMA PARTIDA NOVA PARA CADA TESTE
function criarPartida() {
    return new Match(timeA, timeB, { ...mapa });
}

// EXECUTA UM TESTE E MOSTRA O RESULTADO
function executarTeste(nome, teste) {
    try {
        teste();
        console.log(`[PASSOU] ${nome}`);
    } catch (erro) {
        console.error(`[FALHOU] ${nome}`);
        console.error("Motivo:", erro.message);
    }
}

console.log("\n===== TESTES DA CLASSE MATCH =====\n");

// TESTE 1: CÁLCULO DOS ATRIBUTOS
executarTeste("Cálculo dos atributos dos times", () => {
    const partida = criarPartida();

    assert.ok(Number.isFinite(partida.ataqueA));
    assert.ok(Number.isFinite(partida.defesaA));
    assert.ok(Number.isFinite(partida.forcaA));

    assert.ok(Number.isFinite(partida.ataqueB));
    assert.ok(Number.isFinite(partida.defesaB));
    assert.ok(Number.isFinite(partida.forcaB));

    assert.equal(partida.placarA, 0);
    assert.equal(partida.placarB, 0);
    assert.equal(partida.vencedor, null);
});

// TESTE 2: LADOS INICIAIS
executarTeste("Definição dos lados iniciais", () => {
    const partida = criarPartida();

    assert.equal(partida.ladoA, "ataque");
    assert.equal(partida.ladoB, "defesa");
});

// TESTE 3: TROCA DE LADOS
executarTeste("Troca correta dos lados", () => {
    const partida = criarPartida();

    trocarLados(partida);

    assert.equal(partida.ladoA, "defesa");
    assert.equal(partida.ladoB, "ataque");

    // Trocar novamente deve restaurar os lados originais.
    trocarLados(partida);

    assert.equal(partida.ladoA, "ataque");
    assert.equal(partida.ladoB, "defesa");
});

// TESTE 4: SIMULAÇÃO COM VITÓRIA DO TIME A
executarTeste("Simulação e placar de vitória", () => {
    const partida = criarPartida();
    const randomOriginal = Math.random;

    try {
        // Faz o Time A vencer todas as rodadas.
        Math.random = () => 0;

        simularPartida(partida);
    } finally {
        Math.random = randomOriginal;
    }

    assert.equal(partida.vencedor, timeA);
    assert.equal(partida.placarA, 13);
    assert.equal(partida.placarB, 0);
    assert.equal(partida.rodadasJogadas, 13);
});

// TESTE 5: OVERTIME
executarTeste("Partida em overtime", () => {
    const partida = criarPartida();
    const randomOriginal = Math.random;

    // Alterna 24 resultados para chegar a 12 x 12.
    // Depois, o Time A vence duas rodadas consecutivas.
    const resultados = [];

    for (let i = 0; i < 12; i++) {
        resultados.push(0, 0.999999);
    }

    resultados.push(0, 0);

    let indice = 0;

    try {
        Math.random = () => resultados[indice++];

        simularPartida(partida);
    } finally {
        Math.random = randomOriginal;
    }

    assert.equal(partida.placarA, 14);
    assert.equal(partida.placarB, 12);
    assert.equal(partida.vencedor, timeA);
    assert.equal(partida.rodadasJogadas, 26);
});

// TESTE 6: PROTEÇÃO CONTRA SIMULAÇÃO DUPLICADA
executarTeste("Bloqueio de nova simulação", () => {
    const partida = criarPartida();
    const randomOriginal = Math.random;

    try {
        Math.random = () => 0;

        simularPartida(partida);

        assert.throws(
            () => simularPartida(partida),
            /Esta partida já foi simulada/
        );
    } finally {
        Math.random = randomOriginal;
    }
});

// RESUMO INFORMATIVO
console.log("\n===== FIM DOS TESTES =====\n");
