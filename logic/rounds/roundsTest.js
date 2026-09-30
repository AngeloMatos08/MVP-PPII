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
    atualizarPlacar
} = require("./roundsLogic");


// CLASSE PARA REPRESENTAR UM TIME DE TESTE

class Time {

    constructor(nome, jogadores) {
<<<<<<< HEAD

=======
>>>>>>> fe2c331 (Atualização da sintaxe)
        this.nome = nome;
        this.jogadores = jogadores;
    }
}


<<<<<<< HEAD
// ========================================
// CRIANDO OS JOGADORES DO TIME A
// ========================================

const jogadoresA = [

=======
// CRIANDO OS TIMES DE TESTE

// CRIANDO JOGADORES DO TIME A
const jogadoresA = [
>>>>>>> fe2c331 (Atualização da sintaxe)
    {
        nome: "Aspas",
        funcao: "Duelista",
        overall: 98
    },
<<<<<<< HEAD

=======
>>>>>>> fe2c331 (Atualização da sintaxe)
    {
        nome: "Sacy",
        funcao: "Iniciador",
        overall: 94
    },
<<<<<<< HEAD

=======
>>>>>>> fe2c331 (Atualização da sintaxe)
    {
        nome: "pAncada",
        funcao: "Controlador",
        overall: 93
    },
<<<<<<< HEAD

=======
>>>>>>> fe2c331 (Atualização da sintaxe)
    {
        nome: "Saadhak",
        funcao: "Sentinela",
        overall: 91
    },
<<<<<<< HEAD

=======
>>>>>>> fe2c331 (Atualização da sintaxe)
    {
        nome: "Less",
        funcao: "Sentinela",
        overall: 92
    }
];
<<<<<<< HEAD
=======

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
>>>>>>> fe2c331 (Atualização da sintaxe)


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


<<<<<<< HEAD
// ========================================
// CRIANDO UMA PARTIDA DE TESTE
// ========================================

const partidaTeste = new Match(
=======
// CRIANDO UMA PARTIDA TESTE
const partidaTeste = new Match (
>>>>>>> fe2c331 (Atualização da sintaxe)
    timeA,
    timeB,
    mapa
);


<<<<<<< HEAD
// ========================================
=======
>>>>>>> fe2c331 (Atualização da sintaxe)
// CRIANDO UM ROUND DE TESTE
// ========================================

const roundTeste = new Round(
    1,
    timeA,
    timeB
);


<<<<<<< HEAD
// ========================================
// CALCULANDO A PROBABILIDADE DO ROUND
// ========================================

const probabilidadeRound = calcularProbabilidadeRound(
=======
// FUNÇÃO PARA CALCULAR A PROBABILIDADE DE CADA TIME NO ROUND
const probabilidadeRound = calcularProbabilidadeRound (
>>>>>>> fe2c331 (Atualização da sintaxe)
    partidaTeste,
    roundTeste
);


<<<<<<< HEAD
// ========================================
=======
// CHAMAR FUNÇÃO PARA SIMULAR O VENCEDOR DO ROUND
const vencedorRound = simularRound (
    partidaTeste,
    roundTeste
);


// FUNÇÃO PARA ATUALIZAR O PLACAR AO DECORRER DOS ROUNDS
atualizarPlacar (
    partidaTeste,
    roundTeste
);

>>>>>>> fe2c331 (Atualização da sintaxe)
// TESTE NO CONSOLE
// ========================================
console.log("");
console.log("=== TESTE DA CLASSE ROUND ===");
console.log("");


// INFORMAÇÕES DO ROUND
console.log("Número do Round:", roundTeste.numero);
console.log("");


<<<<<<< HEAD
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

=======
// TIMES
console.log("Time Atacante:", roundTeste.timeAtacante.nome);
console.log("Time Defensor:", roundTeste.timeDefensor.nome);
console.log("Probabilidade do atacante:", probabilidadeRound);
>>>>>>> fe2c331 (Atualização da sintaxe)
console.log("");


// VENCEDOR
<<<<<<< HEAD
console.log(
    "Vencedor:",
    roundTeste.vencedor
);

=======
console.log("Vencedor:", vencedorRound.nome);
>>>>>>> fe2c331 (Atualização da sintaxe)
console.log("");
console.log("Placar:", partidaTeste.placarA, "x", partidaTeste.placarB);
console.log("==============================");
console.log("| TESTE DO ROUND FINALIZADO |");
console.log("==============================");