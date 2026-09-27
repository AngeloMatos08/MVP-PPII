// LÓGICA RESPONSÁVEL PELA SIMULAÇÃO DAS PARTIDAS

// FUNÇÃO PARA OBTER OS FATORES DE CADA FUNÇÃO (ORIGINAL)
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


// FUNÇÃO PARA CALCULAR O ATAQUE DO TIME (ORIGINAL/ANTIGA)
function calcularAtaque(time) {
    let soma = 0;

    for (let jogador of time) {
 
        const fatores = obterFatoresFuncao(jogador.funcao);
        soma += jogador.overall * fatores.atkF;
    }
    return soma / 5;
}


// FUNÇÃO PARA CALCULAR A DEFESA DO TIME (ORIGINAL/ANTIGA)
function calcularDefesa(time) {
    let soma = 0;

    for (let jogador of time) {

        const fatores = obterFatoresFuncao(jogador.funcao);
        soma += jogador.overall * fatores.defF;
    }
    return soma / 5;
}


// FUNÇÃO PARA CALCULAR A FORÇA GERAL DO TIME (NOVO)
function calcularForcaTime(ataque, defesa) {
    return (ataque + defesa) / 2;
}


// FUNÇÃO PARA CALCULAR PROBABILIDADE BASE 
// DE CADA TIME E DIFERENÇA ENTRE ELES (NOVO)
function calcularProbabilidadeBase(forcaA, forcaB, escala) {
    
    const diferenca = forcaA - forcaB;
    return 1 / (1 + Math.exp(-(diferenca / escala)));
}


// FUNÇÃO QUE APLICA O BÔNUS DO MAPA (NOVO)
function aplicarBonusMapa(probabilidade, ladoTime, mapa, bonus) {
    if (ladoTime === mapa.ladoFavorecido) {
        return probabilidade + ((1 - probabilidade) * bonus);
    }

    return probabilidade;
}

// FUNÇÃO PARA CALCULAR A TAXA DE VITÓRIA DE UM TIME (ORIGINAL/ANTIGA)
function calcularTaxaVitoria(ataque, defesaInimigo, atkM, defM) {

    return (ataque * atkM) - (defesaInimigo * defM);
}


// FUNÇÃO PARA CALCULAR A PROBABILIDADE DE VITÓRIA (ORIGINAL/ANTIGA)
function calcularProbabilidade(va, vb) {

    return va / (va + vb);
}


//EXPORTANDO AS FUNÇÕES PARA SEREM USADAS EM OUTROS ARQUIVOS
module.exports = {
    obterFatoresFuncao,
    calcularAtaque,
    calcularDefesa,
    calcularForcaTime,
    calcularProbabilidadeBase,
    aplicarBonusMapa,
    calcularTaxaVitoria,
    calcularProbabilidade
};