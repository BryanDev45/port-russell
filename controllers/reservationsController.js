const Catway = require('../models/catway');
const Reservation = require('../models/reservation');

/**
 * Liste les réservations d'un catway (GET /catways/:id/reservations).
 */
async function getAllReservations(req, res) {
  if (isNaN(req.params.id)) {
    return res.status(400).json({ message: 'Le numéro de catway doit être un nombre' });
  }
  if (!(await Catway.exists({ catwayNumber: req.params.id }))) {
    return res.status(404).json({ message: 'Catway introuvable' });
  }
  const reservations = await Reservation.find({ catwayNumber: req.params.id }).sort({ startDate: 1 });
  res.json(reservations);
}

/**
 * Renvoie une réservation d'un catway (GET /catways/:id/reservations/:idReservation).
 */
async function getReservation(req, res) {
  if (isNaN(req.params.id)) {
    return res.status(400).json({ message: 'Le numéro de catway doit être un nombre' });
  }
  if (!mongooseIdIsValid(req.params.idReservation)) {
    return res.status(400).json({ message: 'Identifiant de réservation invalide' });
  }
  const reservation = await Reservation.findOne({
    _id: req.params.idReservation,
    catwayNumber: req.params.id
  });
  if (!reservation) {
    return res.status(404).json({ message: 'Réservation introuvable' });
  }
  res.json(reservation);
}

/**
 * Vérifie qu'aucune autre réservation n'occupe le catway sur la période.
 * @param {number} catwayNumber Numéro du catway
 * @param {Date} startDate Début de la période
 * @param {Date} endDate Fin de la période
 * @param {string} [ignoreId] Réservation à ignorer (modification)
 * @returns {Promise<boolean>} true si le catway est libre
 */
async function isFree(catwayNumber, startDate, endDate, ignoreId) {
  const filter = {
    catwayNumber,
    startDate: { $lt: endDate },
    endDate: { $gt: startDate }
  };
  if (ignoreId) {
    filter._id = { $ne: ignoreId };
  }
  const count = await Reservation.countDocuments(filter);
  return count === 0;
}

/**
 * Crée une réservation (POST /catways/:id/reservations).
 */
async function createReservation(req, res) {
  if (isNaN(req.params.id)) {
    return res.status(400).json({ message: 'Le numéro de catway doit être un nombre' });
  }
  if (!(await Catway.exists({ catwayNumber: req.params.id }))) {
    return res.status(404).json({ message: 'Catway introuvable' });
  }
  try {
    const { clientName, boatName, startDate, endDate } = req.body;
    const reservation = new Reservation({
      catwayNumber: req.params.id,
      clientName, boatName, startDate, endDate
    });
    await reservation.validate();
    if (!(await isFree(reservation.catwayNumber, reservation.startDate, reservation.endDate))) {
      return res.status(400).json({ message: 'Ce catway est déjà réservé sur cette période' });
    }
    await reservation.save();
    res.status(201).json(reservation);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

/**
 * Modifie une réservation (PUT /catways/:id/reservations/:idReservation).
 */
async function updateReservation(req, res) {
  if (isNaN(req.params.id)) {
    return res.status(400).json({ message: 'Le numéro de catway doit être un nombre' });
  }
  if (!mongooseIdIsValid(req.params.idReservation)) {
    return res.status(400).json({ message: 'Identifiant de réservation invalide' });
  }
  const reservation = await Reservation.findOne({
    _id: req.params.idReservation,
    catwayNumber: req.params.id
  });
  if (!reservation) {
    return res.status(404).json({ message: 'Réservation introuvable' });
  }
  try {
    const { clientName, boatName, startDate, endDate } = req.body;
    reservation.set({ clientName, boatName, startDate, endDate });
    await reservation.validate();
    if (!(await isFree(reservation.catwayNumber, reservation.startDate, reservation.endDate, reservation._id))) {
      return res.status(400).json({ message: 'Ce catway est déjà réservé sur cette période' });
    }
    await reservation.save();
    res.json(reservation);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

/**
 * Supprime une réservation (DELETE /catways/:id/reservations/:idReservation).
 */
async function deleteReservation(req, res) {
  if (isNaN(req.params.id)) {
    return res.status(400).json({ message: 'Le numéro de catway doit être un nombre' });
  }
  if (!mongooseIdIsValid(req.params.idReservation)) {
    return res.status(400).json({ message: 'Identifiant de réservation invalide' });
  }
  const reservation = await Reservation.findOneAndDelete({
    _id: req.params.idReservation,
    catwayNumber: req.params.id
  });
  if (!reservation) {
    return res.status(404).json({ message: 'Réservation introuvable' });
  }
  res.json({ message: 'Réservation supprimée' });
}

/**
 * Vérifie qu'un texte a la forme d'un identifiant MongoDB.
 * @param {string} id
 * @returns {boolean}
 */
function mongooseIdIsValid(id) {
  return /^[0-9a-fA-F]{24}$/.test(id);
}

module.exports = {
  getAllReservations, getReservation, createReservation, updateReservation, deleteReservation
};
