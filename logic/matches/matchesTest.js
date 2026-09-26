// ÁREA DE TESTE PARA O OVERALL DE ATAQUE E DEFESA DOS TIMES 
const {
    calcularAtaque,
    calcularDefesa,
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
        overall: 93
    },

    {
        nome: "Victor",
        funcao: "Duelista",
        overall: 92
    },

    {
        nome: "Marved",
        funcao: "Controlador",
        overall: 94
    },

    {
        nome: "FNS",
        funcao: "Sentinela",
        overall: 87
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
const forcaA = (ataqueA + defesaA) / 2;
const forcaB = (ataqueB + defesaB) / 2;

const diferenca = forcaA - forcaB;

const probabilidadeBase = 
    1 / (1 + Math.exp(-(diferenca / escala)));


// FUNÇÃO QUE APLICA O BÔNUS DO MAPA
function aplicarBonusMapa(probabilidade, ladoTime, mapa, bonus) {
    if (ladoTime === mapa.ladoFavorecido) {
        return probabilidade + ((1 - probabilidade) * bonus);
    }
    
    return probabilidade
}


// DEFINIÇÃO DAS PROBABILIDADES DE CADA LADO
const probabilidadePrimeiroLadoNova = 
    aplicarBonusMapa(
        probabilidadeBase,
        "ataque",
        mapa,
        bonusMapa
    );

const probabilidadeSegundoLadoNova =
    aplicarBonusMapa(
        probabilidadeBase,
        "defesa",
        mapa,
        bonusMapa
    );


// TESTE NO CONSOLE
console.log("");
console.log("=== NOVA LÓGICA COM MAPA ===");

console.log("")
console.log("Mapa:", mapa.nome);
console.log("Lado Favorecido:", mapa.ladoFavorecido);
console.log("Bônus do mapa:", bonusMapa);

console.log("");
console.log("A atacando / B defendendo:");
console.log("Probabilidade de A:", probabilidadePrimeiroLadoNova);
console.log("Probabilidade de B:", 1 - probabilidadePrimeiroLadoNova);

console.log("");
console.log("A defendendo / B atacando:");
console.log("Probabilidade de A:", probabilidadeSegundoLadoNova);
console.log("Probabilidade de B:", 1 - probabilidadeSegundoLadoNova);


console.log("");
console.log(" ======================");
console.log("|Código antigo removido|");
console.log(" ======================");