require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');

const app = express();

// Pour lire le JSON envoyé dans le corps des requêtes
app.use(express.json());

// Première route pour vérifier que le serveur fonctionne
app.get('/', (req, res) => {
  res.send('API du port de plaisance Russell');
});

// Toutes les routes qui commencent par /catways sont gérées par routes/catways.js
app.use('/catways', require('./routes/catways'));

const PORT = process.env.PORT || 3000;
// On démarre le serveur seulement une fois connecté à la base
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
  });
});
