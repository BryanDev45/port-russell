const Catway = require('../models/catway');

/**
 * Renvoie la liste de tous les catways (GET /catways).
 * @type {import('express').RequestHandler}
 */
async function getAllCatways(req, res) {
  const catways = await Catway.find().sort({ catwayNumber: 1 });
  res.json(catways);
}

/**
 * Renvoie un catway grâce à son numéro (GET /catways/:id).
 * @type {import('express').RequestHandler}
 */
async function getCatway(req, res) {
  // Le numéro doit être un nombre, sinon MongoDB renvoie une erreur
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
 * @type {import('express').RequestHandler}
 */
async function createCatway(req, res) {
  try {
    const { catwayNumber, catwayType, catwayState } = req.body;
    const catway = await Catway.create({ catwayNumber, catwayType, catwayState });
    res.status(201).json(catway);
  } catch (err) {
    // 11000 = numéro déjà utilisé (champ unique)
    if (err.code === 11000) {
      return res.status(400).json({ message: 'Ce numéro de catway existe déjà' });
    }
    res.status(400).json({ message: err.message });
  }
}

/**
 * Modifie l'état d'un catway (PUT /catways/:id).
 * Le numéro et le type ne sont pas modifiables : seul catwayState est lu.
 * @type {import('express').RequestHandler}
 */
async function updateCatway(req, res) {
  if (isNaN(req.params.id)) {
    return res.status(400).json({ message: 'Le numéro de catway doit être un nombre' });
  }
  try {
    const catway = await Catway.findOneAndUpdate(
      { catwayNumber: req.params.id },
      { catwayState: req.body.catwayState },
      { new: true, runValidators: true } // new : renvoie la version modifiée
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
 * @type {import('express').RequestHandler}
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
