import Joi from 'joi';
import { ValidationError } from './errors.js';

/**
 * Fonction générique pour valider une requête
 */
export const validateRequest = (req, schema) => {
  const { error, value } = schema.validate(req.body, { abortEarly: false });
  
  if (error) {
    const details = error.details.map(d => ({
      field: d.path.join('.'),
      message: d.message,
    }));
    throw new ValidationError('Validation échouée', details);
  }
  
  return value;
};

/**
 * Fonction générique pour valider les paramètres
 */
export const validateParams = (params, schema) => {
  const { error, value } = schema.validate(params, { abortEarly: false });
  
  if (error) {
    const details = error.details.map(d => ({
      field: d.path.join('.'),
      message: d.message,
    }));
    throw new ValidationError('Validation échouée', details);
  }
  
  return value;
};

/**
 * Schémas de validation partagés
 */
export const sharedSchemas = {
  // Identifiant UUID
  uuid: Joi.string().uuid({ version: ['uuidv4'] }).required(),

  // Email
  email: Joi.string().email().required(),

  // Mot de passe fort
  password: Joi.string()
    .min(8)
    .pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
    .required()
    .messages({
      'string.pattern.base': 'Le mot de passe doit contenir au moins 8 caractères avec des majuscules, minuscules, chiffres et symboles',
    }),

  // Pagination
  pagination: {
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
  },

  // Slug
  slug: Joi.string().alphanum().lowercase().required(),
};

/**
 * Middleware de validation pour Express
 */
export const validationMiddleware = (schema) => {
  return (req, res, next) => {
    try {
      const validated = validateRequest(req, schema);
      req.validatedBody = validated;
      next();
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Schémas d'authentification
 */
export const registerSchema = Joi.object({
  email: sharedSchemas.email,
  password: sharedSchemas.password,
  username: Joi.string().alphanum().min(3).max(30).required(),
  firstName: Joi.string().min(2).max(50).required(),
  lastName: Joi.string().min(2).max(50).required(),
});

export const loginSchema = Joi.object({
  email: sharedSchemas.email,
  password: Joi.string().required(),
});

/**
 * Fonction de validation pour l'enregistrement
 */
export const validateRegister = (data) => {
  return registerSchema.validate(data, { abortEarly: false });
};

/**
 * Fonction de validation pour la connexion
 */
export const validateLogin = (data) => {
  return loginSchema.validate(data, { abortEarly: false });
};
