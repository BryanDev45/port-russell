const router = require('express').Router();
const {
  getAllUsers, getUser, createUser, updateUser, deleteUser
} = require('../controllers/usersController');

// GET /users : liste des utilisateurs
router.get('/', getAllUsers);

// GET /users/:email : détails d'un utilisateur
router.get('/:email', getUser);

// POST /users : création d'un utilisateur
router.post('/', createUser);

// PUT /users/:email : modification d'un utilisateur
router.put('/:email', updateUser);

// DELETE /users/:email : suppression d'un utilisateur
router.delete('/:email', deleteUser);

module.exports = router;
