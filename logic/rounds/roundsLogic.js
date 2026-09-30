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

<<<<<<< HEAD
        // O MAPA FAVORECE O ATACANTE
        // ENTÃO APLICAMOS O BÔNUS DIRETAMENTE A ELE
        return aplicarBonusMapa(
=======
        // O MAPA FAVORECE O ATAQUE
        return aplicarBonusMapa (
>>>>>>> fe2c331 (Atualização da sintaxe)
            probabilidadeAtacanteBase,
            "ataque",
            match.mapa,
            0.05
        );
    }


<<<<<<< HEAD
    // CASO O MAPA FAVOREÇA A DEFESA,
    // CALCULAMOS PRIMEIRO A PROBABILIDADE DO DEFENSOR
    const probabilidadeDefensorBase =
        1 - probabilidadeAtacanteBase;


    const probabilidadeDefensor = aplicarBonusMapa(
=======
    // CASO O MAPA FAVOREÇA A DEFESA
    const probabilidadeDefensorBase =
        1 - probabilidadeAtacanteBase;

    const probabilidadeDefensor = aplicarBonusMapa (
>>>>>>> fe2c331 (Atualização da sintaxe)
        probabilidadeDefensorBase,
        "defesa",
        match.mapa,
        0.05
    );

<<<<<<< HEAD

    // COMO AS PROBABILIDADES DEVEM SOMAR 100%,
    // A PROBABILIDADE DO ATACANTE SERÁ O COMPLEMENTO
    return 1 - probabilidadeDefensor;
}


// EXPORTANDO A FUNÇÃO
module.exports = {
    calcularProbabilidadeRound
=======
    // RETORNA A PROBABILIDADE FINAL DO ATACANTE
    return 1 - probabilidadeAtacanteBase;
}


// FUNÇÃO PARA SIMULAR O VENCEDOR DE UM ROUND
function simularRound(match, round) {

    // CALCULA A PROBABILIDADE DO ATACANTE
    const probabilidadeAtacante = calcularProbabilidadeRound (
        match,
        round
    );

    // GERA UM NÚMERO ALEATÓRIO ENTRE 0 E 1
    const sorteio = Math.random();

    // VEFIRICA QUEM VENCEU O ROUND
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


module.exports = {
    calcularProbabilidadeRound,
    simularRound,
    atualizarPlacar
>>>>>>> fe2c331 (Atualização da sintaxe)
};