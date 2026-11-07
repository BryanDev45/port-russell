const router = require('express').Router();
const {
  getAllReservations, getReservation, createReservation, updateReservation, deleteReservation
} = require('../controllers/reservationsController');

// Ce fichier est monté sur /catways dans app.js :
// les réservations sont une sous-ressource d'un catway.

// GET /catways/:id/reservations : réservations d'un catway
router.get('/:id/reservations', getAllReservations);

// GET /catways/:id/reservations/:idReservation : détails d'une réservation
router.get('/:id/reservations/:idReservation', getReservation);

// POST /catways/:id/reservations : création d'une réservation
router.post('/:id/reservations', createReservation);

// PUT /catways/:id/reservations/:idReservation : modification d'une réservation
router.put('/:id/reservations/:idReservation', updateReservation);

// DELETE /catways/:id/reservations/:idReservation : suppression d'une réservation
router.delete('/:id/reservations/:idReservation', deleteReservation);

module.exports = router;
