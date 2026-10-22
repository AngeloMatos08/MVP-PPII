// CLASSE RESPONSÁVEL POR REPRESENTAR UMA PARTIDA

const { 
    calcularAtaque, 
    calcularDefesa, 
    calcularForcaTime
} = require("./matchesLogic");


class Match {
    constructor(timeA, timeB, mapa) {
        // TIMES DA PARTIDA
        this.timeA = timeA;
        this.timeB = timeB;


        // MAPA DA PARTIDA
        this.mapa = mapa;


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


        // PLACAR INICIAL DA PARTIDA
        this.placarA = 0;
        this.placarB = 0;


        // VENCEDOR DA PARTIDA
        this.vencedor = null;
    }
}

// EXPORTANDO A CLASSE
module.exports = Match;