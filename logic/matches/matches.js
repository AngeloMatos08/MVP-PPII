// Classe responsável por representar uma partida 

const { 
    calcularAtaque, 
    calcularDefesa    
} = require("./matchesLogic");

class Match {
    constructor(timeA, timeB) {
        this.timeA = timeA;
        this.timeB = timeB;

        // Atributos time A
        this.ataqueA = calcularAtaque(timeA.jogadores);
        this.defesaA = calcularDefesa(timeA.jogadores);

        // Atributos time B
        this.ataqueB = calcularAtaque(timeB.jogadores);
        this.defesaB = calcularDefesa(timeB.jogadores);

        this.placarA = 0;
        this.placarB = 0;

        this.vencedor = null;
    }
}

// Expondo a classe
module.exports = Match;