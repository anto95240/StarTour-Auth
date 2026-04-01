import Joi from 'joi';

export const registerSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Email must be valid',
    'any.required': 'Email is required',
  }),
  password: Joi.string().min(8).required().messages({
    'string.min': 'Password must be at least 8 characters',
    'any.required': 'Password is required',
  }),
  username: Joi.string().min(3).max(50).optional().messages({
    'string.min': 'Username must be at least 3 characters',
    'string.max': 'Username must not exceed 50 characters',
  }),
  firstName: Joi.string().max(100).required().messages({
    'string.max': 'First name must not exceed 100 characters',
    'any.required': 'First name is required',
  }),
  lastName: Joi.string().max(100).required().messages({
    'string.max': 'Last name must not exceed 100 characters',
    'any.required': 'Last name is required',
  }),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Email must be valid',
    'any.required': 'Email is required',
  }),
  password: Joi.string().required().messages({
    'any.required': 'Password is required',
  }),
});

export const validateRegister = (data) => registerSchema.validate(data, { abortEarly: false });

export const validateLogin = (data) => loginSchema.validate(data, { abortEarly: false });
