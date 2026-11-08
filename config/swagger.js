const swaggerJsdoc = require('swagger-jsdoc');

/**
 * Documentation OpenAPI de l'API, générée à partir des commentaires @swagger
 * écrits dans les fichiers du dossier routes/. Affichée sur /api-docs.
 */
const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API du port de plaisance Russell',
      version: '1.0.0',
      description: "API privée de la capitainerie. Il faut d'abord se connecter avec POST /login : la session est ensuite conservée dans un cookie."
    },
    components: {
      schemas: {
        Catway: {
          type: 'object',
          required: ['catwayNumber', 'catwayType', 'catwayState'],
          properties: {
            catwayNumber: { type: 'integer', example: 30 },
            catwayType: { type: 'string', enum: ['long', 'short'] },
            catwayState: { type: 'string', example: 'bon état' }
          }
        },
        Reservation: {
          type: 'object',
          required: ['clientName', 'boatName', 'startDate', 'endDate'],
          properties: {
            clientName: { type: 'string', example: 'Thomas Martin' },
            boatName: { type: 'string', example: 'Carolina' },
            startDate: { type: 'string', format: 'date', example: '2030-06-01' },
            endDate: { type: 'string', format: 'date', example: '2030-06-15' }
          }
        },
        User: {
          type: 'object',
          required: ['username', 'email', 'password'],
          properties: {
            username: { type: 'string', example: 'capitaine' },
            email: { type: 'string', example: 'capitaine@port-russell.fr' },
            password: { type: 'string', example: 'motdepasse' }
          }
        },
        Error: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Catway introuvable' }
          }
        }
      }
    }
  },
  apis: ['./routes/*.js']
});

module.exports = swaggerSpec;
