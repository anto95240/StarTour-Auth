/**
 * Classe d'erreur personnalisée pour l'API
 */
export class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Erreur de validation
 */
export class ValidationError extends AppError {
  constructor(message, details = null) {
    super(message, 400);
    this.details = details;
  }
}

/**
 * Erreur d'authentification
 */
export class AuthError extends AppError {
  constructor(message = 'Non authentifié') {
    super(message, 401);
  }
}

/**
 * Alias pour AuthenticationError
 */
export class AuthenticationError extends AppError {
  constructor(message = 'Non authentifié') {
    super(message, 401);
  }
}

/**
 * Erreur de conflit (ressource existe déjà)
 */
export class ConflictError extends AppError {
  constructor(message = 'Ressource déjà existante') {
    super(message, 409);
  }
}

/**
 * Erreur d'autorisation
 */
export class ForbiddenError extends AppError {
  constructor(message = 'Accès refusé') {
    super(message, 403);
  }
}

/**
 * Erreur ressource non trouvée
 */
export class NotFoundError extends AppError {
  constructor(resource = 'Ressource') {
    super(`${resource} non trouvée`, 404);
  }
}

/**
 * Erreur serveur
 */
export class InternalServerError extends AppError {
  constructor(message = 'Erreur serveur interne') {
    super(message, 500);
  }
}

/**
 * Gestionnaire d'erreurs global
 */
export const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || 'Erreur serveur';

  // Erreurs Joi
  if (err.isJoi) {
    const details = err.details.map(d => ({
      field: d.path.join('.'),
      message: d.message,
    }));
    return res.status(400).json({
      success: false,
      error: {
        status: 400,
        message: 'Validation échouée',
        details,
      },
    });
  }

  // Erreurs de validation personnalisées
  if (err instanceof ValidationError) {
    return res.status(err.statusCode).json({
      success: false,
      error: {
        status: err.statusCode,
        message: err.message,
        details: err.details,
      },
    });
  }

  // Erreurs opérationnelles
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      success: false,
      error: {
        status: err.statusCode,
        message: err.message,
      },
    });
  }

  // Erreurs non opérationnelles
  console.error('ERREUR NON GÉRÉE:', err);
  return res.status(500).json({
    success: false,
    error: {
      status: 500,
      message: 'Erreur serveur interne',
    },
  });
};
