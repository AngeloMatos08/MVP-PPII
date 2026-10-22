
 // LÓGICA RESPONSÁVEL PELA SIMULAÇÃO DAS PARTIDAS

// FATORES DE CADA FUNÇÃO
function obterFatoresFuncao(funcao) {
    switch (funcao) {
        case "Duelista":
            return { atkF: 1.40, defF: 1.00 };

        case "Iniciador":
            return { atkF: 1.25, defF: 1.15 };

        case "Controlador":
            return { atkF: 1.15, defF: 1.25 };

        case "Sentinela":
            return { atkF: 1.00, defF: 1.40 };

        default:
            return { atkF: 1.00, defF: 1.00 };
    }
}


// CALCULA O ATAQUE DO TIME
function calcularAtaque(time) {
    let soma = 0;

    for (const jogador of time) {
        const fatores = obterFatoresFuncao(jogador.funcao);
        soma += jogador.overall * fatores.atkF;
    }

    return soma / 5;
}


// CALCULA A DEFESA DO TIME
function calcularDefesa(time) {
    let soma = 0;

    for (const jogador of time) {
        const fatores = obterFatoresFuncao(jogador.funcao);
        soma += jogador.overall * fatores.defF;
    }

    return soma / 5;
}


// CALCULA A FORÇA GERAL DO TIME
function calcularForcaTime(ataque, defesa) {
    return (ataque + defesa) / 2;
}


// CALCULA A PROBABILIDADE BASE DE VITÓRIA
function calcularProbabilidadeBase(forcaA, forcaB, escala) {
    const diferenca = forcaA - forcaB;

    return 1 / (1 + Math.exp(-(diferenca / escala)));
}


// APLICA O BÔNUS DO MAPA À PROBABILIDADE
function aplicarBonusMapa(probabilidade, ladoTime, mapa, bonus) {
    if (ladoTime === mapa.ladoFavorecido) {
        return probabilidade + ((1 - probabilidade) * bonus);
    }

    return probabilidade;
}


// CALCULA A PROBABILIDADE DE O TIME A VENCER UMA RODADA
function calcularProbabilidadeRodada(partida) {
    const escala = 12;
    const bonusMapa = 0.05;

    let forcaA;
    let forcaB;

    // Compara ataque contra defesa conforme os lados atuais
    if (partida.ladoA === "ataque") {
        forcaA = partida.ataqueA;
        forcaB = partida.defesaB;
    } else {
        forcaA = partida.defesaA;
        forcaB = partida.ataqueB;
    }

    // Calcula a probabilidade inicial
    let probabilidadeA = calcularProbabilidadeBase(
        forcaA,
        forcaB,
        escala
    );

    // Se o mapa favorece o lado do Time A, aplica o bônus.
    // Se favorece o lado do Time B, aplica o bônus ao rival.
    if (partida.ladoA === partida.mapa.ladoFavorecido) {
        probabilidadeA = aplicarBonusMapa(
            probabilidadeA,
            partida.ladoA,
            partida.mapa,
            bonusMapa
        );
    } else if (partida.ladoB === partida.mapa.ladoFavorecido) {
        const probabilidadeB = aplicarBonusMapa(
            1 - probabilidadeA,
            partida.ladoB,
            partida.mapa,
            bonusMapa
        );

        probabilidadeA = 1 - probabilidadeB;
    }

    return probabilidadeA;
}


// TROCA OS LADOS DAS EQUIPES
function trocarLados(partida) {
    const ladoAnteriorA = partida.ladoA;

    partida.ladoA = partida.ladoB;
    partida.ladoB = ladoAnteriorA;
}


// SIMULA UMA PARTIDA RODADA POR RODADA
function simularPartida(partida) {
    // Impede simular novamente uma partida já encerrada
    if (partida.vencedor !== null) {
        throw new Error("Esta partida já foi simulada.");
    }

    // Continua até haver 13 rodadas e dois pontos de vantagem
    while (
        Math.max(partida.placarA, partida.placarB) < 13 ||
        Math.abs(partida.placarA - partida.placarB) < 2
    ) {
        const probabilidadeA = calcularProbabilidadeRodada(partida);

        // Sorteia o vencedor desta rodada
        if (Math.random() < probabilidadeA) {
            partida.placarA++;
        } else {
            partida.placarB++;
        }

        partida.rodadasJogadas++;

        // Troca os lados após as primeiras 12 rodadas.
        // No overtime, troca a cada duas rodadas.
        if (
            partida.rodadasJogadas === 12 ||
            (
                partida.rodadasJogadas >= 24 &&
                partida.rodadasJogadas % 2 === 0
            )
        ) {
            trocarLados(partida);
        }
    }

    // Define o vencedor com base no placar final
    if (partida.placarA > partida.placarB) {
        partida.vencedor = partida.timeA;
    } else {
        partida.vencedor = partida.timeB;
    }

    return partida;
}

// EXPORTA AS FUNÇÕES
module.exports = {
    obterFatoresFuncao,
    calcularAtaque,
    calcularDefesa,
    calcularForcaTime,
    calcularProbabilidadeBase,
    aplicarBonusMapa,
    calcularProbabilidadeRodada,
    trocarLados,
    simularPartida
};
