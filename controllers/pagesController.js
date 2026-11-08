const Reservation = require('../models/reservation');

/**
 * Affiche la page d'accueil (GET /).
 */
function showHome(req, res) {
  if (req.session.user) {
    return res.redirect('/dashboard');
  }
  res.render('index', { title: 'Accueil', error: null });
}

/**
 * Affiche le tableau de bord avec les réservations en cours (GET /dashboard).
 */
async function showDashboard(req, res) {
  const now = new Date();
  const reservations = await Reservation.find({
    startDate: { $lte: now },
    endDate: { $gte: now }
  }).sort({ catwayNumber: 1 });

  res.render('dashboard', { title: 'Tableau de bord', reservations, today: now });
}

module.exports = { showHome, showDashboard };
