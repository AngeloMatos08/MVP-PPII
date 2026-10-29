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
app.use(cors()); // Permite que o frontend acesse o backend
app.use(express.json());

// 1. Conexão com o MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Conectado ao MongoDB Atlas!'))
  .catch(err => console.error('Erro na conexão:', err));

// 2. Definir a estrutura dos dados (Schema)

// 'jogadores' é o nome da coleção no Atlas
const JogadorSchema = new mongoose.Schema({}, { strict: false });
const Jogador = mongoose.model('Jogador', JogadorSchema, 'jogadores');

// 'mapas' é o nome da coleção no Atlas
const MapaSchema = new mongoose.Schema({}, { strict: false });
const Mapa = mongoose.model('Mapa', MapaSchema, 'maps');
 
// Rota temporária para testar a consulta dos mapas
app.get('/api/mapas', async (req, res) => {
    try {
        const mapas = await Mapa.find({});
        res.json(mapas);
    } catch (error) {
        console.error('Erro ao buscar mapas:', error);

        res.status(500).json({
            erro: 'Erro ao buscar mapas'
        });
    }
});

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

    const mapasBanco = await Mapa.find({});

    if (mapasBanco.length === 0) {
        return res.status(404).json({
            erro: "Nenhum mapa foi encontrado no banco de dados."
        });
    }

    const adversariosSelecionados =
        selecionarAdversariosAleatorios(jogadoresBanco, 7);

    const adversarios = adversariosSelecionados.map(time =>
        montarTimeHistorico(jogadoresBanco, time.timeId)
    );

    console.log(
        "Adversários selecionados:",
        adversarios.map(time => time.nome)
    );

    console.log(
        "Quantidade de jogadores por adversário:",
        adversarios.map(time => ({
            nome: time.nome,
            jogadores: time.jogadores.length
        }))
    );

    console.log(
    "Validação dos jogadores adversários:",
    adversarios.map(time => ({
        nome: time.nome,
        jogadoresValidos: time.jogadores.every(jogador =>
            typeof jogador.nome === "string" &&
            jogador.nome.trim() !== "" &&
            typeof jogador.funcao === "string" &&
            jogador.funcao.trim() !== "" &&
            Number.isFinite(jogador.overall)
        )
    }))
    );

    const campanha = new Campaign(timeJogador, adversarios);
    const resultados = [];

    for (const adversario of adversarios) {

        const mapaSorteado = selecionarMapaAleatorio(mapasBanco);
        const mapa = {
            id: mapaSorteado.id,
            nome: mapaSorteado.nome,
            ladoFavorecido: mapaSorteado.ladoFavorecido,
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
          derrotas: campanha.derrotas,
          historicoRodadas: partida.historicoRodadas
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