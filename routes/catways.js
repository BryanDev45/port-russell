const router = require('express').Router();
const {
  getAllCatways, getCatway, showNewForm, showEditForm, createCatway, updateCatway, deleteCatway
} = require('../controllers/catwaysController');

/**
 * @swagger
 * /catways:
 *   get:
 *     summary: Liste tous les catways
 *     tags: [Catways]
 *     responses:
 *       200:
 *         description: Tableau de catways
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/Catway' }
 *       401: { description: Non connecté }
 *   post:
 *     summary: Crée un catway
 *     tags: [Catways]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/Catway' }
 *     responses:
 *       201: { description: Catway créé }
 *       400: { description: Données invalides ou numéro déjà utilisé }
 *       401: { description: Non connecté }
 */
router.get('/', getAllCatways);
router.post('/', createCatway);
router.get('/new', showNewForm);

/**
 * @swagger
 * /catways/{id}:
 *   get:
 *     summary: Détails d'un catway
 *     tags: [Catways]
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: integer }, description: Numéro du catway }
 *     responses:
 *       200:
 *         description: Le catway
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Catway' }
 *       404: { description: Catway introuvable }
 *   put:
 *     summary: Modifie l'état d'un catway (le numéro et le type ne sont pas modifiables)
 *     tags: [Catways]
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: integer }, description: Numéro du catway }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               catwayState: { type: string, example: à réparer }
 *     responses:
 *       200: { description: Catway modifié }
 *       404: { description: Catway introuvable }
 *   delete:
 *     summary: Supprime un catway
 *     tags: [Catways]
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: integer }, description: Numéro du catway }
 *     responses:
 *       200: { description: Catway supprimé }
 *       404: { description: Catway introuvable }
 */
router.get('/:id', getCatway);
router.get('/:id/edit', showEditForm);
router.put('/:id', updateCatway);
router.delete('/:id', deleteCatway);

module.exports = router;
