const Catway = require('../models/catway');
const Reservation = require('../models/reservation');

/**
 * Liste les réservations d'un catway (GET /catways/:id/reservations).
 * @type {import('express').RequestHandler}
 */
async function getAllReservations(req, res) {
  if (isNaN(req.params.id)) {
    return res.status(400).json({ message: 'Le numéro de catway doit être un nombre' });
  }
  // On vérifie d'abord que le catway existe
  if (!(await Catway.exists({ catwayNumber: req.params.id }))) {
    return res.status(404).json({ message: 'Catway introuvable' });
  }
  const reservations = await Reservation.find({ catwayNumber: req.params.id }).sort({ startDate: 1 });
  res.json(reservations);
}

/**
 * Renvoie une réservation d'un catway (GET /catways/:id/reservations/:idReservation).
 * @type {import('express').RequestHandler}
 */
async function getReservation(req, res) {
  if (isNaN(req.params.id)) {
    return res.status(400).json({ message: 'Le numéro de catway doit être un nombre' });
  }
  // _id n'est pas toujours valide (ex : "abc") : Mongoose lèverait alors une erreur
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
 * Vérifie qu'aucune autre réservation n'occupe le catway sur la période demandée.
 * Deux périodes se chevauchent si l'une commence avant la fin de l'autre
 * ET se termine après le début de l'autre.
 * @param {number} catwayNumber Numéro du catway
 * @param {Date} startDate Début de la période demandée
 * @param {Date} endDate Fin de la période demandée
 * @param {string} [ignoreId] Réservation à ignorer (utile pour une modification)
 * @returns {Promise<boolean>} true si le catway est libre
 */
async function isFree(catwayNumber, startDate, endDate, ignoreId) {
  const filter = {
    catwayNumber,
    startDate: { $lt: endDate },
    endDate: { $gt: startDate }
  };
  if (ignoreId) {
    filter._id = { $ne: ignoreId }; // on ne compare pas la réservation avec elle-même
  }
  const count = await Reservation.countDocuments(filter);
  return count === 0;
}

/**
 * Crée une réservation pour un catway (POST /catways/:id/reservations).
 * @type {import('express').RequestHandler}
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
      catwayNumber: req.params.id, // le numéro vient de l'URL, pas du corps
      clientName, boatName, startDate, endDate
    });
    await reservation.validate(); // vérifie les champs et les dates
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
 * @type {import('express').RequestHandler}
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
    // On remplace les champs modifiables (le catway ne change pas)
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
 * @type {import('express').RequestHandler}
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
 * Vérifie qu'un texte a la forme d'un identifiant MongoDB (24 caractères hexadécimaux).
 * @param {string} id
 * @returns {boolean}
 */
function mongooseIdIsValid(id) {
  return /^[0-9a-fA-F]{24}$/.test(id);
}

module.exports = {
  getAllReservations, getReservation, createReservation, updateReservation, deleteReservation
};
