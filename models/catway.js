const mongoose = require('mongoose');

/**
 * @typedef {Object} Catway
 * @property {number} catwayNumber Numéro du catway (unique)
 * @property {string} catwayType   Type : "long" ou "short"
 * @property {string} catwayState  Description de l'état de la passerelle
 */
const catwaySchema = new mongoose.Schema({
  catwayNumber: { type: Number, required: true, unique: true },
  catwayType: { type: String, required: true },
  catwayState: { type: String, required: true }
});

module.exports = mongoose.model('Catway', catwaySchema);
