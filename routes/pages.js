const router = require('express').Router();
const { showHome, showDashboard } = require('../controllers/pagesController');
const { getEveryReservation, showNewForm } = require('../controllers/reservationsController');
const { isAuthenticated } = require('../middlewares/auth');

router.get('/', showHome);
router.get('/dashboard', isAuthenticated, showDashboard);
router.get('/reservations', isAuthenticated, getEveryReservation);
router.get('/reservations/new', isAuthenticated, showNewForm);

module.exports = router;
