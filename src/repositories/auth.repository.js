import User from '../models/user.model.js';

class AuthRepository {
  static async findByEmail(email) {
    return User.findOne({ where: { email } });
  }

  static async findById(id) {
    return User.findByPk(id);
  }

  static async create(userData) {
    return User.create(userData);
  }

  static async update(id, userData) {
    const user = await User.findByPk(id);
    if (!user) {
      return null;
    }
    return user.update(userData);
  }

  static async delete(id) {
    const user = await User.findByPk(id);
    if (!user) {
      return false;
    }
    await user.destroy();
    return true;
  }
}

export default AuthRepository;
