const router = require('express').Router();
const {
  getAllUsers, getUser, createUser, updateUser, deleteUser
} = require('../controllers/usersController');

router.get('/', getAllUsers);
router.get('/:email', getUser);
router.post('/', createUser);
router.put('/:email', updateUser);
router.delete('/:email', deleteUser);

module.exports = router;
