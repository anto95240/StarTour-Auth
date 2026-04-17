import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'StarTour — Auth Service',
      version: '1.0.0',
      description: 'Service d\'authentification JWT pour la plateforme StarTour. Gère l\'inscription, la connexion et la gestion du profil utilisateur.',
    },
    servers: [{ url: 'http://localhost:3001', description: 'Local' }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Token JWT obtenu via /api/auth/login',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id:        { type: 'string', format: 'uuid' },
            firstName: { type: 'string', example: 'Han' },
            lastName:  { type: 'string', example: 'Solo' },
            username:  { type: 'string', example: 'hansolo' },
            email:     { type: 'string', format: 'email', example: 'han@falcon.com' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Error: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            error: {
              type: 'object',
              properties: {
                status:  { type: 'integer' },
                message: { type: 'string' },
              },
            },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.js'],
};

export const swaggerSpec = swaggerJsdoc(options);
