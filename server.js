const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const Match = require('./logic/matches/matches');
const { simularPartida } = require('./logic/matches/matchesLogic');
const Campaign = require('./logic/campaign/campaign');

const {
    selecionarAdversariosAleatorios,
    montarTimeHistorico
} = require('./logic/campaign/campaignLogic');

const app = express();
app.use(cors()); // Permite que o frontend acesse o backend
app.use(express.json());

// 1. Conexão com o MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Conectado ao MongoDB Atlas!'))
  .catch(err => console.error('Erro na conexão:', err));

// 2. Definir a estrutura dos dados (Schema)
const JogadorSchema = new mongoose.Schema({}, { strict: false });
const Jogador = mongoose.model('Jogador', JogadorSchema, 'jogadores'); // 'jogadores' é o nome da coleção no Atlas
// 3. Rota para buscar todos os jogadores
app.get('/api/jogadores', async (req, res) => {
  try {
    const jogadores = await Jogador.find({});
    res.json(jogadores);
  } catch (error) {
    console.error('Erro ao buscar jogadores:', error);
    
    res.status(500).json({ erro: 'Erro ao buscar jogadores' });
  }
});

// 3. Rota para iniciar uma campanha
app.post('/api/campanha', async (req, res) => {

  const { timeJogador } = req.body;

  if (!timeJogador || !Array.isArray(timeJogador.jogadores)) {
      return res.status(400).json({
          erro: "Os dados do time do jogador são inválidos."
      });
  }

  if (timeJogador.jogadores.length !== 5) {
      return res.status(400).json({
          erro: "O time do jogador deve possuir exatamente 5 jogadores."
      });
  }

  const jogadorInvalido = timeJogador.jogadores.some(jogador => {
      return (
        !jogador.nome ||
        !jogador.funcao ||
        !Number.isFinite(jogador.overall)
      );
  });

  if  (jogadorInvalido) {
      return res.status(400).json({
          erro: "Um ou mais jogadores possuem dados inválidos."
      });
  }

  try {
    const jogadoresBanco = await Jogador.find({});

    if (jogadoresBanco.length === 0) {
        return res.status(404).json({
            erro: "Nenhum jogador foi encontrado no banco de dados."
        });
    }

    const adversariosSelecionados =
        selecionarAdversariosAleatorios(jogadoresBanco, 7);

    const adversarios = adversariosSelecionados.map(time =>
        montarTimeHistorico(jogadoresBanco, time.timeId)
    );

    const campanha = new Campaign(timeJogador, adversarios);
    const resultados = [];

    for (const adversario of adversarios) {
      const mapa = {
          nome: "Ascent",
          ladoFavorecido: "defesa",
          ladoInicialTimeA: "ataque"
      };

      const partida = new Match(
          timeJogador,
          adversario,
          mapa
      );

      simularPartida(partida);

      campanha.registrarResultado(partida);

      resultados.push({
          adversario: adversario.nome,
          mapa: partida.mapa.nome,
          placar: `${partida.placarA} x ${partida.placarB}`,
          vencedor: partida.vencedor.nome,
          estadoCampanha: campanha.estado,
          vitorias: campanha.vitorias,
          derrotas: campanha.derrotas
      });

      if (campanha.estado !== "em andamento") {
          break;
      }
  }

  return res.status(200).json({
    timeJogador: campanha.timeJogador.nome,
    estado: campanha.estado,
    vitorias: campanha.vitorias,
    derrotas: campanha.derrotas,
    partidas: resultados
});

} catch (error) {
    console.error("Erro ao preparar a campanha:", error);

    return res.status(500).json({
        erro: "Não foi possível preparar a campanha."
    });
}

});

// Iniciar o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});