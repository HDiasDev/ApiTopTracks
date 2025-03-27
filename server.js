require('dotenv').config();
const express = require("express");
const axios = require("axios");
const cors = require('cors');
const path = require("path");
const querystring = require("querystring"); // Para manipular a query string
const app = express();

app.use(cors());

// Serve arquivos estáticos (como o index.html e arquivos CSS)
app.use(express.static(path.join(__dirname, 'public')));

const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
const redirectUri = process.env.SPOTIFY_REDIRECT_URI;

const PORT = 3000;

// Array para armazenar as faixas populares (cache)
let tracksCache = [];

// Rota para servir o arquivo index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Rota de autenticação para o Spotify
app.get('/auth', (req, res) => {
  const scopes = 'user-library-read user-read-private'; // Defina os escopos de permissão conforme necessário

  const authUrl = 'https://accounts.spotify.com/authorize?' + querystring.stringify({
    response_type: 'code',
    client_id: clientId,
    scope: scopes,
    redirect_uri: redirectUri
  });

  res.redirect(authUrl); // Redireciona o usuário para a página de login do Spotify
});

// Rota de callback após o login no Spotify
app.get('/callback', async (req, res) => {
  const { code } = req.query;

  if (!code) {
    return res.status(400).send('Código de autorização não encontrado.');
  }

  const tokenUrl = 'https://accounts.spotify.com/api/token';

  try {
    // Trocar o código de autorização pelo access token
    const response = await axios.post(tokenUrl, querystring.stringify({
      code,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code'
    }), {
      headers: {
        'Authorization': 'Basic ' + Buffer.from(`${clientId}:${clientSecret}`).toString('base64'),
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    const { access_token, refresh_token } = response.data;

    // Aqui você pode armazenar o access_token e refresh_token, ou apenas passá-los como resposta
    res.json({
      access_token,
      refresh_token
    });
  } catch (error) {
    console.error('Erro ao obter token:', error);
    res.status(500).send('Erro ao obter o token de acesso.');
  }
});

// Função para buscar o ID do artista pelo nome
async function getArtistId(artistName, accessToken) {
  try {
    const response = await axios.get(`https://api.spotify.com/v1/search`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      },
      params: {
        q: artistName,
        type: 'artist',
        limit: 1
      }
    });

    if (response.data.artists.items.length > 0) {
      return response.data.artists.items[0].id; // Retorna o primeiro ID encontrado
    } else {
      throw new Error('Artista não encontrado');
    }
  } catch (error) {
    console.error('Erro ao buscar ID do artista:', error);
    throw error;
  }
}

// Endpoint para buscar músicas populares de um artista usando nome
app.get("/artist-top-tracks", async (req, res) => {
  const artistName = req.query.artistName;
  const accessToken = req.query.access_token; // O token de acesso pode vir como query string

  if (!artistName) {
    return res.status(400).json({ error: "Por favor, forneça o nome do artista." });
  }

  // Verificar se as faixas do artista estão no cache
  const cachedTracks = tracksCache.find(track => track.artistName.toLowerCase() === artistName.toLowerCase());

  if (cachedTracks) {
    // Se o artista estiver no cache, retorna as faixas diretamente
    return res.json({ tracks: cachedTracks.tracks });
  }

  try {
    // Busca o ID do artista com base no nome
    const artistId = await getArtistId(artistName, accessToken);

    // Agora, com o ID do artista, buscamos as faixas populares
    const response = await axios.get(`https://api.spotify.com/v1/artists/${artistId}/top-tracks?market=US`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    // Extrair apenas os dados essenciais
    const tracks = response.data.tracks.map(track => ({
      name: track.name,
      artist: track.artists[0].name,
      url: track.external_urls.spotify
    }));

    // Armazenar as faixas no cache para reutilização futura
    tracksCache.push({
      artistName: artistName,
      tracks: tracks
    });

    // Responder com os dados organizados
    res.json({ tracks });
  } catch (error) {
    console.error("Erro ao buscar músicas populares:", error);
    res.status(500).json({ error: "Erro ao buscar músicas populares" });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
