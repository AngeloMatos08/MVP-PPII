// ÁREA DE TESTE DA CLASSE CAMPAIGN

// IMPORTANDO A CLASSE CAMPAIGN & MATCH
const Campaign = require("./campaign");

// IMPORTANDO AS FUNÇÕES DA LÓGICA
const {
    carregarJogadores,
    obterTimesHistoricos,
    obterJogadoresDoTime,
    montarTimeHistorico
} = require("./campaignLogic");

// CLASSE PARA REPRESENTAR UM TIME DE TESTE
class Time {
    constructor(nome, jogadores) {
        this.nome = nome;
        this.jogadores = jogadores;
    }
}


// CRIANDO JOGADORES DE TESTE
const jogadores = [
    { nome: "Jogador 1", funcao: "Duelista", overall: 95 },
    { nome: "Jogador 2", funcao: "Iniciador", overall: 92 },
    { nome: "Jogador 3", funcao: "Controlador", overall: 90 },
    { nome: "Jogador 4", funcao: "Sentinela", overall: 91 },
    { nome: "Jogador 5", funcao: "Duelista", overall: 93 }
];


// CRIANDO O TIME DO JOGADOR 
const timeJogador = new Time (
    "Time Frankeinstein",
    jogadores
);


// CRIANDO UMA LISTA DE ADVERSÁRIOS DE TESTE
const adversarios = [
    { timeId: 1, ano: 2023 },
    { timeId: 2, ano: 2024 },
    { timeId: 3, ano: 2025 },
];


// CRIANDO A CAMPANHA
const campanhaTeste = new Campaign (
    timeJogador,
    adversarios
);


// EXIBINDO OS DADOS DA CAMPANHA
console.log("===== TESTE DA CAMPANHA =====");
console.log("Time:", campanhaTeste.timeJogador.nome);
console.log("Adversários:", campanhaTeste.adversarios);
console.log("Vitórias:", campanhaTeste.vitorias);
console.log("Derrotas:", campanhaTeste.derrotas);
console.log("Estado:", campanhaTeste.estado);


// TESTANDO A LEITURA DOS DADOS
const jogadoresBanco = carregarJogadores();

const timesHistoricos = 
    obterTimesHistoricos(jogadoresBanco);

console.log("");
console.log("===== DADOS DO BANCO =====");
console.log("Total de jogadores:", jogadoresBanco.length);
console.log("Times encontrados:", timesHistoricos);

console.log("");
console.log("===== TESTE DOS JOGADORES DE UM TIME =====");

const jogadoresLOUD = obterJogadoresDoTime (
    jogadoresBanco,
    "loud_2022"
);

console.log("Quantidade de jogadores:", jogadoresLOUD.length);
console.log("Jogadores da LOUD:", jogadoresLOUD);

console.log("");
console.log("===== TESTE DO TIME HISTÓRICO =====");

const timeLOUD = montarTimeHistorico (
    jogadoresBanco,
    "loud_2022"
);

console.log("Time montado:", timeLOUD.nome);
console.log("Jogadores:", timeLOUD.jogadores);