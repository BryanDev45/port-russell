const router = require('express').Router();
const { login, logout } = require('../controllers/authController');

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Connexion d'un utilisateur
 *     tags: [Authentification]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email: { type: string, example: admin@port-russell.fr }
 *               password: { type: string, example: admin123 }
 *     responses:
 *       200: { description: Connecté (un cookie de session est créé) }
 *       401: { description: Email ou mot de passe incorrect }
 */
router.post('/login', login);

/**
 * @swagger
 * /logout:
 *   get:
 *     summary: Déconnexion de l'utilisateur
 *     tags: [Authentification]
 *     responses:
 *       200: { description: Déconnecté }
 */
router.get('/logout', logout);

module.exports = router;
