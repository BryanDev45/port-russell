const router = require('express').Router();
const {
  getAllCatways, getCatway, showNewForm, showEditForm, createCatway, updateCatway, deleteCatway
} = require('../controllers/catwaysController');

router.get('/', getAllCatways);
router.get('/new', showNewForm);
router.get('/:id', getCatway);
router.get('/:id/edit', showEditForm);
router.post('/', createCatway);
router.put('/:id', updateCatway);
router.delete('/:id', deleteCatway);

module.exports = router;
