class Player {
    constructor(id, nome) {
        this.atleta_id = atleta_id;
        this.nome = nome;
        this.historico = [];
    }

    adicionarHistorico(ano, time, funcao, overall) {
        this.historico.push({
            ano: ano,
            time: time,
            funcao: funcao,
            overall: overall
        });
    }
}
