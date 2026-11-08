const Catway = require('../models/catway');
const { isBrowser, fail } = require('../utils/helpers');

/**
 * Liste tous les catways (GET /catways).
 */
async function getAllCatways(req, res) {
  const catways = await Catway.find().sort({ catwayNumber: 1 });
  if (isBrowser(req)) {
    return res.render('catways/index', { title: 'Catways', catways });
  }
  res.json(catways);
}

/**
 * Renvoie un catway grâce à son numéro (GET /catways/:id).
 */
async function getCatway(req, res) {
  if (isNaN(req.params.id)) {
    return fail(req, res, 400, 'Le numéro de catway doit être un nombre', '/catways');
  }
  const catway = await Catway.findOne({ catwayNumber: req.params.id });
  if (!catway) {
    return fail(req, res, 404, 'Catway introuvable', '/catways');
  }
  if (isBrowser(req)) {
    return res.render('catways/show', { title: `Catway ${catway.catwayNumber}`, catway });
  }
  res.json(catway);
}

/**
 * Affiche le formulaire de création (GET /catways/new).
 */
function showNewForm(req, res) {
  res.render('catways/new', { title: 'Nouveau catway' });
}

/**
 * Affiche le formulaire de modification (GET /catways/:id/edit).
 */
async function showEditForm(req, res) {
  const catway = isNaN(req.params.id) ? null : await Catway.findOne({ catwayNumber: req.params.id });
  if (!catway) {
    return fail(req, res, 404, 'Catway introuvable', '/catways');
  }
  res.render('catways/edit', { title: `Modifier le catway ${catway.catwayNumber}`, catway });
}

/**
 * Crée un catway (POST /catways).
 */
async function createCatway(req, res) {
  try {
    const { catwayNumber, catwayType, catwayState } = req.body;
    const catway = await Catway.create({ catwayNumber, catwayType, catwayState });
    if (isBrowser(req)) {
      req.session.message = { type: 'success', text: 'Catway créé' };
      return res.redirect('/catways');
    }
    res.status(201).json(catway);
  } catch (err) {
    const text = err.code === 11000 ? 'Ce numéro de catway existe déjà' : err.message;
    fail(req, res, 400, text, '/catways/new');
  }
}

/**
 * Modifie l'état d'un catway (PUT /catways/:id).
 */
async function updateCatway(req, res) {
  if (isNaN(req.params.id)) {
    return fail(req, res, 400, 'Le numéro de catway doit être un nombre', '/catways');
  }
  try {
    const catway = await Catway.findOneAndUpdate(
      { catwayNumber: req.params.id },
      { catwayState: req.body.catwayState },
      { new: true, runValidators: true }
    );
    if (!catway) {
      return fail(req, res, 404, 'Catway introuvable', '/catways');
    }
    if (isBrowser(req)) {
      req.session.message = { type: 'success', text: 'Catway modifié' };
      return res.redirect('/catways');
    }
    res.json(catway);
  } catch (err) {
    fail(req, res, 400, err.message, `/catways/${req.params.id}/edit`);
  }
}

/**
 * Supprime un catway (DELETE /catways/:id).
 */
async function deleteCatway(req, res) {
  if (isNaN(req.params.id)) {
    return fail(req, res, 400, 'Le numéro de catway doit être un nombre', '/catways');
  }
  const catway = await Catway.findOneAndDelete({ catwayNumber: req.params.id });
  if (!catway) {
    return fail(req, res, 404, 'Catway introuvable', '/catways');
  }
  if (isBrowser(req)) {
    req.session.message = { type: 'success', text: 'Catway supprimé' };
    return res.redirect('/catways');
  }
  res.json({ message: 'Catway supprimé' });
}

module.exports = {
  getAllCatways, getCatway, showNewForm, showEditForm, createCatway, updateCatway, deleteCatway
};
