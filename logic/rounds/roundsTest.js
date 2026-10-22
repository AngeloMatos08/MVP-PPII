// ÁREA DE TESTE DA CLASSE ROUND

//
// ESTE ARQUIVO SERÁ UTILIZADO PARA TESTAR:
//
// - CRIAÇÃO DE UMA PARTIDA;
//
// - DEFINIÇÃO DOS TIMES;
//
// - SIMULAÇÃO DOS ROUNDS;
//
// - FUNCIONAMENTO DA PARTIDA COMPLETA;
//


// IMPORTANDO A CLASSE MATCH

const Match =
    require("../matches/matches");


// IMPORTANDO A FUNÇÃO DE SIMULAÇÃO

const {
    simularPartida
} = require("./roundsLogic");


// CLASSE PARA REPRESENTAR UM TIME DE TESTE
class Time {
    constructor(nome, jogadores) {

        this.nome = nome;
        this.jogadores = jogadores;
    }
}


// ==========================================
// CRIANDO OS JOGADORES DO TIME A
// ==========================================
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


// ==========================================
// CRIANDO OS JOGADORES DO TIME B
// ==========================================
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


// ==========================================
// CRIANDO OS TIMES
// ==========================================
const timeA =
    new Time(
        "LOUD",
        jogadoresA
    );

const timeB =
    new Time(
        "FNATIC",
        jogadoresB
    );


// ==========================================
// CRIANDO O MAPA DE TESTE
// ==========================================
const mapa = {

    nome: "Mapa Teste",
    ladoFavorecido: "ataque"
};


// ==========================================
// CRIANDO A PARTIDA
// ==========================================
const partidaTeste =
    new Match(
        timeA,
        timeB,
        mapa
    );


// ==========================================
// SIMULANDO A PARTIDA COMPLETA
// ==========================================
simularPartida(
    partidaTeste
);


// ==========================================
// EXIBINDO O RESULTADO
// ==========================================
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

console.log(
    "Vencedor:",
    partidaTeste.vencedor.nome
);