const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors()); // Permite que o front-end acesse o backend
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
    res.status(500).json({ erro: 'Erro ao buscar jogadores' });
  }
});

// Iniciar o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});