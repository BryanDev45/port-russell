const mongoose = require('mongoose');

/**
 * Schéma d'un catway : numéro unique, type (long ou short) et état.
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
