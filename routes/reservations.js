const router = require('express').Router();
const {
  getAllReservations, getReservation, showNewForm, showEditForm,
  createReservation, updateReservation, deleteReservation
} = require('../controllers/reservationsController');

router.get('/:id/reservations', getAllReservations);
router.get('/:id/reservations/new', showNewForm);
router.get('/:id/reservations/:idReservation', getReservation);
router.get('/:id/reservations/:idReservation/edit', showEditForm);
router.post('/:id/reservations', createReservation);
router.put('/:id/reservations/:idReservation', updateReservation);
router.delete('/:id/reservations/:idReservation', deleteReservation);

module.exports = router;
