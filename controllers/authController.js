const User = require('../models/user');

/**
 * Connecte un utilisateur (POST /login).
 */
async function login(req, res) {
  const email = String(req.body.email || '').toLowerCase().trim();
  const password = String(req.body.password || '');

  const user = await User.findOne({ email });
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
  }

  req.session.user = { username: user.username, email: user.email };
  res.json({ message: 'Connecté', user: req.session.user });
}

/**
 * Déconnecte l'utilisateur (GET /logout).
 */
function logout(req, res) {
  req.session.destroy(() => {
    res.json({ message: 'Déconnecté' });
  });
}

module.exports = { login, logout };
