const router = require('express').Router();
const {
  getAllCatways, getCatway, createCatway, updateCatway, deleteCatway
} = require('../controllers/catwaysController');

// GET /catways : liste des catways
router.get('/', getAllCatways);

// GET /catways/:id : détails d'un catway (id = numéro du catway)
router.get('/:id', getCatway);

// POST /catways : création d'un catway
router.post('/', createCatway);

// PUT /catways/:id : modification de l'état d'un catway
router.put('/:id', updateCatway);

// DELETE /catways/:id : suppression d'un catway
router.delete('/:id', deleteCatway);

module.exports = router;
