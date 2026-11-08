const Catway = require('../models/catway');
const Reservation = require('../models/reservation');
const { isBrowser, fail } = require('../utils/helpers');

/**
 * Liste toutes les réservations (GET /reservations).
 */
async function getEveryReservation(req, res) {
  const reservations = await Reservation.find().sort({ startDate: -1 });
  if (isBrowser(req)) {
    return res.render('reservations/index', { title: 'Réservations', reservations, catwayNumber: null });
  }
  res.json(reservations);
}

/**
 * Liste les réservations d'un catway (GET /catways/:id/reservations).
 */
async function getAllReservations(req, res) {
  if (isNaN(req.params.id)) {
    return fail(req, res, 400, 'Le numéro de catway doit être un nombre', '/catways');
  }
  if (!(await Catway.exists({ catwayNumber: req.params.id }))) {
    return fail(req, res, 404, 'Catway introuvable', '/catways');
  }
  const reservations = await Reservation.find({ catwayNumber: req.params.id }).sort({ startDate: 1 });
  if (isBrowser(req)) {
    return res.render('reservations/index', {
      title: `Réservations du catway ${req.params.id}`,
      reservations,
      catwayNumber: req.params.id
    });
  }
  res.json(reservations);
}

/**
 * Renvoie une réservation d'un catway (GET /catways/:id/reservations/:idReservation).
 */
async function getReservation(req, res) {
  const reservation = await findReservation(req);
  if (reservation === 'catway-invalide') {
    return fail(req, res, 400, 'Le numéro de catway doit être un nombre', '/reservations');
  }
  if (reservation === 'id-invalide') {
    return fail(req, res, 400, 'Identifiant de réservation invalide', '/reservations');
  }
  if (!reservation) {
    return fail(req, res, 404, 'Réservation introuvable', '/reservations');
  }
  if (isBrowser(req)) {
    return res.render('reservations/show', { title: 'Détails de la réservation', reservation });
  }
  res.json(reservation);
}

/**
 * Affiche le formulaire de création (GET /reservations/new ou /catways/:id/reservations/new).
 */
async function showNewForm(req, res) {
  const catways = await Catway.find().sort({ catwayNumber: 1 });
  res.render('reservations/new', {
    title: 'Nouvelle réservation',
    catways,
    selected: req.params.id || ''
  });
}

/**
 * Affiche le formulaire de modification (GET /catways/:id/reservations/:idReservation/edit).
 */
async function showEditForm(req, res) {
  const reservation = await findReservation(req);
  if (!reservation || typeof reservation === 'string') {
    return fail(req, res, 404, 'Réservation introuvable', '/reservations');
  }
  res.render('reservations/edit', { title: 'Modifier la réservation', reservation });
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
  const newFormUrl = `/catways/${req.params.id}/reservations/new`;
  if (isNaN(req.params.id)) {
    return fail(req, res, 400, 'Le numéro de catway doit être un nombre', '/reservations/new');
  }
  if (!(await Catway.exists({ catwayNumber: req.params.id }))) {
    return fail(req, res, 404, 'Catway introuvable', '/reservations/new');
  }
  try {
    const { clientName, boatName, startDate, endDate } = req.body;
    const reservation = new Reservation({
      catwayNumber: req.params.id,
      clientName, boatName, startDate, endDate
    });
    await reservation.validate();
    if (!(await isFree(reservation.catwayNumber, reservation.startDate, reservation.endDate))) {
      return fail(req, res, 400, 'Ce catway est déjà réservé sur cette période', newFormUrl);
    }
    await reservation.save();
    if (isBrowser(req)) {
      req.session.message = { type: 'success', text: 'Réservation créée' };
      return res.redirect('/reservations');
    }
    res.status(201).json(reservation);
  } catch (err) {
    fail(req, res, 400, err.message, newFormUrl);
  }
}

/**
 * Modifie une réservation (PUT /catways/:id/reservations/:idReservation).
 */
async function updateReservation(req, res) {
  const reservation = await findReservation(req);
  if (reservation === 'catway-invalide') {
    return fail(req, res, 400, 'Le numéro de catway doit être un nombre', '/reservations');
  }
  if (reservation === 'id-invalide') {
    return fail(req, res, 400, 'Identifiant de réservation invalide', '/reservations');
  }
  if (!reservation) {
    return fail(req, res, 404, 'Réservation introuvable', '/reservations');
  }
  const editUrl = `/catways/${req.params.id}/reservations/${req.params.idReservation}/edit`;
  try {
    const { clientName, boatName, startDate, endDate } = req.body;
    reservation.set({ clientName, boatName, startDate, endDate });
    await reservation.validate();
    if (!(await isFree(reservation.catwayNumber, reservation.startDate, reservation.endDate, reservation._id))) {
      return fail(req, res, 400, 'Ce catway est déjà réservé sur cette période', editUrl);
    }
    await reservation.save();
    if (isBrowser(req)) {
      req.session.message = { type: 'success', text: 'Réservation modifiée' };
      return res.redirect('/reservations');
    }
    res.json(reservation);
  } catch (err) {
    fail(req, res, 400, err.message, editUrl);
  }
}

/**
 * Supprime une réservation (DELETE /catways/:id/reservations/:idReservation).
 */
async function deleteReservation(req, res) {
  const reservation = await findReservation(req);
  if (reservation === 'catway-invalide') {
    return fail(req, res, 400, 'Le numéro de catway doit être un nombre', '/reservations');
  }
  if (reservation === 'id-invalide') {
    return fail(req, res, 400, 'Identifiant de réservation invalide', '/reservations');
  }
  if (!reservation) {
    return fail(req, res, 404, 'Réservation introuvable', '/reservations');
  }
  await reservation.deleteOne();
  if (isBrowser(req)) {
    req.session.message = { type: 'success', text: 'Réservation supprimée' };
    return res.redirect('/reservations');
  }
  res.json({ message: 'Réservation supprimée' });
}

/**
 * Cherche la réservation désignée par l'URL.
 * @param {import('express').Request} req
 * @returns {Promise<Object|null|string>} la réservation, null si absente,
 * ou 'catway-invalide' / 'id-invalide' si l'URL est incorrecte
 */
async function findReservation(req) {
  if (isNaN(req.params.id)) {
    return 'catway-invalide';
  }
  if (!/^[0-9a-fA-F]{24}$/.test(req.params.idReservation)) {
    return 'id-invalide';
  }
  return Reservation.findOne({
    _id: req.params.idReservation,
    catwayNumber: req.params.id
  });
}

module.exports = {
  getEveryReservation, getAllReservations, getReservation, showNewForm, showEditForm,
  createReservation, updateReservation, deleteReservation
};
