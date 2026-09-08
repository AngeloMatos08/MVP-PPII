class Player {
    constructor(id, nome) {
        this.id = id;
        this.nome = nome;
        this.historico = [];
    }

    adicionarHistorico(ano, time, funcao, geral) {
        this.historico.push({
            ano: ano,
            time: time,
            funcao: funcao,
            geral: geral
        });
    }
}