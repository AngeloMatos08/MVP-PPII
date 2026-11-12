
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const Match = require('./logic/matches/matches');
const { simularPartida } = require('./logic/matches/matchesLogic');
const Campaign = require('./logic/campaign/campaign');
const { VITORIAS_PARA_TITULO } = Campaign;

const {
    selecionarAdversariosAleatorios,
    montarTimeHistorico,
    selecionarMapaAleatorio,
    criarPRNG,
    gerarSeedCampanha
} = require('./logic/campaign/campaignLogic');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});

// 1. Configuração da conexão com o MongoDB Atlas

mongoose.connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 5000
})
    .then(() => console.log('Conectado ao MongoDB Atlas!'))
    .catch(error => console.error('Erro na conexão com MongoDB:', error));

// 2. Definição dos modelos do banco de dados

const JogadorSchema = new mongoose.Schema({}, { strict: false });
const Jogador = mongoose.model('Jogador', JogadorSchema, 'jogadores');

const MapaSchema = new mongoose.Schema({}, { strict: false });
const Mapa = mongoose.model('Mapa', MapaSchema, 'maps');

// 3. Rota para buscar todos os jogadores

app.get('/api/jogadores', async (req, res) => {
    try {
        const jogadores = await Jogador.find({});
        return res.status(200).json(jogadores);

    } catch (error) {
        console.error('Erro ao buscar jogadores:', error);

        return res.status(500).json({
            erro: 'Erro ao buscar jogadores.'
        });
    }
});

// 4. Rota para iniciar uma campanha

app.post('/api/campanha', async (req, res) => {

    const { timeJogador, seed: seedRecebida } = req.body;
    const seedCampanha = typeof seedRecebida === 'string' && seedRecebida.trim() !== ''
        ? seedRecebida.trim()
        : gerarSeedCampanha();
    const rng = criarPRNG(seedCampanha);

    const timeJogadorNormalizado = {
        nome: typeof timeJogador?.nome === 'string' && timeJogador.nome.trim() !== ''
            ? timeJogador.nome.trim()
            : 'Meu Time',
        jogadores: Array.isArray(timeJogador?.jogadores)
            ? timeJogador.jogadores.map((jogador) => ({
                nome: typeof jogador?.nome === 'string' ? jogador.nome.trim() : '',
                funcao: typeof jogador?.funcao === 'string' ? jogador.funcao.trim() : '',
                overall: Number(jogador?.overall)
            }))
            : []
    };

    // Validação da estrutura do time

    if (!timeJogadorNormalizado || !Array.isArray(timeJogadorNormalizado.jogadores)) {
        return res.status(400).json({
            erro: 'Os dados do time do jogador são inválidos.'
        });
    }

    // Validação da quantidade de jogadores

    if (timeJogadorNormalizado.jogadores.length !== 5) {
        return res.status(400).json({
            erro: 'O time do jogador deve possuir exatamente 5 jogadores.'
        });
    }

    // Validação dos dados individuais dos jogadores

    const jogadorInvalido = timeJogadorNormalizado.jogadores.some(jogador => {
        return (
            !jogador ||
            typeof jogador.nome !== 'string' ||
            jogador.nome.trim() === '' ||
            typeof jogador.funcao !== 'string' ||
            jogador.funcao.trim() === '' ||
            !Number.isFinite(jogador.overall)
        );
    });

    if (jogadorInvalido) {
        return res.status(400).json({
            erro: 'Um ou mais jogadores possuem dados inválidos.'
        });
    }

    try {

        // Consulta dos jogadores e mapas no banco de dados

        const jogadoresBanco = await Jogador.find({});

        if (jogadoresBanco.length === 0) {
            return res.status(404).json({
                erro: 'Nenhum jogador foi encontrado no banco de dados.'
            });
        }

        const mapasBanco = await Mapa.find({});

        if (mapasBanco.length === 0) {
            return res.status(404).json({
                erro: 'Nenhum mapa foi encontrado no banco de dados.'
            });
        }

        const mapasOrdenados = [...mapasBanco].sort((mapaA, mapaB) =>
            String(mapaA.mapa_id).localeCompare(String(mapaB.mapa_id))
        );

        // Seleção dos sete adversários históricos determinística por seed

        const adversariosSelecionados =
            selecionarAdversariosAleatorios(
                jogadoresBanco,
                VITORIAS_PARA_TITULO,
                [],
                {
                    timeJogador: timeJogadorNormalizado,
                    mapas: mapasOrdenados,
                    seed: seedCampanha,
                    rng
                }
            );

        const adversarios = adversariosSelecionados.map(time => {
            const timeHistorico = montarTimeHistorico(jogadoresBanco, time.timeId);
            timeHistorico.timeId = time.timeId;
            timeHistorico.ano = time.ano;
            timeHistorico.probabilidadeVitoriaEstimada = time.probabilidadeVitoriaEstimada;
            return timeHistorico;
        });

        // Inicialização da campanha

        const campanha = new Campaign(timeJogadorNormalizado, adversarios);
        const resultados = [];

        // Simulação das partidas da campanha

        for (const adversario of adversarios) {

            const mapaSorteado = selecionarMapaAleatorio(mapasOrdenados, rng);

            const mapa = {
                id: mapaSorteado.id,
                nome: mapaSorteado.nome,
                ladoFavorecido: mapaSorteado.ladoFavorecido,
                ladoInicialTimeA: rng() < 0.5 ? 'ataque' : 'defesa'
            };

            const partida = new Match(
                { ...timeJogadorNormalizado, jogadores: timeJogadorNormalizado.jogadores },
                adversario,
                mapa
            );

            simularPartida(partida, rng);

            campanha.registrarResultado(partida);

            // Registro do resultado da partida

            resultados.push({
                numeroConfronto: resultados.length + 1,
                adversario: adversario.nome,
                adversarioNome: adversario.nome,
                adversarioAno: adversario.ano ?? null,
                probabilidadeEstimadaVitoria: adversario.probabilidadeVitoriaEstimada ?? null,
                adversarioDetalhes: {
                    nome: adversario.nome,
                    ano: adversario.ano ?? null,
                    time_id: adversario.timeId ?? null,
                    jogadores: Array.isArray(adversario.jogadores)
                        ? adversario.jogadores.map(jogador => ({
                            nome: jogador.nome,
                            funcao: jogador.funcao,
                            overall: Number(jogador.overall)
                        }))
                        : []
                },
                mapa: partida.mapa.nome,
                mapaNome: partida.mapa.nome,
                ladoFavorecido: partida.mapa.ladoFavorecido,
                ladoInicialTimeJogador: partida.ladoA,
                ladoInicialAdversario: partida.ladoB,
                placar: `${partida.placarA} x ${partida.placarB}`,
                vencedor: partida.vencedor.nome,
                estadoCampanha: campanha.estado,
                vitorias: campanha.vitorias,
                derrotas: campanha.derrotas,
                historicoRodadas: partida.historicoRodadas
            });

            // Encerramento da campanha após o título ou a eliminação

            if (campanha.estado !== 'em andamento') {
                break;
            }
        }

        // Resposta enviada ao frontend

        return res.status(200).json({
            seed: seedCampanha,
            versaoCampanha: 'campanha-seed-v3',
            vitoriasNecessarias: VITORIAS_PARA_TITULO,
            timeJogador: campanha.timeJogador.nome,
            timeJogadorDetalhes: {
                nome: campanha.timeJogador.nome,
                jogadores: campanha.timeJogador.jogadores.map(jogador => ({
                    nome: jogador.nome,
                    funcao: jogador.funcao,
                    overall: Number(jogador.overall)
                }))
            },
            timeJogadorCompleto: campanha.timeJogador,
            estado: campanha.estado,
            vitorias: campanha.vitorias,
            derrotas: campanha.derrotas,
            partidas: resultados
        });

    } catch (error) {
        console.error('Erro ao preparar a campanha:', error);

        return res.status(500).json({
            erro: 'Não foi possível preparar a campanha.'
        });
    }
});

// 5. Inicialização do servidor
