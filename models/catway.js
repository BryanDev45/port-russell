const mongoose = require('mongoose');

/**
 * @typedef {Object} Catway
 * @property {number} catwayNumber Numéro du catway (unique)
 * @property {string} catwayType   Type : "long" ou "short"
 * @property {string} catwayState  Description de l'état de la passerelle
 */
const catwaySchema = new mongoose.Schema({
  catwayNumber: {
    type: Number,
    required: [true, 'Le numéro du catway est obligatoire'],
    unique: true,
    min: [1, 'Le numéro doit être supérieur ou égal à 1']
  },
  catwayType: {
    type: String,
    required: [true, 'Le type est obligatoire'],
    enum: { values: ['long', 'short'], message: 'Le type doit être "long" ou "short"' }
  },
  catwayState: {
    type: String,
    required: [true, "L'état du catway est obligatoire"],
    trim: true
  }
});

module.exports = mongoose.model('Catway', catwaySchema);
