const router = require('express').Router();
const {
  getAllUsers, getUser, showNewForm, showEditForm, createUser, updateUser, deleteUser
} = require('../controllers/usersController');

router.get('/', getAllUsers);
router.get('/new', showNewForm);
router.get('/:email', getUser);
router.get('/:email/edit', showEditForm);
router.post('/', createUser);
router.put('/:email', updateUser);
router.delete('/:email', deleteUser);

module.exports = router;
