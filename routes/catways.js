const router = require('express').Router();
const {
  getAllCatways, getCatway, createCatway, updateCatway, deleteCatway
} = require('../controllers/catwaysController');

router.get('/', getAllCatways);
router.get('/:id', getCatway);
router.post('/', createCatway);
router.put('/:id', updateCatway);
router.delete('/:id', deleteCatway);

module.exports = router;
