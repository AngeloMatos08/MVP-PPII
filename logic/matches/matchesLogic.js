// LÓGICA RESPONSÁVEL PELA SIMULAÇÃO DAS PARTIDAS

// FUNÇÃO PARA OBTER OS FATORES DE CADA FUNÇÃO (V. FINAL)
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


// FUNÇÃO PARA CALCULAR O ATAQUE DO TIME (V. FINAL)
function calcularAtaque(time) {
    let soma = 0;

    for (let jogador of time) {
 
        const fatores = obterFatoresFuncao(jogador.funcao);
        soma += jogador.overall * fatores.atkF;
    }
    return soma / 5;
}


// FUNÇÃO PARA CALCULAR A DEFESA DO TIME (V. FINAL)
function calcularDefesa(time) {
    let soma = 0;

    for (let jogador of time) {

        const fatores = obterFatoresFuncao(jogador.funcao);
        soma += jogador.overall * fatores.defF;
    }
    return soma / 5;
}


// FUNÇÃO PARA CALCULAR A FORÇA GERAL DO TIME (V. FINAL)
function calcularForcaTime(ataque, defesa) {
    return (ataque + defesa) / 2;
}


// FUNÇÃO PARA CALCULAR PROBABILIDADE BASE 
// DE CADA TIME E DIFERENÇA ENTRE ELES (V. FINAL)
function calcularProbabilidadeBase(forcaA, forcaB, escala) {
    
    const diferenca = forcaA - forcaB;
    return 1 / (1 + Math.exp(-(diferenca / escala)));
}


// FUNÇÃO QUE APLICA O BÔNUS DO MAPA (V. FINAL)
function aplicarBonusMapa(probabilidade, ladoTime, mapa, bonus) {
    if (ladoTime === mapa.ladoFavorecido) {
        return probabilidade + ((1 - probabilidade) * bonus);
    }

    return probabilidade;
}


//EXPORTANDO AS FUNÇÕES PARA SEREM USADAS EM OUTROS ARQUIVOS
module.exports = {
    obterFatoresFuncao,
    calcularAtaque,
    calcularDefesa,
    calcularForcaTime,
    calcularProbabilidadeBase,
    aplicarBonusMapa
};