# StarTour Authentication Microservice

Service d'authentification pour la plateforme StarTour. Gère complètement l'authentification, l'enregistrement et la gestion des profils utilisateur.

## Architecture

```
src/
├── config/           # Configuration (base de données, environnement)
├── controllers/      # Contrôleurs (traitement des requêtes HTTP)
├── services/         # Logique métier
├── repositories/     # Accès aux données (pattern Repository)
├── models/          # Modèles de données Sequelize
├── middleware/      # Middlewares (authentification, gestion des erreurs)
├── utils/           # Utilitaires (validation, tokens JWT, erreurs)
├── routes/          # Routes de l'API
└── server.js        # Point d'entrée
```

## Installation

```bash
npm install
```

## Configuration

1. Créer un fichier `.env` à partir de `.env.example` :
```bash
cp .env.example .env
```

2. Configurer les variables d'environnement :
```
DB_HOST=localhost
DB_PORT=3306
DB_NAME=startour_auth
DB_USER=root
DB_PASSWORD=password
JWT_SECRET=your_secret_key
```

## Scripts

```bash
# Démarrage en mode développement (avec Nodemon)
npm run dev

# Démarrage en mode production
npm start

# Linting
npm run lint

# Linting avec auto-fix
npm run lint:fix

# Formatage du code
npm run format
```

## Endpoints

### Auth (Public)

- **POST** `/api/auth/register` - Enregistrement utilisateur
  ```json
  {
    "email": "user@example.com",
    "password": "securePassword123",
    "firstName": "John",
    "lastName": "Doe"
  }
  ```

- **POST** `/api/auth/login` - Connexion utilisateur
  ```json
  {
    "email": "user@example.com",
    "password": "securePassword123"
  }
  ```

### Auth (Protected)

- **GET** `/api/auth/profile` - Récupérer le profil utilisateur
  - Headers: `Authorization: Bearer <token>`

- **PUT** `/api/auth/profile` - Mettre à jour le profil
  - Headers: `Authorization: Bearer <token>`
  ```json
  {
    "firstName": "Jane",
    "lastName": "Smith"
  }
  ```

- **POST** `/api/auth/change-password` - Changer le mot de passe
  - Headers: `Authorization: Bearer <token>`
  ```json
  {
    "oldPassword": "currentPassword",
    "newPassword": "newPassword123",
    "confirmPassword": "newPassword123"
  }
  ```

### Health Check

- **GET** `/health` - Vérifier l'état du service

## Structure des Réponses

### Succès

```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe"
    },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

### Erreur

```json
{
  "success": false,
  "error": {
    "status": 400,
    "message": "Validation error message"
  }
}
```

## Codes HTTP

- `201` - Créé (registration)
- `200` - OK
- `400` - Erreur de validation
- `401` - Non authentifié
- `403` - Non autorisé
- `404` - Non trouvé
- `409` - Conflit (email déjà existant)
- `500` - Erreur serveur

## Sécurité

- Les mots de passe sont hashés avec bcrypt
- Les tokens JWT ont une durée d'expiration configurable
- Validation des entrées avec Joi
- Protection CORS configurable
- Middleware d'authentification pour les routes protégées

## Technologies

- **Express.js** - Framework web
- **Sequelize** - ORM MySQL
- **JWT** - Authentification par token
- **bcrypt** - Hachage des mots de passe
- **Joi** - Validation des données
- **ESLint 8** - Linting du code
- **Prettier** - Formatage du code

## Développement

### Format et Lint

Le code doit respecter ESLint 8 et les standards AirBnB :

```bash
npm run lint:fix   # Corriger les erreurs de linting
npm run format     # Formater le code
```

### Architecture Layered

Ce projet suit le pattern layered architecture :

1. **Controller Layer** - Traitement des requêtes HTTP
2. **Service Layer** - Logique métier
3. **Repository Layer** - Accès aux données
4. **Model Layer** - Structures de données

## Gestion des Erreurs

Les erreurs sont gérées de manière centralisée via le middleware `errorHandler` :

- `ValidationError` (400)
- `AuthenticationError` (401)
- `AuthorizationError` (403)
- `NotFoundError` (404)
- `ConflictError` (409)

## License

ISC
