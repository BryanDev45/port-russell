/**
 * Laisse passer uniquement les utilisateurs connectés.
 */
function isAuthenticated(req, res, next) {
  if (req.session.user) {
    return next();
  }
  res.status(401).json({ message: 'Vous devez être connecté' });
}

module.exports = { isAuthenticated };
