# Port de plaisance Russell

Application web de la capitainerie du port de plaisance Russell : une API privée et un tableau de bord pour gérer les **catways** (appontements), les **réservations** et les **utilisateurs**.

- Serveur : Node.js et Express
- Base de données : MongoDB (Mongoose)
- Pages : EJS
- Authentification : sessions (express-session), mots de passe hachés avec bcryptjs
- Documentation de l'API : Swagger, accessible sur `/api-docs`

## Installation

Prérequis : Node.js 20 ou plus, et une base MongoDB (locale ou MongoDB Atlas).

```bash
npm install
```

Créer un fichier `.env` à la racine, sur le modèle de `.env.example` :

```
PORT=3000
MONGODB_URI=mongodb+srv://utilisateur:motdepasse@cluster.mongodb.net/port-russell
SESSION_SECRET=une_phrase_secrete_longue
```

Importer les données de départ (catways, réservations et compte administrateur) :

```bash
npm run seed
```

Lancer l'application :

```bash
npm start
```

L'application est alors disponible sur http://localhost:3000.
Pour le développement, `npm run dev` relance le serveur à chaque modification.

## Compte de démonstration

Créé par `npm run seed` :

- Email : `admin@port-russell.fr`
- Mot de passe : `admin123`

- Application hébergée : https://port-russell-ktiu.onrender.com
- Documentation de l'API : https://port-russell-ktiu.onrender.com/api-docs

## Pages

| Adresse | Contenu |
| --- | --- |
| `/` | Présentation, connexion, lien vers la documentation |
| `/dashboard` | Tableau de bord : utilisateur connecté, date du jour, réservations en cours |
| `/catways` | Gestion des catways |
| `/reservations` | Gestion des réservations |
| `/users` | Gestion des utilisateurs |
| `/api-docs` | Documentation de l'API |

## API

Les routes demandent d'être connecté. Avec un client HTTP (Postman, Swagger), envoyer l'en-tête `Accept: application/json` : les réponses sont alors en JSON. Un navigateur reçoit les pages HTML.

| Méthode | Route | Action |
| --- | --- | --- |
| POST | `/login` | Connexion (`email`, `password`) |
| GET | `/logout` | Déconnexion |
| GET | `/catways` | Liste des catways |
| GET | `/catways/:id` | Détails d'un catway (`id` = numéro) |
| POST | `/catways` | Création d'un catway |
| PUT | `/catways/:id` | Modification de l'état d'un catway |
| DELETE | `/catways/:id` | Suppression d'un catway |
| GET | `/reservations` | Toutes les réservations |
| GET | `/catways/:id/reservations` | Réservations d'un catway |
| GET | `/catways/:id/reservations/:idReservation` | Détails d'une réservation |
| POST | `/catways/:id/reservations` | Création d'une réservation |
| PUT | `/catways/:id/reservations/:idReservation` | Modification d'une réservation |
| DELETE | `/catways/:id/reservations/:idReservation` | Suppression d'une réservation |
| GET | `/users` | Liste des utilisateurs |
| GET | `/users/:email` | Détails d'un utilisateur |
| POST | `/users` | Création d'un utilisateur |
| PUT | `/users/:email` | Modification d'un utilisateur |
| DELETE | `/users/:email` | Suppression d'un utilisateur |

Le détail des paramètres et des réponses est dans la documentation Swagger (`/api-docs`).

## Règles de validation

- **Catway** : numéro entier unique supérieur ou égal à 1, type `long` ou `short`, état obligatoire. Le numéro et le type ne sont pas modifiables.
- **Réservation** : tous les champs obligatoires, date de fin après la date de début, pas de chevauchement avec une autre réservation du même catway.
- **Utilisateur** : nom d'au moins 3 caractères, email valide et unique, mot de passe d'au moins 6 caractères. On ne peut pas supprimer son propre compte.

## Structure du projet

```
app.js              configuration d'Express et démarrage
config/             connexion MongoDB, documentation Swagger
models/             schémas Mongoose
controllers/        logique de chaque ressource
routes/             routes et commentaires Swagger
middlewares/        protection des routes (connexion obligatoire)
utils/              fonctions communes
views/              pages EJS
public/             fichiers statiques (CSS)
data/               fichiers JSON de départ
seed.js             import des données
```

## Déploiement

1. Créer une base MongoDB Atlas et autoriser l'accès réseau de l'hébergeur.
2. Sur l'hébergeur Node.js (Render, par exemple), définir les variables d'environnement `MONGODB_URI`, `SESSION_SECRET` et `NODE_ENV=production`.
3. Commande de démarrage : `npm start`.
4. Lancer une fois `npm run seed` avec `MONGODB_URI` pointant vers la base Atlas, puis changer le mot de passe du compte administrateur.
