const API_URL = "http://localhost:3000/api/jogadores";
const {
    calcularAtaque,
    calcularDefesa,
    calcularForcaTime
} = require("../matches/matchesLogic");
const Match = require("../matches/matches");
const { simularPartida } = require("../matches/matchesLogic");
const { VITORIAS_PARA_TITULO } = require("./campaign");

const CHANCES_ALVO_FORTES = [0.78, 0.78, 0.65, 0.65];
const CHANCES_ALVO_FRACOS = [0.45, 0.45, 0.37, 0.37];
const AMOSTRAS_POR_MAPA_LADO = 4;
const TOLERANCIA_CHANCE = 0.06;
const PESO_MINIMO_ADVERSARIO = 0.005;

function criarPRNG(seed) {
    const valorSeed = `${seed ?? ""}`;
    let h = 2166136261;

    for (let i = 0; i < valorSeed.length; i++) {
        h ^= valorSeed.charCodeAt(i);
        h = Math.imul(h, 16777619);
    }

    return function rand() {
        h += 0x6D2B79F5;
        let t = h;
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

function gerarSeedCampanha() {
    return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function calcularForcaDetalhada(time) {
    if (!Array.isArray(time) || time.length === 0) {
        return { ataque: 0, defesa: 0, forca: 0 };
    }

    const ataque = calcularAtaque(time);
    const defesa = calcularDefesa(time);

    return {
        ataque,
        defesa,
        forca: calcularForcaTime(ataque, defesa)
    };
}

function estimarProbabilidadeVitoria(timeJogador, adversario, mapas, seed) {
    const mapasValidos = Array.isArray(mapas) && mapas.length > 0
        ? mapas
        : [{ nome_mapa: "sem-mapa", lado_favorecido: null }];
    const ladosIniciais = ["ataque", "defesa"];
    let vitorias = 0;
    let partidas = 0;

    mapasValidos.forEach((mapa, indiceMapa) => {
        ladosIniciais.forEach(ladoInicial => {
            for (let amostra = 0; amostra < AMOSTRAS_POR_MAPA_LADO; amostra++) {
                const nomeMapa = mapa.nome_mapa ?? mapa.nome ?? `mapa-${indiceMapa}`;
                const idMapa = mapa.mapa_id ?? mapa.id ?? nomeMapa;
                const partida = new Match(
                    timeJogador,
                    adversario,
                    {
                        nome: nomeMapa,
                        ladoFavorecido: mapa.lado_favorecido
                            ?? mapa.ladoFavorecido
                            ?? null,
                        ladoInicialTimeA: ladoInicial
                    }
                );
                const rng = criarPRNG(
                    `${seed}|estimativa-v2|${adversario.timeId}|${idMapa}|${ladoInicial}|${amostra}`
                );

                simularPartida(partida, rng);
                if (partida.vencedor.nome === timeJogador.nome) {
                    vitorias++;
                }
                partidas++;
            }
        });
    });

    return vitorias / partidas;
}

// Busca os jogadores pela API conectada ao MongoDB Atlas
async function carregarJogadores() {
    const resposta = await fetch(API_URL);

    if (!resposta.ok) {
        throw new Error(
            `Erro ao buscar jogadores: HTTP ${resposta.status}`
        );
    }

    return await resposta.json();
}

// Identifica os times históricos cadastrados
function obterTimesHistoricos(jogadores) {
    const times = new Map();

    for (const jogador of jogadores) {
        if (!times.has(jogador.time_id)) {
            times.set(jogador.time_id, {
                timeId: jogador.time_id,
                nome: jogador.nome_time,
                ano: jogador.ano
            });
        }
    }

    return Array.from(times.values());
}

// Seleciona adversários históricos aleatoriamente
function selecionarAdversariosAleatorios(
    jogadores,
    quantidade = VITORIAS_PARA_TITULO,
    timesExcluidos = [],
    opcoes = {}
) {
    const {
        timeJogador = null,
        faseInicial = 0,
        rng = criarPRNG(gerarSeedCampanha())
    } = opcoes;

    const timesHistoricos = obterTimesHistoricos(jogadores);
    const idsExcluidos = new Set(timesExcluidos);
    const timesValidos = timesHistoricos.filter(time => {
        const jogadoresDoTime = obterJogadoresDoTime(
            jogadores,
            time.timeId
        );

        return (
            jogadoresDoTime.length === 5 &&
            !idsExcluidos.has(time.timeId)
        );
    }).sort((timeA, timeB) =>
        String(timeA.timeId).localeCompare(String(timeB.timeId))
    );

    if (timesValidos.length < quantidade) {
        throw new Error(
            `Não existem times suficientes para selecionar ${quantidade} adversários.`
        );
    }

    const pools = timesValidos.map(time => {
        const timeFormatado = montarTimeHistorico(jogadores, time.timeId);
        const forca = calcularForcaDetalhada(timeFormatado.jogadores).forca;

        return {
            ...time,
            jogadores: timeFormatado.jogadores,
            forca
        };
    });

    if (timeJogador && Array.isArray(timeJogador.jogadores)) {
        const forcaJogador = calcularForcaDetalhada(timeJogador.jogadores).forca;
        const abaixo = pools.filter(time => time.forca < forcaJogador).length;
        const igual = pools.filter(time => time.forca === forcaJogador).length;
        const posicao = igual > 0 ? abaixo + (igual - 1) / 2 : abaixo;
        const qualidade = pools.length < 2
            ? 0.5
            : Math.max(0, Math.min(1, posicao / (pools.length - 1)));

        pools.forEach(time => {
            time.probabilidadeVitoriaEstimada = estimarProbabilidadeVitoria(
                timeJogador,
                { nome: time.nome, timeId: time.timeId, jogadores: time.jogadores },
                opcoes.mapas,
                opcoes.seed ?? "selecao-campanha"
            );
        });

        pools.forEach(time => {
            time.qualidadeJogador = qualidade;
        });
    }

    const selecionados = [];
    const disponiveis = [...pools];

    for (let indice = 0; indice < quantidade; indice++) {
        const fase = Math.max(0, faseInicial + indice);
        const faseAlvo = Math.min(fase, CHANCES_ALVO_FORTES.length - 1);

        let totalPeso = 0;
        const ponderados = disponiveis.map(time => {
            if (time.probabilidadeVitoriaEstimada !== undefined) {
                const qualidade = time.qualidadeJogador ?? 0.5;
                const chanceAlvo = CHANCES_ALVO_FRACOS[faseAlvo]
                    + qualidade * (
                        CHANCES_ALVO_FORTES[faseAlvo]
                        - CHANCES_ALVO_FRACOS[faseAlvo]
                    );
                const diferenca = time.probabilidadeVitoriaEstimada - chanceAlvo;
                const peso = Math.max(
                    PESO_MINIMO_ADVERSARIO,
                    Math.exp(
                        -(diferenca * diferenca)
                        / (2 * TOLERANCIA_CHANCE * TOLERANCIA_CHANCE)
                    )
                );
                totalPeso += peso;
                return { time, peso };
            }

            const peso = 1;
            totalPeso += peso;
            return { time, peso };
        });

        const sorteio = rng() * totalPeso;
        let acumulado = 0;
        let escolhido = disponiveis[0];

        for (const item of ponderados) {
            acumulado += item.peso;
            if (sorteio <= acumulado) {
                escolhido = item.time;
                break;
            }
        }

        selecionados.push({
            timeId: escolhido.timeId,
            nome: escolhido.nome,
            ano: escolhido.ano,
            probabilidadeVitoriaEstimada: escolhido.probabilidadeVitoriaEstimada
        });

        const indiceRemovido = disponiveis.findIndex(
            time => time.timeId === escolhido.timeId
        );

        if (indiceRemovido >= 0) {
            disponiveis.splice(indiceRemovido, 1);
        }
    }

    return selecionados;
}

// Busca os jogadores pertencentes a um time
function obterJogadoresDoTime(jogadores, timeId) {
    return jogadores.filter(
        jogador => jogador.time_id === timeId
    );
}

// Monta um time histórico no formato esperado pela lógica das partidas
function montarTimeHistorico(jogadores, timeId) {
    const jogadoresDoTime = obterJogadoresDoTime(
        jogadores,
        timeId
    );

    if (jogadoresDoTime.length !== 5) {
        throw new Error(
            `O time ${timeId} possui ${jogadoresDoTime.length} jogadores, mas deveria possuir exatamente 5.`
        );
    }

    const jogadoresFormatados = jogadoresDoTime.map(jogador => {
        const funcao = jogador.funcoes?.[0];

        if (!funcao) {
            throw new Error(
                `O jogador ${jogador.nome} não possui função cadastrada.`
            );
        }

        return {
            nome: jogador.nome,
            funcao: funcao.charAt(0).toUpperCase()
                + funcao.slice(1),
            overall: jogador.overall
        };
    });

    return {
        nome: jogadoresDoTime[0].nome_time,
        jogadores: jogadoresFormatados
    };
}

// Seleciona aleatoriamente um mapa da lista recebida
function selecionarMapaAleatorio(mapas, rng = Math.random) {
    if (!Array.isArray(mapas) || mapas.length === 0) {
        throw new Error(
            "Não existem mapas disponíveis para a partida."
        );
    }

    const indiceAleatorio = Math.floor(
        rng() * mapas.length
    );

    const mapaSelecionado = mapas[indiceAleatorio];

    return {
        id: mapaSelecionado.mapa_id,
        nome: mapaSelecionado.nome_mapa,
        ladoFavorecido: mapaSelecionado.lado_favorecido
    };
}

module.exports = {
    criarPRNG,
    gerarSeedCampanha,
    calcularForcaDetalhada,
    estimarProbabilidadeVitoria,
    carregarJogadores,
    obterTimesHistoricos,
    selecionarAdversariosAleatorios,
    obterJogadoresDoTime,
    montarTimeHistorico,
    selecionarMapaAleatorio
};