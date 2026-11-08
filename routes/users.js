const router = require('express').Router();
const {
  getAllUsers, getUser, showNewForm, showEditForm, createUser, updateUser, deleteUser
} = require('../controllers/usersController');

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Liste les utilisateurs (sans leur mot de passe)
 *     tags: [Utilisateurs]
 *     responses:
 *       200: { description: Tableau d'utilisateurs }
 *       401: { description: Non connecté }
 *   post:
 *     summary: Crée un utilisateur
 *     tags: [Utilisateurs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/User' }
 *     responses:
 *       201: { description: Utilisateur créé }
 *       400: { description: Données invalides ou email déjà utilisé }
 */
router.get('/', getAllUsers);
router.post('/', createUser);
router.get('/new', showNewForm);

/**
 * @swagger
 * /users/{email}:
 *   get:
 *     summary: Détails d'un utilisateur
 *     tags: [Utilisateurs]
 *     parameters:
 *       - { in: path, name: email, required: true, schema: { type: string }, description: Email de l'utilisateur }
 *     responses:
 *       200: { description: L'utilisateur }
 *       404: { description: Utilisateur introuvable }
 *   put:
 *     summary: Modifie un utilisateur (seuls les champs envoyés changent)
 *     tags: [Utilisateurs]
 *     parameters:
 *       - { in: path, name: email, required: true, schema: { type: string }, description: Email de l'utilisateur }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/User' }
 *     responses:
 *       200: { description: Utilisateur modifié }
 *       400: { description: Données invalides ou email déjà utilisé }
 *       404: { description: Utilisateur introuvable }
 *   delete:
 *     summary: Supprime un utilisateur (pas son propre compte)
 *     tags: [Utilisateurs]
 *     parameters:
 *       - { in: path, name: email, required: true, schema: { type: string }, description: Email de l'utilisateur }
 *     responses:
 *       200: { description: Utilisateur supprimé }
 *       400: { description: Suppression de son propre compte refusée }
 *       404: { description: Utilisateur introuvable }
 */
router.get('/:email', getUser);
router.get('/:email/edit', showEditForm);
router.put('/:email', updateUser);
router.delete('/:email', deleteUser);

module.exports = router;
