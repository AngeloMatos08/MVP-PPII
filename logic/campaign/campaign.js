// CLASSE RESPONSÁVEL POR REPRESENTAR UMA CAMPANHA
// ARMAZENA AS INFORMAÇÕES E O ESTADO DA CAMPANHA

class Campaign {

    constructor(timeJogador, adversarios) {

        // TIME CONTROLADO PELO JOGADOR
        this.timeJogador = timeJogador;

        // ADVERSÁRIOS DA CAMAPANHA
        this.adversarios = adversarios;

        // QUANTIDADE DE VITÓRIAS
        this.vitorias = 0;

        // QUANTIDADE DE DERROTAS
        this.derrotas = 0;

        // ESTADO ATUAL DA CAMPANHA
        this.estado = "em andamento";
    }
}

module.exports = Campaign;