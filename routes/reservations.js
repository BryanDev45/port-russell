const router = require('express').Router();
const {
  getAllReservations, getReservation, createReservation, updateReservation, deleteReservation
} = require('../controllers/reservationsController');

router.get('/:id/reservations', getAllReservations);
router.get('/:id/reservations/:idReservation', getReservation);
router.post('/:id/reservations', createReservation);
router.put('/:id/reservations/:idReservation', updateReservation);
router.delete('/:id/reservations/:idReservation', deleteReservation);

module.exports = router;
