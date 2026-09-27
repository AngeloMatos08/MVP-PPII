// ÁREA DE TESTE PARA O OVERALL DE ATAQUE E DEFESA DOS TIMES 
const {
    calcularAtaque,
    calcularDefesa,
    calcularForcaTime,
    calcularProbabilidadeBase,
    aplicarBonusMapa,
    calcularTaxaVitoria,
    calcularProbabilidade
} = require("./matchesLogic");


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
        overall: 90
    },

    {
        nome: "Sacy",
        funcao: "Iniciador",
        overall: 90
    },

    {
        nome: "pAncada",
        funcao: "Controlador",
        overall: 90
    },

    {
        nome: "Saadhak",
        funcao: "Sentinela",
        overall: 90
    },

    {
        nome: "Less",
        funcao: "Duelista",
        overall: 90
    }
];


// CRIANDO OS JOGADORES DO TIME B
const jogadoresB = [

    {
        nome: "yay",
        funcao: "Duelista",
        overall: 70
    },

    {
        nome: "crashies",
        funcao: "Iniciador",
        overall: 70
    },

    {
        nome: "Victor",
        funcao: "Duelista",
        overall: 70
    },

    {
        nome: "Marved",
        funcao: "Controlador",
        overall: 70
    },

    {
        nome: "FNS",
        funcao: "Sentinela",
        overall: 70
    }
];


// CRIANDO OS TIMES
const timeTestA = new Time("Time de Teste A", jogadoresA);
const timeTestB = new Time("Time de Teste B", jogadoresB);


// CALCULANDO OS ATRIBUTOS DO TIME A
const ataqueA = calcularAtaque(timeTestA.jogadores);
const defesaA = calcularDefesa(timeTestA.jogadores);


// CALCULANDO OS ATRIBUTOS DO TIME B
const ataqueB = calcularAtaque(timeTestB.jogadores);
const defesaB = calcularDefesa(timeTestB.jogadores);


// CONFIGURAÇÃO DO MAPA
const mapa = {
    nome: "Mapa Teste",
    ladoFavorecido: "defesa"
};

const escala = 30;
const bonusMapa = 0.05;


// FORÇA GERAL DOS TIMES
const forcaA = calcularForcaTime(ataqueA, defesaA);
const forcaB = calcularForcaTime(ataqueB, defesaB);


// PROBABILIDADE BASE
const probabilidadeBase =
    calcularProbabilidadeBase(forcaA, forcaB, escala);



// TESTE NO CONSOLE
console.log("");
console.log("=== NOVA LÓGICA COM MAPA ===");

console.log("")
console.log("Mapa:", mapa.nome);
console.log("Lado Favorecido:", mapa.bonusMapa);
console.log("Bônus do mapa:", bonusMapa);

console.log("");
console.log("A atacando / B defendendo:");
console.log("Probabilidade de A:", probabilidadeBase);
console.log("Probabilidade de B:", 1 - probabilidadeBase);

console.log("");
console.log("A defendendo / B atacando:");
console.log("Probabilidade de A:", probabilidadeBase);
console.log("Probabilidade de B:", 1 - probabilidadeBase);


console.log("");
console.log(" ======================");
console.log("|Código antigo removido|");
console.log(" ======================");