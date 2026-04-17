import express from 'express';
import AuthController from '../controllers/auth.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentification et gestion du compte
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Créer un nouveau compte
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [firstName, lastName, username, email, password]
 *             properties:
 *               firstName: { type: string, example: Han }
 *               lastName:  { type: string, example: Solo }
 *               username:  { type: string, example: hansolo }
 *               email:     { type: string, format: email, example: han@falcon.com }
 *               password:  { type: string, minLength: 6, example: "secret123" }
 *     responses:
 *       201:
 *         description: Compte créé
 *       400:
 *         description: Données invalides
 *       409:
 *         description: Email ou username déjà utilisé
 */
router.post('/register', AuthController.register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Se connecter et obtenir un JWT
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:    { type: string, format: email }
 *               password: { type: string }
 *     responses:
 *       200:
 *         description: Token JWT retourné
 *       401:
 *         description: Identifiants invalides
 */
router.post('/login', AuthController.login);

/**
 * @swagger
 * /api/auth/profile:
 *   get:
 *     summary: Profil de l'utilisateur connecté
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profil retourné
 *       401:
 *         description: Token invalide ou absent
 */
router.get('/profile', authenticate, AuthController.getProfile);

/**
 * @swagger
 * /api/auth/username:
 *   put:
 *     summary: Modifier le nom d'utilisateur
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [username]
 *             properties:
 *               username: { type: string }
 *     responses:
 *       200:
 *         description: Username mis à jour
 *       409:
 *         description: Username déjà pris
 */
router.put('/username', authenticate, AuthController.updateUsername);

/**
 * @swagger
 * /api/auth/change-password:
 *   post:
 *     summary: Changer le mot de passe
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [currentPassword, newPassword]
 *             properties:
 *               currentPassword: { type: string }
 *               newPassword:     { type: string, minLength: 6 }
 *     responses:
 *       200:
 *         description: Mot de passe changé
 *       401:
 *         description: Mot de passe actuel incorrect
 */
router.post('/change-password', authenticate, AuthController.changePassword);

export default router;
