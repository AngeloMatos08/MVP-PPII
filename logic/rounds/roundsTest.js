// ÁREA DE TESTE DA CLASSE ROUND
//
// ESTE ARQUIVO SERÁ UTILIZADO PARA TESTAR:
// - CRIAÇÃO DE UM ROUND;
// - DEFINIÇÃO DOS TIMES ATACANTE E DEFENSOR;
// - RESULTADO DO ROUND;
// - FUNCIONAMENTO DA LÓGICA DE SIMULAÇÃO.

// ÁREA DE TESTE DA CLASSE ROUND
const Round = require("./rounds");

const Match = require("../matches/matches");

const {
    calcularProbabilidadeRound
} = require("./roundsLogic");


// CLASSE PARA REPRESENTAR UM TIME DE TESTE
class Time {

    constructor(nome) {
        this.nome = nome;
    }
}


// CRIANDO OS TIMES DE TESTE
const timeA = new Time("LOUD");
const timeB = new Time("FNATIC");


// CRIANDO O MAPA DE TESTE
const mapa = {
    nome: "Mapa Teste",
    ladoFavorecido: "defesa"
};


// CRIANDO UM ROUND DE TESTE
const roundTeste = new Round(
    1,
    timeA,
    timeB
);


// TESTE NO CONSOLE
console.log("");
console.log("=== TESTE DA CLASSE ROUND ===");
console.log("");


// INFORMAÇÕES DO ROUND
console.log("Número do Round:", roundTeste.numero);
console.log("");


// TIMES
console.log("Time Atacante:", roundTeste.timeAtacante.nome);
console.log("Time Defensor:", roundTeste.timeDefensor.nome);
console.log("");


// VENCEDOR
console.log("Vencedor:", roundTeste.vencedor);
console.log("");
console.log("==============================");
console.log("| TESTE DO ROUND FINALIZADO |");
console.log("==============================");