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

        // O MAPA FAVORECE O ATACANTE
        // ENTÃO APLICAMOS O BÔNUS DIRETAMENTE A ELE
        return aplicarBonusMapa(
            probabilidadeAtacanteBase,
            "ataque",
            match.mapa,
            0.05
        );
    }


    // CASO O MAPA FAVOREÇA A DEFESA,
    // CALCULAMOS PRIMEIRO A PROBABILIDADE DO DEFENSOR
    const probabilidadeDefensorBase =
        1 - probabilidadeAtacanteBase;


    const probabilidadeDefensor = aplicarBonusMapa(
        probabilidadeDefensorBase,
        "defesa",
        match.mapa,
        0.05
    );


    // COMO AS PROBABILIDADES DEVEM SOMAR 100%,
    // A PROBABILIDADE DO ATACANTE SERÁ O COMPLEMENTO
    return 1 - probabilidadeDefensor;
}


// EXPORTANDO A FUNÇÃO
module.exports = {
    calcularProbabilidadeRound
};