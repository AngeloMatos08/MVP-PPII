//  LÓGICA RESPONSÁVEL PELA SIMUALÇAO DOS ROUNDS
//
// ESTE ARQUIVO SERÁ RESPONSÁVEL POR:
// - CALCULAR A PROBABILIDADE DE VITÓRIA DE CADA ROUND;
// - DEFINIR O VENCEDOR DE UM ROUND;
// CONTROLAR A TROCA DE LADOS;
// ATUALIZAR O RESULTADO DA PARTIDA A PARTIR DOS ROUNDS.
//
// A LÓGICA DE FORÇA DOS TIMES E DO MAPA PERMANECE EM
// ../matches/matchesLogic.js

const  {
    calcularProbabilidadeBase,
    aplicarBonusMapa
} = require("../matches/matchesLogic");

function calcularProbabilidadeRound(match, round) {
    let forcaAtacante;
    let forcaDefensor;


    // IDENTIFICA AS FORÇAS DE ACORDO COM OS LADOS
    if (round.timeAtacante === match.timeA) {

        forcaAtacante = match.forcaA;
        forcaDefensor = match.forcaB;

    } else {

        forcaAtacante = match.forcaB;
        forcaDefensor = match.forcaA
    }

    // CALCULA A PROBABILIDADE BASE
    const probabilidadeBase = calcularProbabilidadeBase (
        forcaAtacante,
        forcaDefensor,
        30
    );

    // APLICA O BÔNUS DO MAPA AO DEFENSOR
    const probabilidadeDefensor = aplicarBonusMapa (
        1 - probabilidadeBase,
        "defesa",
        match.mapa,
        0.05
    );

    // RETORNA A PROBABILIDADE DO ATACANTE
    return 1 - probabilidadeDefensor

}

module.exports = {
    calcularProbabilidadeBase
};