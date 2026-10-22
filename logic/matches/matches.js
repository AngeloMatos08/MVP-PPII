
const {
    calcularAtaque,
    calcularDefesa,
    calcularForcaTime
} = require("./matchesLogic");

// CLASSE RESPONSÁVEL POR REPRESENTAR UMA PARTIDA
class Match {
    constructor(timeA, timeB, mapa) {
        // TIMES DA PARTIDA
        this.timeA = timeA;
        this.timeB = timeB;

        // MAPA DA PARTIDA
        this.mapa = mapa;

        // LADO INICIAL DE CADA TIME
        this.ladoA = mapa.ladoInicialTimeA || "ataque";
        this.ladoB = this.ladoA === "ataque"
            ? "defesa"
            : "ataque";

        // ATRIBUTOS DO TIME A
        this.ataqueA = calcularAtaque(timeA.jogadores);
        this.defesaA = calcularDefesa(timeA.jogadores);

        this.forcaA = calcularForcaTime(
            this.ataqueA,
            this.defesaA
        );

        // ATRIBUTOS DO TIME B
        this.ataqueB = calcularAtaque(timeB.jogadores);
        this.defesaB = calcularDefesa(timeB.jogadores);

        this.forcaB = calcularForcaTime(
            this.ataqueB,
            this.defesaB
        );

        // PLACAR INICIAL
        this.placarA = 0;
        this.placarB = 0;

        // QUANTIDADE TOTAL DE RODADAS JOGADAS
        this.rodadasJogadas = 0;

        // VENCEDOR DA PARTIDA
        this.vencedor = null;
    }
}

module.exports = Match;
