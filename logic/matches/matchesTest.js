// ÁREA DE TESTE DA CLASS MATCH 
const Match = require("./matches");


// CLASSE PARA REPRESENTAR UM TIME DE TESTE
class Time {
    constructor(nome, jogadores) {
        this.nome = nome;
        this.jogadores = jogadores;
    }
}


// CRIANDO OS JOGADORES DO TIME A
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


// CRIANDO OS JOGADORES DO TIME B
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


// CRIANDO OS TIMES
const timeTestA = new Time (
    "LOUD",
    jogadoresA
);

const timeTestB = new Time (
    "FNATIC",
    jogadoresB
);



// CONFIGURAÇÃO DO MAPA
const mapa = {
    nome: "Mapa Teste",
    ladoFavorecido: "defesa"
};


// CRIANDO PARTIDA TESTE
const partidaTeste = new Match (
    timeTestA,
    timeTestB,
    mapa
);


// TESTE NO CONSOLE
console.log("");
console.log("=== TESTE DA CLASSE MATCH ===");
console.log("");


// TIMES
console.log("Time A:", partidaTeste.timeA.nome);
console.log("Time B:", partidaTeste.timeB.nome);
console.log("");


// MAPA
console.log("Mapa:", mapa.nome);
console.log(
    "Lado favorecido:", mapa.ladoFavorecido
);
console.log("");


// ATRIBUTOS DO TIME A
console.log("=== ATRIBUTOS DO TIME A ===");
console.log("Ataque A:", partidaTeste.ataqueA);
console.log("Defesa A:", partidaTeste.defesaA);
console.log("Força A:", partidaTeste.forcaA);
console.log("");


// ATRIBUTOS DO TIME B
console.log("=== ATRIBUTOS DO TIME B ===");
console.log("Ataque B:", partidaTeste.ataqueB);
console.log("Defesa B:", partidaTeste.defesaB);
console.log("Força B:", partidaTeste.forcaB);
console.log("");


// ESTADO INICIAL DA PARTIDA
console.log("=== ESTADO INICIAL DA PARTIDA ===");
console.log(
    "Placar:",
    partidaTeste.placarA,
    "x",
    partidaTeste.placarB
);

console.log("Vencedor:", partidaTeste.vencedor);
console.log("");
console.log(" ========================= ");
console.log("| TESTE DA MATCH FINALIZADO |");
console.log("  ========================= ");