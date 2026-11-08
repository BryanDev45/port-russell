const User = require('../models/user');
const { isBrowser } = require('../utils/helpers');

/**
 * Connecte un utilisateur (POST /login).
 */
async function login(req, res) {
  const email = String(req.body.email || '').toLowerCase().trim();
  const password = String(req.body.password || '');

  const user = await User.findOne({ email });
  if (!user || !(await user.comparePassword(password))) {
    if (isBrowser(req)) {
      return res.status(401).render('index', { title: 'Accueil', error: 'Email ou mot de passe incorrect' });
    }
    return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
  }

  req.session.user = { username: user.username, email: user.email };
  if (isBrowser(req)) {
    return res.redirect('/dashboard');
  }
  res.json({ message: 'Connecté', user: req.session.user });
}

/**
 * Déconnecte l'utilisateur (GET /logout).
 */
function logout(req, res) {
  req.session.destroy(() => {
    if (isBrowser(req)) {
      return res.redirect('/');
    }
    res.json({ message: 'Déconnecté' });
  });
}

module.exports = { login, logout };
