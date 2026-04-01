import AuthService from '../services/auth.service.js';
import { validateRegister, validateLogin } from '../utils/validation.js';
import { ValidationError } from '../utils/errors.js';

class AuthController {
  static async register(req, res, next) {
    try {
      const { error, value } = validateRegister(req.body);
      if (error) {
        throw new ValidationError(error.details.map(d => d.message).join(', '));
      }

      const result = await AuthService.register(
        value.email,
        value.password,
        value.username,
        value.firstName,
        value.lastName
      );

      res.status(201).json({
        success: true,
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  static async login(req, res, next) {
    try {
      const { error, value } = validateLogin(req.body);
      if (error) {
        throw new ValidationError(error.details.map(d => d.message).join(', '));
      }

      const result = await AuthService.login(value.email, value.password);

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  static async getProfile(req, res, next) {
    try {
      const user = await AuthService.getUserById(req.user.userId);
      res.status(200).json({
        success: true,
        data: { user },
      });
    } catch (err) {
      next(err);
    }
  }

  static async updateUsername(req, res, next) {
    try {
      const { username } = req.body;
      if (!username) {
        throw new ValidationError('Username is required');
      }
      const user = await AuthService.updateUsername(req.user.userId, username);
      res.status(200).json({
        success: true,
        data: { user },
      });
    } catch (err) {
      next(err);
    }
  }

  static async changePassword(req, res, next) {
    try {
      const { currentPassword, newPassword } = req.body;
      await AuthService.changePassword(req.user.userId, currentPassword, newPassword);
      res.status(200).json({
        success: true,
        message: 'Password changed successfully',
      });
    } catch (err) {
      next(err);
    }
  }
}

export default AuthController;
