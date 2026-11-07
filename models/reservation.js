const mongoose = require('mongoose');

/**
 * Schéma d'une réservation de catway.
 */
const reservationSchema = new mongoose.Schema({
  catwayNumber: { type: Number, required: [true, 'Le numéro du catway est obligatoire'] },
  clientName: { type: String, required: [true, 'Le nom du client est obligatoire'], trim: true },
  boatName: { type: String, required: [true, 'Le nom du bateau est obligatoire'], trim: true },
  startDate: { type: Date, required: [true, 'La date de début est obligatoire'] },
  endDate: { type: Date, required: [true, 'La date de fin est obligatoire'] }
});

reservationSchema.pre('validate', function () {
  if (this.startDate && this.endDate && this.endDate <= this.startDate) {
    this.invalidate('endDate', 'La date de fin doit être après la date de début');
  }
});

module.exports = mongoose.model('Reservation', reservationSchema);
