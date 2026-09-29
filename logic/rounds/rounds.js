// CLASSE RESPONSÁVEL POR REPRESENTAR UM ROUND
// ARMAZENA AS INFORMAÇÕES E O ESTADO DE UM ROUND INDIVIDUAL

class Round {

    constructor(numero, timeAtacante, timeDefensor) {

        // NÚMERO DO ROUND
        this.numero = numero;

        // TIMES E SEUS RESPECTIVOS LADOS
        this.timeAtacante = timeAtacante;
        this.timeDefensor = timeDefensor;

        // VENCEDOR DO ROUND
        // COMEÇA COMO NULL PORQUE O ROUND AINDA NÃO FOI SIMULADO
        this.vencedor = null;
    }
}

module.exports = Round;