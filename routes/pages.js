const router = require('express').Router();
const { showHome, showDashboard } = require('../controllers/pagesController');
const { getEveryReservation, showNewForm } = require('../controllers/reservationsController');
const { isAuthenticated } = require('../middlewares/auth');

router.get('/', showHome);
router.get('/dashboard', isAuthenticated, showDashboard);

/**
 * @swagger
 * /reservations:
 *   get:
 *     summary: Liste toutes les réservations, tous catways confondus
 *     tags: [Réservations]
 *     responses:
 *       200:
 *         description: Tableau de réservations
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/Reservation' }
 *       401: { description: Non connecté }
 */
router.get('/reservations', isAuthenticated, getEveryReservation);
router.get('/reservations/new', isAuthenticated, showNewForm);

module.exports = router;
