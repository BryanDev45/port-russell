const router = require('express').Router();
const {
  getAllReservations, getReservation, showNewForm, showEditForm,
  createReservation, updateReservation, deleteReservation
} = require('../controllers/reservationsController');

/**
 * @swagger
 * /catways/{id}/reservations:
 *   get:
 *     summary: Liste les réservations d'un catway
 *     tags: [Réservations]
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: integer }, description: Numéro du catway }
 *     responses:
 *       200:
 *         description: Tableau de réservations
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/Reservation' }
 *       404: { description: Catway introuvable }
 *   post:
 *     summary: Crée une réservation pour un catway
 *     tags: [Réservations]
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: integer }, description: Numéro du catway }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/Reservation' }
 *     responses:
 *       201: { description: Réservation créée }
 *       400: { description: Données invalides ou catway déjà réservé sur la période }
 *       404: { description: Catway introuvable }
 */
router.get('/:id/reservations', getAllReservations);
router.post('/:id/reservations', createReservation);
router.get('/:id/reservations/new', showNewForm);

/**
 * @swagger
 * /catways/{id}/reservations/{idReservation}:
 *   get:
 *     summary: Détails d'une réservation
 *     tags: [Réservations]
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: integer }, description: Numéro du catway }
 *       - { in: path, name: idReservation, required: true, schema: { type: string }, description: Identifiant de la réservation }
 *     responses:
 *       200:
 *         description: La réservation
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Reservation' }
 *       404: { description: Réservation introuvable }
 *   put:
 *     summary: Modifie une réservation
 *     tags: [Réservations]
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: integer }, description: Numéro du catway }
 *       - { in: path, name: idReservation, required: true, schema: { type: string }, description: Identifiant de la réservation }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/Reservation' }
 *     responses:
 *       200: { description: Réservation modifiée }
 *       400: { description: Données invalides ou catway déjà réservé sur la période }
 *       404: { description: Réservation introuvable }
 *   delete:
 *     summary: Supprime une réservation
 *     tags: [Réservations]
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: integer }, description: Numéro du catway }
 *       - { in: path, name: idReservation, required: true, schema: { type: string }, description: Identifiant de la réservation }
 *     responses:
 *       200: { description: Réservation supprimée }
 *       404: { description: Réservation introuvable }
 */
router.get('/:id/reservations/:idReservation', getReservation);
router.get('/:id/reservations/:idReservation/edit', showEditForm);
router.put('/:id/reservations/:idReservation', updateReservation);
router.delete('/:id/reservations/:idReservation', deleteReservation);

module.exports = router;
