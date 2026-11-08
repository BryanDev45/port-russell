/**
 * Indique si la requête vient d'un navigateur (qui attend une page HTML)
 * plutôt que d'un client d'API comme Postman (qui attend du JSON).
 * @param {import('express').Request} req
 * @returns {boolean}
 */
function isBrowser(req) {
  return req.accepts(['json', 'html']) === 'html';
}

/**
 * Réponse en cas d'erreur : message + redirection pour un navigateur, JSON pour l'API.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {number} status Code HTTP pour l'API
 * @param {string} text Message d'erreur
 * @param {string} redirectUrl Page vers laquelle renvoyer le navigateur
 */
function fail(req, res, status, text, redirectUrl) {
  if (isBrowser(req)) {
    req.session.message = { type: 'error', text };
    return res.redirect(redirectUrl);
  }
  res.status(status).json({ message: text });
}

module.exports = { isBrowser, fail };
