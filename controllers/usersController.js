const User = require('../models/user');

/**
 * Liste les utilisateurs (GET /users).
 */
async function getAllUsers(req, res) {
  const users = await User.find().sort({ username: 1 });
  res.json(users);
}

/**
 * Renvoie un utilisateur grâce à son email (GET /users/:email).
 */
async function getUser(req, res) {
  const user = await User.findOne({ email: req.params.email.toLowerCase() });
  if (!user) {
    return res.status(404).json({ message: 'Utilisateur introuvable' });
  }
  res.json(user);
}

/**
 * Crée un utilisateur (POST /users).
 */
async function createUser(req, res) {
  try {
    const { username, email, password } = req.body;
    const user = await User.create({ username, email, password });
    res.status(201).json(user);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: 'Cet email est déjà utilisé' });
    }
    res.status(400).json({ message: err.message });
  }
}

/**
 * Modifie un utilisateur (PUT /users/:email).
 */
async function updateUser(req, res) {
  const user = await User.findOne({ email: req.params.email.toLowerCase() });
  if (!user) {
    return res.status(404).json({ message: 'Utilisateur introuvable' });
  }
  try {
    const { username, email, password } = req.body;
    if (username) user.username = username;
    if (email) user.email = email;
    if (password) user.password = password;
    await user.save();
    res.json(user);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: 'Cet email est déjà utilisé' });
    }
    res.status(400).json({ message: err.message });
  }
}

/**
 * Supprime un utilisateur (DELETE /users/:email).
 */
async function deleteUser(req, res) {
  const user = await User.findOneAndDelete({ email: req.params.email.toLowerCase() });
  if (!user) {
    return res.status(404).json({ message: 'Utilisateur introuvable' });
  }
  res.json({ message: 'Utilisateur supprimé' });
}

module.exports = { getAllUsers, getUser, createUser, updateUser, deleteUser };
