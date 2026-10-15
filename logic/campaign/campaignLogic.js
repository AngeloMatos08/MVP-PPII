// LÓGICA RESPONSÁVEL PELA CAMPANHA

// MÓDULOS PARA ACESSAR ARQUIVOS
const fs = require("fs");
const path = require("path");

// CAMINHO DO ARQUIVO JSON
const caminhoPlayers = path.join (
    __dirname,
    "../../public/assets/database/players.json"
);

// FUNÇÃO PARA CARREGAR OS JOGADORES
function carregarJogadores() {
    const dados = fs.readFileSync (
        caminhoPlayers,
        "utf8"
    );

    return JSON.parse(dados);
}


// FUNÇÃO PARA OBTER OS TIMES HISTÓRICOS ÚNICOS
function obterTimesHistoricos(jogadores) {
    const times = new Map();

    for (const jogador of jogadores) {
        if (!times.has(jogador.time_id)) {
            times.set(jogador.time_id, {
                timeId: jogador.time_id, 
                nome: jogador.nome_time,
                ano: jogador.ano
            });
        }
    }

    return Array.from(times.values());
}


// FUNÇÃO PARA OBTER OS JOGADORES DE UM TIME HISTÓRICO
function obterJogadoresDoTime(jogadores, timeId) {
    return jogadores.filter (
        jogador => jogador.time_id === timeId
    );
}


// FUNÇÃO PARA MONTAR UM TIME HISTÓRICO
function montarTimeHistorico(jogadores,timeId) {
    const jogadoresDoTime = obterJogadoresDoTime (
        jogadores,
        timeId
    );

    if (jogadoresDoTime.length !== 5) {
        throw new Error (
            `O time ${timeId} não possui exatamente 5 jogadores.`
        );
    }


    const jogadoresFormatados = jogadoresDoTime.map (
        jogador => ({
            nome: jogador.nome,
            funcao: jogador.funcoes[0]
                .charAt(0)
                .toUpperCase()
                + jogador.funcoes[0].slice(1),
            overall: jogador.overall
        })
    );

    return {
        nome: jogadoresDoTime[0].nome_time,
        jogadores: jogadoresFormatados
    };
}

// EXPORTANDO AS FUNÇÕES
module.exports = {
    carregarJogadores,
    obterTimesHistoricos,
    obterJogadoresDoTime,
    montarTimeHistorico
};