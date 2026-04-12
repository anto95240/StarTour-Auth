import jwt from 'jsonwebtoken';
import { AuthError } from './errors.js';

export class JWTManager {
  constructor(secretKey, expiresIn = '24h') {
    this.secretKey = secretKey;
    this.expiresIn = expiresIn;
  }

  /**
   * Générer un token JWT
   */
  generateToken(payload) {
    try {
      return jwt.sign(payload, this.secretKey, {
        expiresIn: this.expiresIn,
        algorithm: 'HS256',
      });
    } catch (error) {
      throw new Error(`Erreur lors de la génération du token: ${error.message}`);
    }
  }

  /**
   * Générer un refresh token (durée plus longue)
   */
  generateRefreshToken(payload, expiresIn = '7d') {
    try {
      return jwt.sign(payload, this.secretKey, {
        expiresIn,
        algorithm: 'HS256',
      });
    } catch (error) {
      throw new Error(`Erreur lors de la génération du refresh token: ${error.message}`);
    }
  }

  /**
   * Générer un Service Token (pour communication inter-services)
   */
  generateServiceToken(serviceId) {
    try {
      return jwt.sign(
        { service: serviceId, type: 'SERVICE' },
        this.secretKey,
        { expiresIn: '30d', algorithm: 'HS256' },
      );
    } catch (error) {
      throw new Error(`Erreur lors de la génération du service token: ${error.message}`);
    }
  }

  /**
   * Vérifier et décoder un token
   */
  verifyToken(token) {
    try {
      return jwt.verify(token, this.secretKey, { algorithms: ['HS256'] });
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new AuthError('Token expiré');
      }
      if (error.name === 'JsonWebTokenError') {
        throw new AuthError('Token invalide');
      }
      throw new AuthError(`Erreur de vérification token: ${error.message}`);
    }
  }

  /**
   * Extraire le token du header Authorization
   */
  extractTokenFromHeader(authHeader) {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }
    return authHeader.substring(7);
  }

  /**
   * Décoder sans vérifier (pour récupérer les claims)
   */
  decodeToken(token) {
    try {
      return jwt.decode(token);
    } catch (error) {
      return null;
    }
  }
}

// Export d'une fonction utilitaire pour un usage simple
const jwtManager = new JWTManager(process.env.JWT_SECRET || 'your-super-secret-key-change-in-production');

/**
 * Fonction helper pour générer un token JWT
 * @param {object|string} payload - Données à encoder dans le token
 * @param {string} expiresIn - Durée d'expiration (par défaut 24h)
 * @returns {string} - Token JWT
 */
export function generateToken(payload, expiresIn = '24h') {
  try {
    return jwt.sign(payload, process.env.JWT_SECRET || 'your-super-secret-key-change-in-production', {
      expiresIn,
      algorithm: 'HS256',
    });
  } catch (error) {
    throw new Error(`Erreur lors de la génération du token: ${error.message}`);
  }
}

/**
 * Fonction helper pour vérifier un token JWT
 * @param {string} token - Token JWT à vérifier
 * @returns {object} - Données encodées dans le token
 */
export function verifyToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET || 'your-super-secret-key-change-in-production', {
      algorithms: ['HS256'],
    });
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new AuthError('Token expiré');
    }
    if (error.name === 'JsonWebTokenError') {
      throw new AuthError('Token invalide');
    }
    throw new AuthError(`Erreur de vérification token: ${error.message}`);
  }
}
