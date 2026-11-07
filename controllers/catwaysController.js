const Catway = require('../models/catway');

/**
 * Liste tous les catways (GET /catways).
 */
async function getAllCatways(req, res) {
  const catways = await Catway.find().sort({ catwayNumber: 1 });
  res.json(catways);
}

/**
 * Renvoie un catway grâce à son numéro (GET /catways/:id).
 */
async function getCatway(req, res) {
  if (isNaN(req.params.id)) {
    return res.status(400).json({ message: 'Le numéro de catway doit être un nombre' });
  }
  const catway = await Catway.findOne({ catwayNumber: req.params.id });
  if (!catway) {
    return res.status(404).json({ message: 'Catway introuvable' });
  }
  res.json(catway);
}

/**
 * Crée un catway (POST /catways).
 */
async function createCatway(req, res) {
  try {
    const { catwayNumber, catwayType, catwayState } = req.body;
    const catway = await Catway.create({ catwayNumber, catwayType, catwayState });
    res.status(201).json(catway);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: 'Ce numéro de catway existe déjà' });
    }
    res.status(400).json({ message: err.message });
  }
}

/**
 * Modifie l'état d'un catway (PUT /catways/:id).
 */
async function updateCatway(req, res) {
  if (isNaN(req.params.id)) {
    return res.status(400).json({ message: 'Le numéro de catway doit être un nombre' });
  }
  try {
    const catway = await Catway.findOneAndUpdate(
      { catwayNumber: req.params.id },
      { catwayState: req.body.catwayState },
      { new: true, runValidators: true }
    );
    if (!catway) {
      return res.status(404).json({ message: 'Catway introuvable' });
    }
    res.json(catway);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

/**
 * Supprime un catway (DELETE /catways/:id).
 */
async function deleteCatway(req, res) {
  if (isNaN(req.params.id)) {
    return res.status(400).json({ message: 'Le numéro de catway doit être un nombre' });
  }
  const catway = await Catway.findOneAndDelete({ catwayNumber: req.params.id });
  if (!catway) {
    return res.status(404).json({ message: 'Catway introuvable' });
  }
  res.json({ message: 'Catway supprimé' });
}

module.exports = { getAllCatways, getCatway, createCatway, updateCatway, deleteCatway };
