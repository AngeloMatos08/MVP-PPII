
class Campaign {
    constructor(timeJogador, adversarios) {
        this.timeJogador = timeJogador;
        this.adversarios = adversarios;
        this.vitorias = 0;
        this.derrotas = 0;
        this.estado = "em andamento";
    }

    registrarResultado(partida) {
        // Impede que uma campanha encerrada continue
        if (this.estado !== "em andamento") {
            throw new Error(
                "Não é possível registrar resultados: a campanha já foi encerrada."
            );
        }

        // Verifica se a partida possui um vencedor definido
        if (!partida.vencedor) {
            throw new Error(
                "Não é possível registrar uma partida sem vencedor."
            );
        }

        // Identifica se o time do jogador venceu
        if (partida.vencedor.nome === this.timeJogador.nome) {
            this.vitorias++;

            // Sete vitórias encerram a campanha com título
            if (this.vitorias === 7) {
                this.estado = "campeão";
            }
        } else {
            // Uma derrota elimina o time imediatamente
            this.derrotas++;
            this.estado = "eliminado";
        }
    }
}

module.exports = Campaign;
