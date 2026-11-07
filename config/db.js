const mongoose = require('mongoose');

/**
 * Se connecte à la base MongoDB.
 * L'adresse de la base est lue dans le fichier .env (variable MONGODB_URI).
 * @async
 * @returns {Promise<void>}
 */
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connecté');
  } catch (err) {
    console.error('Erreur de connexion MongoDB :', err.message);
    process.exit(1); // on arrête le serveur : sans base, il ne sert à rien
  }
}

module.exports = connectDB;
