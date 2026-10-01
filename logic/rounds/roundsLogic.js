// LÓGICA RESPONSÁVEL PELA SIMULAÇÃO DOS ROUNDS
//
// ESTE ARQUIVO SERÁ RESPONSÁVEL POR:
// - CALCULAR A PROBABILIDADE DE VITÓRIA DE CADA ROUND;
// - DEFINIR O VENCEDOR DE UM ROUND;
// - CONTROLAR A TROCA DE LADOS;
// - ATUALIZAR O RESULTADO DA PARTIDA A PARTIR DOS ROUNDS.
//
// A LÓGICA DE FORÇA DOS TIMES E DO MAPA PERMANECE EM
// ../matches/matchesLogic.js


const {
    calcularProbabilidadeBase,
    aplicarBonusMapa
} = require("../matches/matchesLogic");


// FUNÇÃO PARA CALCULAR A PROBABILIDADE DE VITÓRIA
// DO TIME QUE ESTÁ ATACANDO
function calcularProbabilidadeRound(match, round) {

    let forcaAtacante;
    let forcaDefensor;


    // IDENTIFICA AS FORÇAS DE ACORDO COM OS LADOS
    if (round.timeAtacante === match.timeA) {

        forcaAtacante = match.forcaA;
        forcaDefensor = match.forcaB;

    } else {

        forcaAtacante = match.forcaB;
        forcaDefensor = match.forcaA;
    }


    // CALCULA A PROBABILIDADE BASE DO ATACANTE
    const probabilidadeAtacanteBase = calcularProbabilidadeBase(
        forcaAtacante,
        forcaDefensor,
        30
    );


    // VERIFICA QUAL LADO DO MAPA É FAVORECIDO
    if (match.mapa.ladoFavorecido === "ataque") {

        // O MAPA FAVORECE O ATAQUE
        return aplicarBonusMapa(
            probabilidadeAtacanteBase,
            "ataque",
            match.mapa,
            0.05
        );
    }


    // CASO O MAPA FAVOREÇA A DEFESA
    const probabilidadeDefensorBase =
        1 - probabilidadeAtacanteBase;


    const probabilidadeDefensor = aplicarBonusMapa(
        probabilidadeDefensorBase,
        "defesa",
        match.mapa,
        0.05
    );


    // RETORNA A PROBABILIDADE FINAL DO ATACANTE
    return 1 - probabilidadeDefensor;
}


// FUNÇÃO PARA SIMULAR O VENCEDOR DE UM ROUND
function simularRound(match, round) {

    // CALCULA A PROBABILIDADE DO ATACANTE
    const probabilidadeAtacante = calcularProbabilidadeRound(
        match,
        round
    );


    // GERA UM NÚMERO ALEATÓRIO ENTRE 0 E 1
    const sorteio = Math.random();


    // VERIFICA QUEM VENCEU O ROUND
    if (sorteio < probabilidadeAtacante) {

        // ATACANTE VENCE
        round.vencedor = round.timeAtacante;

    } else {

        // DEFENSOR VENCE
        round.vencedor = round.timeDefensor;
    }


    // RETORNA O VENCEDOR
    return round.vencedor;
}


// FUNÇÃO PARA ATUALIZAR O PLACAR DA PARTIDA
function atualizarPlacar(match, round) {

    if (round.vencedor === match.timeA) {

        match.placarA++;

    } else if (round.vencedor === match.timeB) {

        match.placarB++;
    }

    return {
        placarA: match.placarA,
        placarB: match.placarB
    };
}


// FUNÇÃO PARA VERIFICAR SE A PARTIDA TERMINOU
function verificarFimPartida(match) {

    if (match.placarA >= 13) {
        return true;
    }

    if (match.placarB >= 13) {
        return true;
    }

    return false;
}

// FUNÇÃO PARA OBTER O VENCEDOR DA PARTIDA
function obterVencedorPartida(match) {

    if (match.placarA >= 13) {
        return match.timeA;
    }

    if (match.placarB >= 13) {
        return match.timeB;
    }

    return null;
}

// FUNÇÃO PARA VERIFICAR SE A PRORROGAÇÃO TERMINOU
function verificarFimProrrogacao(match) {

    const diferenca = Match.abs (
        match.placaA - match.placarB
    );

    if (diferenca >= 2) {
        return true;
    }

    return false;
}

// FUNÇÃO PARA OBTER O VENCEDOR DA PRORROGAÇÃO
function obterVencedorProrrogacao(match) {

    if (match.placarA > match.placarB) {
        return match.timeA;
    }

    if (match.placarB > match.placarA) {
        return match.timeB;
    }

    return null;
}



// FUNÇÃO PARA TROCAR OS LADOS DOS TIMES
function trocarLados(round) {

    const antigoAtacante = round.timeAtacante;

    round.timeAtacante = round.timeDefensor;
    round.timeDefensor = antigoAtacante

    return round;
}

module.exports = {
    calcularProbabilidadeRound,
    simularRound,
    atualizarPlacar,
    trocarLados,
    verificarFimPartida,
    obterVencedorPartida,
    verificarFimProrrogacao,
    obterVencedorProrrogacao
};