const User = require('../models/user');
const { isBrowser, fail } = require('../utils/helpers');

/**
 * Liste les utilisateurs (GET /users).
 */
async function getAllUsers(req, res) {
  const users = await User.find().sort({ username: 1 });
  if (isBrowser(req)) {
    return res.render('users/index', { title: 'Utilisateurs', users });
  }
  res.json(users);
}

/**
 * Renvoie un utilisateur grâce à son email (GET /users/:email).
 */
async function getUser(req, res) {
  const found = await User.findOne({ email: req.params.email.toLowerCase() });
  if (!found) {
    return fail(req, res, 404, 'Utilisateur introuvable', '/users');
  }
  if (isBrowser(req)) {
    return res.render('users/show', { title: found.username, userDetail: found });
  }
  res.json(found);
}

/**
 * Affiche le formulaire de création (GET /users/new).
 */
function showNewForm(req, res) {
  res.render('users/new', { title: 'Nouvel utilisateur' });
}

/**
 * Affiche le formulaire de modification (GET /users/:email/edit).
 */
async function showEditForm(req, res) {
  const found = await User.findOne({ email: req.params.email.toLowerCase() });
  if (!found) {
    return fail(req, res, 404, 'Utilisateur introuvable', '/users');
  }
  res.render('users/edit', { title: `Modifier ${found.username}`, userDetail: found });
}

/**
 * Crée un utilisateur (POST /users).
 */
async function createUser(req, res) {
  try {
    const { username, email, password } = req.body;
    const created = await User.create({ username, email, password });
    if (isBrowser(req)) {
      req.session.message = { type: 'success', text: 'Utilisateur créé' };
      return res.redirect('/users');
    }
    res.status(201).json(created);
  } catch (err) {
    const text = err.code === 11000 ? 'Cet email est déjà utilisé' : err.message;
    fail(req, res, 400, text, '/users/new');
  }
}

/**
 * Modifie un utilisateur (PUT /users/:email).
 */
async function updateUser(req, res) {
  const found = await User.findOne({ email: req.params.email.toLowerCase() });
  if (!found) {
    return fail(req, res, 404, 'Utilisateur introuvable', '/users');
  }
  try {
    const { username, email, password } = req.body;
    if (username) found.username = username;
    if (email) found.email = email;
    if (password) found.password = password;
    await found.save();

    if (req.session.user.email === req.params.email.toLowerCase()) {
      req.session.user = { username: found.username, email: found.email };
    }
    if (isBrowser(req)) {
      req.session.message = { type: 'success', text: 'Utilisateur modifié' };
      return res.redirect('/users');
    }
    res.json(found);
  } catch (err) {
    const text = err.code === 11000 ? 'Cet email est déjà utilisé' : err.message;
    fail(req, res, 400, text, `/users/${encodeURIComponent(req.params.email)}/edit`);
  }
}

/**
 * Supprime un utilisateur (DELETE /users/:email).
 */
async function deleteUser(req, res) {
  const email = req.params.email.toLowerCase();
  if (req.session.user.email === email) {
    return fail(req, res, 400, 'Vous ne pouvez pas supprimer votre propre compte', '/users');
  }
  const deleted = await User.findOneAndDelete({ email });
  if (!deleted) {
    return fail(req, res, 404, 'Utilisateur introuvable', '/users');
  }
  if (isBrowser(req)) {
    req.session.message = { type: 'success', text: 'Utilisateur supprimé' };
    return res.redirect('/users');
  }
  res.json({ message: 'Utilisateur supprimé' });
}

module.exports = {
  getAllUsers, getUser, showNewForm, showEditForm, createUser, updateUser, deleteUser
};
