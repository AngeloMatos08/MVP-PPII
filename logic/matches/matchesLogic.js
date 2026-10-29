
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

// CALCULAR O ATAQUE DO TIME
function calcularAtaque(time) {
    let soma = 0;

    for (const jogador of time) {
        const fatores = obterFatoresFuncao(jogador.funcao);
        soma += jogador.overall * fatores.atkF;
    }

    return soma / 5;
}

// CALCULAR A DEFESA DO TIME
function calcularDefesa(time) {
    let soma = 0;

    for (const jogador of time) {
        const fatores = obterFatoresFuncao(jogador.funcao);
        soma += jogador.overall * fatores.defF;
    }

    return soma / 5;
}

// CALCULAR A FORÇA GERAL DO TIME
function calcularForcaTime(ataque, defesa) {
    return (ataque + defesa) / 2;
}

// CALCULAR A PROBABILIDADE BASE DE VITÓRIA
function calcularProbabilidadeBase(forcaA, forcaB, escala) {
    const diferenca = forcaA - forcaB;
    return 1 / (1 + Math.exp(-(diferenca / escala)));
}

// APLICAR BÔNUS DO MAPA
function aplicarBonusMapa(probabilidade, ladoTime, mapa, bonus) {
    if (ladoTime === mapa.ladoFavorecido) {
        return probabilidade + ((1 - probabilidade) * bonus);
    }

    return probabilidade;
}

// CALCULAR A PROBABILIDADE DE VENCER A RODADA
function calcularProbabilidadeRodada(partida) {
    const escala = 12;
    const bonusMapa = 0.05;

    let forcaA;
    let forcaB;

    if (partida.ladoA === "ataque") {
        forcaA = partida.ataqueA;
        forcaB = partida.defesaB;
    } else {
        forcaA = partida.defesaA;
        forcaB = partida.ataqueB;
    }

    let probabilidadeA = calcularProbabilidadeBase(
        forcaA,
        forcaB,
        escala
    );

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

// TROCAR OS LADOS DOS TIMES
function trocarLados(partida) {
    const ladoAnteriorA = partida.ladoA;

    partida.ladoA = partida.ladoB;
    partida.ladoB = ladoAnteriorA;
}

// SIMULAR A PARTIDA
function simularPartida(partida) {
    if (partida.vencedor !== null) {
        throw new Error("Esta partida já foi simulada.");
    }

    while (
        Math.max(partida.placarA, partida.placarB) < 13 ||
        Math.abs(partida.placarA - partida.placarB) < 2
    ) {
        const probabilidadeA = calcularProbabilidadeRodada(partida);

        // Guardar os lados usados nesta rodada.
        const ladoAAtual = partida.ladoA;
        const ladoBAtual = partida.ladoB;

        let vencedorRodada;

        // Sortear o vencedor e atualizar o placar.
        if (Math.random() < probabilidadeA) {
            partida.placarA++;
            vencedorRodada = partida.timeA.nome;
        } else {
            partida.placarB++;
            vencedorRodada = partida.timeB.nome;
        }

        partida.rodadasJogadas++;

        // Registrar os dados da rodada no histórico.
        partida.historicoRodadas.push({
            numero: partida.rodadasJogadas,
            vencedor: vencedorRodada,
            placarA: partida.placarA,
            placarB: partida.placarB,
            ladoA: ladoAAtual,
            ladoB: ladoBAtual
        });

        // Trocar os lados após a 12ª rodada e, depois,
        // a cada duas rodadas a partir da 24ª.
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

    // Definir o vencedor da partida.
    if (partida.placarA > partida.placarB) {
        partida.vencedor = partida.timeA;
    } else {
        partida.vencedor = partida.timeB;
    }

    return partida;
}

// EXPORTAR AS FUNÇÕES
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
