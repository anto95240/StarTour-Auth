import bcrypt from 'bcrypt';
import AuthRepository from '../repositories/auth.repository.js';
import { generateToken } from '../utils/jwt.js';
import {
  AuthenticationError,
  ConflictError,
  NotFoundError,
  ValidationError,
} from '../utils/errors.js';

class AuthService {
  static async register(email, password, username, firstName, lastName) {
    // Check if user already exists
    const existingUser = await AuthRepository.findByEmail(email);
    if (existingUser) {
      throw new ConflictError('Email already registered');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await AuthRepository.create({
      email,
      password: hashedPassword,
      username,
      firstName,
      lastName,
      isActive: true,
    });

    // Generate token
    const token = generateToken(user.id);

    return {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      token,
    };
  }

  static async login(email, password) {
    // Find user
    const user = await AuthRepository.findByEmail(email);
    if (!user) {
      throw new AuthenticationError('Invalid email or password');
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new AuthenticationError('Invalid email or password');
    }

    // Generate token
    const token = generateToken(user.id);

    return {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      token,
    };
  }

  static async getUserById(userId) {
    const user = await AuthRepository.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    return {
      id: user.id,
      email: user.email,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      isActive: user.isActive,
    };
  }

  static async updateUsername(userId, username) {
    const user = await AuthRepository.update(userId, { username });
    if (!user) {
      throw new NotFoundError('User not found');
    }

    return {
      id: user.id,
      email: user.email,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      isActive: user.isActive,
    };
  }

  static async changePassword(userId, currentPassword, newPassword) {
    // Validate new password
    if (!newPassword || newPassword.length < 8) {
      throw new ValidationError('New password must be at least 8 characters');
    }

    // Find user
    const user = await AuthRepository.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      throw new AuthenticationError('Current password is incorrect');
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await AuthRepository.update(userId, { password: hashedPassword });
  }
}

export default AuthService;
