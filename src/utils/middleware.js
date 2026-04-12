import { JWTManager } from './jwt.js';
import { AuthError, ForbiddenError } from './errors.js';

/**
 * Middleware d'authentification utilisateur
 */
export const createAuthMiddleware = (jwtManager) => {
  return (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;
      const token = jwtManager.extractTokenFromHeader(authHeader);

      if (!token) {
        throw new AuthError('Token manquant');
      }

      const decoded = jwtManager.verifyToken(token);
      req.user = {
        id: decoded.userId,
        email: decoded.email,
        role: decoded.role,
      };

      next();
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Middleware de gestion des erreurs asynchrones
 */
export const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * Middleware de CORS
 */
export const createCorsMiddleware = (origins = ['http://localhost:3000']) => {
  return (req, res, next) => {
    const origin = req.headers.origin;

    if (origins.includes(origin)) {
      res.setHeader('Access-Control-Allow-Origin', origin);
    }

    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');

    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }

    next();
  };
};

/**
 * Middleware de logging
 */
export const loggingMiddleware = (req, res, next) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} - ${res.statusCode} - ${duration}ms`);
  });

  next();
};
