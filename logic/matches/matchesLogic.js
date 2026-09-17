//Lógica responsável pela simulação das partidas

// Função para obter Fatores de cada posição
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

// Função para calcular o ataque do Time

function calcularAtaque(time) {
    let soma = 0;

    for (let jogador of time) {
 
        const fatores = obterFatoresFuncao(jogador.funcao);
        soma += jogador.overall * fatores.atkF;
    }
    return soma / 5;
}

// Função para calcular a defesa do time

function calcularDefesa(time) {
    let soma = 0;

    for (let jogador of time) {

        const fatores = obterFatoresFuncao(jogador.funcao);
        soma += jogador.overall * fatores.defF;
    }
    return soma / 5;
}