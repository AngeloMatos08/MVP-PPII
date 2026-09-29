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
    calcularProbabilidadeRound
} = require("./roundsLogic");


// CLASSE PARA REPRESENTAR UM TIME DE TESTE

class Time {

    constructor(nome, jogadores) {

        this.nome = nome;
        this.jogadores = jogadores;
    }
}


// ========================================
// CRIANDO OS JOGADORES DO TIME A
// ========================================

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


// ========================================
// CRIANDO OS JOGADORES DO TIME B
// ========================================

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


// ========================================
// CRIANDO OS TIMES
// ========================================

const timeA = new Time(
    "LOUD",
    jogadoresA
);


const timeB = new Time(
    "FNATIC",
    jogadoresB
);


// ========================================
// CRIANDO O MAPA DE TESTE
// ========================================

const mapa = {

    nome: "Mapa Teste",

    ladoFavorecido: "ataque"
};


// ========================================
// CRIANDO UMA PARTIDA DE TESTE
// ========================================

const partidaTeste = new Match(
    timeA,
    timeB,
    mapa
);


// ========================================
// CRIANDO UM ROUND DE TESTE
// ========================================

const roundTeste = new Round(
    1,
    timeA,
    timeB
);


// ========================================
// CALCULANDO A PROBABILIDADE DO ROUND
// ========================================

const probabilidadeRound = calcularProbabilidadeRound(
    partidaTeste,
    roundTeste
);


// ========================================
// TESTE NO CONSOLE
// ========================================
console.log("");
console.log("=== TESTE DA CLASSE ROUND ===");
console.log("");


// INFORMAÇÕES DO ROUND
console.log("Número do Round:", roundTeste.numero);
console.log("");


// InFORMAÇÕES DOS TIMES
console.log(
    "Time Atacante:",
    roundTeste.timeAtacante.nome
);

console.log(
    "Time Defensor:",
    roundTeste.timeDefensor.nome
);

console.log("");


// INFORMAÇÕES DO MAPA
console.log(
    "Mapa:",
    partidaTeste.mapa.nome
);

console.log(
    "Lado Favorecido:",
    partidaTeste.mapa.ladoFavorecido
);

console.log("");


// PROBABILIDADE
console.log(
    "Probabilidade do atacante:",
    probabilidadeRound
);

console.log(
    "Probabilidade do defensor:",
    1 - probabilidadeRound
);

console.log("");


// VENCEDOR
console.log(
    "Vencedor:",
    roundTeste.vencedor
);

console.log("");
console.log("==============================");
console.log("| TESTE DO ROUND FINALIZADO |");
console.log("==============================");