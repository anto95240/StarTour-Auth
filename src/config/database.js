import { Sequelize } from 'sequelize';
import mysql2 from 'mysql2/promise';
import config from './environment.js';

// Créer l'instance Sequelize
export const sequelize = new Sequelize(
  config.db.name,
  config.db.user,
  config.db.password,
  {
    host: config.db.host,
    port: config.db.port,
    dialect: 'mysql',
    logging: config.env === 'development' ? console.log : false,
  },
);

// Initialiser la base de données
export const initializeDatabase = async () => {
  try {
    // Connexion initiale sans spécifier de base de données
    const connection = await mysql2.createConnection({
      host: config.db.host,
      port: config.db.port,
      user: config.db.user,
      password: config.db.password,
    });

    // Créer la base de données si elle n'existe pas
    await connection.execute(
      `CREATE DATABASE IF NOT EXISTS \`${config.db.name}\``,
    );

    console.log(`✓ Database '${config.db.name}' initialized`);
    await connection.end();

    // Tester la connexion Sequelize
    await sequelize.authenticate();
    console.log('✓ Database connection authenticated');

    return sequelize;
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
};

export default sequelize;
