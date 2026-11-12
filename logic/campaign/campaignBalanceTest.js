const assert = require("node:assert/strict");
const {
    criarPRNG,
    estimarProbabilidadeVitoria,
    montarTimeHistorico,
    obterJogadoresDoTime,
    selecionarAdversariosAleatorios
} = require("./campaignLogic");

const funcoes = [
    "Duelista",
    "Iniciador",
    "Controlador",
    "Sentinela",
    "Iniciador"
];
const notasTimes = [70, 74, 78, 82, 86, 90, 94, 98];
const jogadoresHistoricos = notasTimes.flatMap((overall, indiceTime) =>
    funcoes.map((funcao, indiceJogador) => ({
        time_id: `time-${indiceTime}`,
        nome_time: `Time ${indiceTime}`,
        ano: 2021 + indiceTime,
        nome: `Jogador ${indiceTime}-${indiceJogador}`,
        funcoes: [funcao.toLowerCase()],
        overall: overall + (indiceJogador % 2)
    }))
);
const mapas = [
    { mapa_id: "ascent", nome_mapa: "Ascent", lado_favorecido: "defesa" },
    { mapa_id: "pearl", nome_mapa: "Pearl", lado_favorecido: "ataque" }
];
const timeJogador = {
    nome: "Meu Time",
    jogadores: funcoes.map((funcao, indice) => ({
        nome: `Meu jogador ${indice}`,
        funcao,
        overall: 88 + (indice % 2)
    }))
};

const opcoes = {
    timeJogador,
    mapas,
    seed: "roster-normalization-test",
    rng: criarPRNG("selection-seed")
};
const selecionados = selecionarAdversariosAleatorios(
    jogadoresHistoricos,
    7,
    [],
    opcoes
);
const repetidos = selecionarAdversariosAleatorios(
    jogadoresHistoricos,
    7,
    [],
    { ...opcoes, rng: criarPRNG("selection-seed") }
);

assert.deepEqual(selecionados, repetidos);
assert.equal(new Set(selecionados.map(time => time.timeId)).size, 7);
assert.ok(selecionados.every(time => Number.isFinite(time.probabilidadeVitoriaEstimada)));

const chancesRoleAware = selecionados.map(time => {
    const adversario = {
        ...montarTimeHistorico(jogadoresHistoricos, time.timeId),
        timeId: time.timeId
    };

    return estimarProbabilidadeVitoria(
        timeJogador,
        adversario,
        mapas,
        opcoes.seed
    );
});

for (let indice = 0; indice < selecionados.length; indice++) {
    assert.equal(
        selecionados[indice].probabilidadeVitoriaEstimada,
        chancesRoleAware[indice]
    );
}

const candidatosComFuncoesIgnoradas = selecionados.map(time => {
    const rosterCru = obterJogadoresDoTime(jogadoresHistoricos, time.timeId);
    return estimarProbabilidadeVitoria(
        timeJogador,
        { nome: time.nome, timeId: time.timeId, jogadores: rosterCru },
        mapas,
        opcoes.seed
    );
});

assert.ok(chancesRoleAware.some((chance, indice) => chance !== candidatosComFuncoesIgnoradas[indice]));
console.log("[PASSOU] Seleção histórica role-aware e reproduzível por seed");