const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const Match = require('./logic/matches/matches');
const { simularPartida } = require('./logic/matches/matchesLogic');
const Campaign = require('./logic/campaign/campaign');

const {
    selecionarAdversariosAleatorios,
    montarTimeHistorico,
    selecionarMapaAleatorio
} = require('./logic/campaign/campaignLogic');

const app = express();

app.use(cors());
app.use(express.json());

// 1. Definição dos modelos do banco de dados

const JogadorSchema = new mongoose.Schema({}, { strict: false });
const Jogador = mongoose.model('Jogador', JogadorSchema, 'jogadores');

const MapaSchema = new mongoose.Schema({}, { strict: false });
const Mapa = mongoose.model('Mapa', MapaSchema, 'maps');

// 2. Rota para buscar todos os jogadores

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

// 3. Rota para iniciar uma campanha

app.post('/api/campanha', async (req, res) => {

    const { timeJogador } = req.body;

    // Validação da estrutura do time

    if (!timeJogador || !Array.isArray(timeJogador.jogadores)) {
        return res.status(400).json({
            erro: 'Os dados do time do jogador são inválidos.'
        });
    }

    // Validação da quantidade de jogadores

    if (timeJogador.jogadores.length !== 5) {
        return res.status(400).json({
            erro: 'O time do jogador deve possuir exatamente 5 jogadores.'
        });
    }

    // Validação dos dados individuais dos jogadores

    const jogadorInvalido = timeJogador.jogadores.some(jogador => {
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

        // Seleção dos sete adversários históricos

        const adversariosSelecionados =
            selecionarAdversariosAleatorios(jogadoresBanco, 7);

        const adversarios = adversariosSelecionados.map(time =>
            montarTimeHistorico(jogadoresBanco, time.timeId)
        );

        // Inicialização da campanha

        const campanha = new Campaign(timeJogador, adversarios);
        const resultados = [];

        // Simulação das partidas da campanha

        for (const adversario of adversarios) {

            const mapaSorteado = selecionarMapaAleatorio(mapasBanco);

            const mapa = {
                id: mapaSorteado.id,
                nome: mapaSorteado.nome,
                ladoFavorecido: mapaSorteado.ladoFavorecido,
                ladoInicialTimeA: Math.random() < 0.5
                    ? 'ataque'
                    : 'defesa'
            };

            const partida = new Match(
                timeJogador,
                adversario,
                mapa
            );

            simularPartida(partida);

            campanha.registrarResultado(partida);

            // Registro do resultado da partida

            resultados.push({
                adversario: adversario.nome,

                mapa: partida.mapa.nome,
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
            timeJogador: campanha.timeJogador.nome,
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

// 4. Inicialização do servidor após conectar ao MongoDB

const PORT = process.env.PORT || 3000;

async function iniciarServidor() {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        console.log('Conectado ao MongoDB Atlas!');

        app.listen(PORT, () => {
            console.log(`Servidor rodando em http://localhost:${PORT}`);
        });

    } catch (error) {
        console.error('Erro ao conectar ao MongoDB:', error);
        process.exit(1);
    }
}

iniciarServidor();
