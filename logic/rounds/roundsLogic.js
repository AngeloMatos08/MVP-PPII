// LÓGICA RESPONSÁVEL PELA SIMULAÇÃO DOS ROUNDS

//
// ESTE ARQUIVO SERÁ RESPONSÁVEL POR:
//
// - CALCULAR A PROBABILIDADE DE VITÓRIA DE CADA ROUND;
//
// - DEFINIR O VENCEDOR DE UM ROUND;
//
// - CONTROLAR A TROCA DE LADOS;
//
// - ATUALIZAR O RESULTADO DA PARTIDA A PARTIR DOS ROUNDS.
//

// A LÓGICA DE FORÇA DOS TIMES E DO MAPA PERMANECE EM
// ../matches/matchesLogic.js

const Round = require("./rounds");

const {
    calcularProbabilidadeBase,
    aplicarBonusMapa
} = require("../matches/matchesLogic");


// FUNÇÃO PARA CALCULAR A PROBABILIDADE DE UM ROUND
function calcularProbabilidadeRound(match, round) {

    let forcaAtacante;
    let forcaDefensor;

    if (round.timeAtacante === match.timeA) {

        forcaAtacante = match.forcaA;
        forcaDefensor = match.forcaB;

    } else {

        forcaAtacante = match.forcaB;
        forcaDefensor = match.forcaA;

    }

    // CALCULANDO A PROBABILIDADE BASE DO ATACANTE
    const probabilidadeAtacanteBase =
        calcularProbabilidadeBase(
            forcaAtacante,
            forcaDefensor,
            30
        );

    // MAPA FAVORECE O ATAQUE
    if (match.mapa.ladoFavorecido === "ataque") {

        return aplicarBonusMapa(
            probabilidadeAtacanteBase,
            "ataque",
            match.mapa,
            0.05
        );
    }

    // MAPA FAVORECE A DEFESA
    const probabilidadeDefensorBase =
        1 - probabilidadeAtacanteBase;


    const probabilidadeDefensor =
        aplicarBonusMapa(
            probabilidadeDefensorBase,
            "defesa",
            match.mapa,
            0.05
        );

    return 1 - probabilidadeDefensor;
}


// FUNÇÃO PARA SIMULAR O VENCEDOR DE UM ROUND
function simularRound(match, round) {

    const probabilidadeAtacante =
        calcularProbabilidadeRound(
            match,
            round
        );

    const sorteio = Math.random();

    if (sorteio < probabilidadeAtacante) {

        round.vencedor =
            round.timeAtacante;

    } else {

        round.vencedor =
            round.timeDefensor;

    }

    return round.vencedor;
}


// FUNÇÃO PARA ATUALIZAR O PLACAR
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


// FUNÇÃO PARA VERIFICAR SE A PARTIDA NORMAL TERMINOU
function verificarFimPartida(match) {

    if (match.placarA >= 13) {

        return true;
    }

    if (match.placarB >= 13) {

        return true;
    }

    return false;
}


// FUNÇÃO PARA OBTER O VENCEDOR DA PARTIDA NORMAL
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

    const diferenca =
        Math.abs(
            match.placarA -
            match.placarB
        );

    return diferenca >= 2;
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


// FUNÇÃO PARA TROCAR OS LADOS
function trocarLados(round) {

    const antigoAtacante =
        round.timeAtacante;

    round.timeAtacante =
        round.timeDefensor;

    round.timeDefensor =
        antigoAtacante;

    return round;
}


// FUNÇÃO PARA SIMULAR UMA PARTIDA COMPLETA
function simularPartida(match) {

    // DEFININDO OS LADOS INICIAIS
    let timeAtacante =
        match.timeA;

    let timeDefensor =
        match.timeB;

    // LOOP DA PARTIDA
    for (let numero = 1; ; numero++) {

        // CRIANDO O ROUND
        const round =
            new Round(
                numero,
                timeAtacante,
                timeDefensor
            );


        // SIMULANDO O VENCEDOR DO ROUND
        simularRound(
            match,
            round
        );

        // ATUALIZANDO O PLACAR
        atualizarPlacar(
            match,
            round
        );

        // TEMPO NORMAL
        if (numero < 25) {

            // VERIFICANDO SE UMA EQUIPE CHEGOU A 13
            if (verificarFimPartida(match)) {

                match.vencedor =
                    obterVencedorPartida(match);

                break;
            }
        }

        // PRORROGAÇÃO
        else {

            // NA PRORROGAÇÃO, SÓ TERMINA COM
            // DIFERENÇA DE 2 ROUNDS
            if (verificarFimProrrogacao(match)) {

                match.vencedor =
                    obterVencedorProrrogacao(match);

                break;
            }
        }

        // TROCA DE LADOS APÓS A PRIMEIRA METADE
        if (numero === 12) {

            const proximoRound =
                new Round(
                    numero + 1,
                    timeAtacante,
                    timeDefensor
                );

            trocarLados(
                proximoRound
            );

            timeAtacante =
                proximoRound.timeAtacante;

            timeDefensor =
                proximoRound.timeDefensor;

        }

        // TROCA DE LADOS NA PRORROGAÇÃO
        else if (numero >= 25) {

            const proximoRound =
                new Round(
                    numero + 1,
                    timeAtacante,
                    timeDefensor
                );

            trocarLados(
                proximoRound
            );

            timeAtacante =
                proximoRound.timeAtacante;

            timeDefensor =
                proximoRound.timeDefensor;
        }
    }

    return match;
}


// EXPORTANDO AS FUNÇÕES
module.exports = {
    calcularProbabilidadeRound,
    simularRound,
    atualizarPlacar,
    trocarLados,
    verificarFimPartida,
    obterVencedorPartida,
    verificarFimProrrogacao,
    obterVencedorProrrogacao,
    simularPartida
};