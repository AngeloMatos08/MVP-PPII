// Área de teste para o overall de ataque e defesa dos times

const {
    calcularAtaque,
    calcularDefesa,
    calcularTaxaVitoria
} = require("./matchesLogic");


// Classe para representar um time de teste

class Time {

    constructor(nome, jogadores) {
        this.nome = nome;
        this.jogadores = jogadores;
    }

}


// Criando os jogadores do Time A

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


// Criando os jogadores do Time B

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


// Criando os times

const timeTestA = new Time("Time de Teste A", jogadoresA);

const timeTestB = new Time("Time de Teste B", jogadoresB);


// Calculando os atributos do Time A

const ataqueA = calcularAtaque(timeTestA.jogadores);

const defesaA = calcularDefesa(timeTestA.jogadores);


// Calculando os atributos do Time B

const ataqueB = calcularAtaque(timeTestB.jogadores);

const defesaB = calcularDefesa(timeTestB.jogadores);


// Fatores do mapa

const atkM = 1.00;

const defM = 1.05;

console.log("");

console.log("=== TESTE DE TROCA DE LADOS ===");


// Primeiro lado
// A ataca e B defende

const vaPrimeiroLado = calcularTaxaVitoria(
    ataqueA,
    defesaB,
    atkM,
    defM
);

const vbPrimeiroLado = calcularTaxaVitoria(
    ataqueB,
    defesaA,
    defM,
    atkM
);


console.log("");
console.log("Primeiro lado:");
console.log("A atacando:", vaPrimeiroLado);
console.log("B defendendo:", vbPrimeiroLado);


// Segundo lado
// B ataca e A defende

const vaSegundoLado = calcularTaxaVitoria(
    ataqueA,
    defesaB,
    defM,
    atkM
);

const vbSegundoLado = calcularTaxaVitoria(
    ataqueB,
    defesaA,
    atkM,
    defM
);


console.log("");
console.log("Segundo lado:");
console.log("A defendendo:", vaSegundoLado);
console.log("B atacando:", vbSegundoLado);

// Exibindo os resultados

console.log("=== TESTE DOS TIMES ===");

console.log("");

console.log("Time:", timeTestA.nome);
console.log("Ataque:", ataqueA);
console.log("Defesa:", defesaA);

console.log("");

console.log("Time:", timeTestB.nome);
console.log("Ataque:", ataqueB);
console.log("Defesa:", defesaB);

console.log("");