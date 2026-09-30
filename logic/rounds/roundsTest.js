// ÁREA DE TESTE DA CLASSE ROUND
//
// ESTE ARQUIVO SERÁ UTILIZADO PARA TESTAR:
// - CRIAÇÃO DE UM ROUND;
// - DEFINIÇÃO DOS TIMES ATACANTE E DEFENSOR;
// - PROBABILIDADE DE VITÓRIA DO ROUND;
// - FUNCIONAMENTO DA LÓGICA DE SIMULAÇÃO.


const Round = require("./rounds");

const Match = require("../matches/matches");

const {
    calcularProbabilidadeRound,
    simularRound,
    atualizarPlacar,
    trocarLados
} = require("./roundsLogic");


// CLASSE PARA REPRESENTAR UM TIME DE TESTE

class Time {

    constructor(nome, jogadores) {

        this.nome = nome;
        this.jogadores = jogadores;
    }
}


// CRIANDO OS TIMES DE TESTE
// CRIANDO JOGADORES DO TIME A
const jogadoresA = [
    {
        nome: "Aspas",
        funcao: "Duelista",
        overall: 98
    },

    {
        nome: "Sacy",
        funcao: "Iniciador",
        overall: 94
    },

    {
        nome: "pAncada",
        funcao: "Controlador",
        overall: 93
    },

    {
        nome: "Saadhak",
        funcao: "Sentinela",
        overall: 91
    },

    {
        nome: "Less",
        funcao: "Sentinela",
        overall: 92
    }
];


// CRIANDO JOGADORES DO TIME B
const jogadoresB = [
    {
        nome: "yay",
        funcao: "Duelista",
        overall: 98
    },
    {
        nome: "crashies",
        funcao: "Iniciador",
        overall: 91
    },
    {
        nome: "Victor",
        funcao: "Duelista",
        overall: 93
    },
    {
        nome: "Marved",
        funcao: "Controlador",
        overall: 92
    },
    {
        nome: "FNS",
        funcao: "Sentinela",
        overall: 87
    }
];


const timeA = new Time(
    "LOUD",
    jogadoresA
);


const timeB = new Time(
    "FNATIC",
    jogadoresB
);


// CRIANDO O MAPA DE TESTE
const mapa = {

    nome: "Mapa Teste",

    ladoFavorecido: "ataque"
};


// CRIANDO UMA PARTIDA DE TESTE
const partidaTeste = new Match (
    timeA,
    timeB,
    mapa
);


// SIMULANDO PRIMEIRA METADE
for (let numero = 1; numero <= 12; numero++) {
    
    // CRIANDO ROUND
    const round = new Round (
        numero,
        timeA,
        timeB
    );

    // CALCULANDO A PROBABILIDADE DE CADA TIME
    const probabilidadeRound = calcularProbabilidadeRound (
        partidaTeste,
        round
    );

    // SIMULANDO O VENCEDOR DO ROUND
    const vencedorRound = simularRound (
        partidaTeste,
        round
    );

    // ATUALIZANDO O PLACAR AO DECORRER DOS ROUNDS
    atualizarPlacar (
        partidaTeste,
        round
    );

    // TESTE NO CONSOLE
    console.log (
        "Round:",
        round.numero,
        "| Atacante:",
        round.timeAtacante.nome,
        "| Defensor:",
        round.timeDefensor.nome,
        "| Vencedor:",
        vencedorRound.nome,
        "| Placar:",
        partidaTeste.placarA,
        "x",
        partidaTeste.placarB
    );
}


// TROCA DE LADOS
console.log("");
console.log("=== TROCA DE LADOS ===");
console.log("");

console.log (
    "Antes da troca:",
    timeA.nome,
    "Atacando |",
    timeB.nome,
    "Defendendo"
);

const roundTeste = new Round (
    13,
    timeA,
    timeB
);

trocarLados(roundTeste);

console.log (
    "Depois da troca:",
    roundTeste.timeAtacante.nome,
    "Atacando |",
    roundTeste.timeDefensor.nome,
    "Defendendo"
);

console.log("");
console.log("======================");
console.log("");


// SIMULANDO SEGUNDA METADE
for (let numero = 13; numero <= 24; numero++) {
    
    // CRIANDO ROUND COM OS LADOS INVERTIDOS
    const round = new Round (
        numero,
        roundTeste.timeAtacante,
        roundTeste.timeDefensor
    );

    // CALCULANDO A PROBABILIDADE DE CADA TIME
    const probabilidadeRound = calcularProbabilidadeRound (
        partidaTeste,
        round
    );

    // SIMULANDO O VENCEDOR DO ROUND
    const vencedorRound = simularRound (
        partidaTeste,
        round
    );

    // ATUALIZANDO O PLACAR AO DECORRER DOS ROUNDS
    atualizarPlacar (
        partidaTeste,
        round
    );

    // TESTE NO CONSOLE
    console.log (
        "Round:",
        round.numero,
        "| Atacante:",
        round.timeAtacante.nome,
        "| Defensor:",
        round.timeDefensor.nome,
        "| Vencedor:",
        vencedorRound.nome,
        "| Placar:",
        partidaTeste.placarA,
        "x",
        partidaTeste.placarB
    );
}

// FINALIZANDO TESTE
console.log("");
console.log("==============================");
console.log("| TESTE DA PARTIDA FINALIZADO |");
console.log("==============================");
console.log("");
console.log(
    "Placar final:",
    partidaTeste.placarA,
    "x",
    partidaTeste.placarB
);