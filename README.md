# LMS API

API backend d'une plateforme de Learning Management System (LMS), développée dans le cadre du Brief 1 YouCode.

Le projet permet de gérer le catalogue des cours publiés ainsi que leurs modules et ressources pédagogiques.

## 📌 Objectif du projet

L'objectif de ce premier brief est de mettre en place une base backend propre et évolutive pour une plateforme LMS.

Le périmètre développé dans ce brief concerne principalement :

* la consultation du catalogue des cours ;
* la consultation du détail d'un cours ;
* la consultation des modules d'un cours ;
* la consultation des ressources d'un module ;
* la recherche et le filtrage des cours ;
* le tri des cours ;
* la gestion des erreurs ;
* la préparation de la base MongoDB avec Docker ;
* le seeding des données.

Les fonctionnalités complètes du LMS telles que les inscriptions, la progression, les quiz et les feedbacks sont modélisées dans les diagrammes UML, mais ne sont pas développées dans ce brief.

---

## 🛠️ Technologies utilisées

* Node.js
* Express.js
* MongoDB
* Mongoose
* Docker
* Docker Compose
* JavaScript ES Modules
* Apidog
* Git / GitHub

---

## 📁 Architecture du projet

```text
lms-api/
│
├── src/
│   ├── config/
│   │   └── db.js
│   │
│   ├── controllers/
│   │   ├── courseController.js
│   │   ├── moduleController.js
│   │   └── resourceController.js
│   │
│   ├── middlewares/
│   │   ├── errorHandler.js
│   │   └── notFound.js
│   │
│   ├── models/
│   │   ├── Course.js
│   │   ├── Module.js
│   │   └── Resource.js
│   │
│   ├── routes/
│   │   ├── courseRoutes.js
│   │   ├── moduleRoutes.js
│   │   └── resourceRoutes.js
│   │
│   └── app.js
│
├── seed/
│   └── seed.js
│
├── docs/
│   └── uml/
│       ├── class-diagram.md
│       ├── use-case-diagram.md
│ 
│
├── .env.example
├── .gitignore
├── docker-compose.yml
├── package.json
├── package-lock.json
└── README.md
```

---

## ⚙️ Prérequis

Avant de lancer le projet, il faut avoir installé :

* Node.js
* npm
* Docker Desktop
* Git

---

## 📥 Installation

Cloner le projet :

```bash
git clone https://github.com/souad5017/lms-api.git
```

Entrer dans le projet :

```bash
cd lms-api
```

Installer les dépendances :

```bash
npm install
```

---

## 🔐 Configuration de l'environnement

Créer un fichier `.env` à la racine du projet :

```env
MONGO_URI=mongodb://localhost:27017/lms
```

Le fichier `.env` contient les configurations locales et ne doit pas être versionné.

Un fichier `.env.example` est fourni comme modèle :

```env
MONGO_URI=mongodb://localhost:27017/lms
```

---

## 🐳 Lancer MongoDB avec Docker

Le projet utilise Docker Compose pour lancer MongoDB.

Démarrer le conteneur :

```bash
docker compose up -d
```

Vérifier les conteneurs :

```bash
docker ps
```

Le serveur MongoDB est disponible sur :

```text
mongodb://localhost:27017
```

Pour arrêter les conteneurs :

```bash
docker compose down
```

---

## 🌱 Seed des données

Le projet contient un script permettant d'insérer des données de test dans MongoDB.

Lancer le seed :

```bash
npm run seed
```

Le seed crée des exemples de :

* cours ;
* modules ;
* ressources.

Les données permettent de tester rapidement les différentes routes de l'API.

---

## ▶️ Lancer l'API

En mode développement :

```bash
npm run dev
```

L'API est disponible sur :

```text
http://localhost:3000
```

---

## 🔗 API Endpoints

### Courses

#### Récupérer les cours publiés

```http
GET /api/courses
```

Paramètres de recherche et filtrage disponibles :

```text
search
category
level
sort
```

Exemple :

```http
GET /api/courses?search=javascript&category=Backend&level=intermediate&sort=createdAt
```

Les valeurs disponibles pour `sort` sont :

```text
createdAt
publishedAt
```

---

#### Récupérer un cours

```http
GET /api/courses/:id
```

Exemple :

```http
GET /api/courses/COURSE_ID
```

Seuls les cours avec le statut `published` sont retournés.

---

### Modules

#### Récupérer les modules d'un cours

```http
GET /api/courses/:id/modules
```

Les modules sont retournés dans l'ordre défini par leur champ `order`.

---

### Resources

#### Récupérer les ressources d'un module

```http
GET /api/modules/:moduleId/resources
```

Les ressources sont retournées dans l'ordre défini par leur champ `order`.

---

## ❌ Gestion des erreurs

L'API utilise deux middlewares pour gérer les erreurs :

### `notFound`

Retourne une réponse `404` lorsqu'une route n'existe pas.

Exemple :

```json
{
  "message": "Route not found"
}
```

### `errorHandler`

Gère les erreurs internes du serveur.

Exemple :

```json
{
  "message": "Internal server error"
}
```

---

## 📚 Documentation API

La documentation de l'API est réalisée avec Apidog.

Elle contient les endpoints, paramètres, exemples de requêtes et réponses.

[Documentation API Apidog](https://96nh1bsj5o.apidog.io/)

---

## 📐 UML

Les diagrammes UML sont disponibles dans :

```text
docs/uml/
```

### Diagramme de classes

Il représente les principales entités du LMS et leurs relations :

* User
* Role
* Course
* Module
* Resource
* Enrollment
* Progress
* Quiz
* QuizAttempt
* Feedback

### Diagramme de cas d'utilisation

Il représente les interactions principales entre :

* Visiteur
* Apprenant
* Formateur
* Administrateur

---

## 🔒 Authentification et autorisation

L'authentification et l'autorisation ne sont pas implémentées dans ce Brief 1.

Les rôles `Apprenant`, `Formateur` et `Administrateur` sont représentés dans les modèles et diagrammes UML afin de préparer les évolutions futures du LMS.

Les routes actuelles du catalogue sont accessibles sans authentification.

---

## 📌 Limites du Brief 1

Ce brief ne développe pas l'ensemble du LMS.

Les fonctionnalités suivantes restent hors du périmètre actuel :

* authentification ;
* autorisation par rôle ;
* inscriptions aux cours ;
* suivi détaillé de la progression ;
* quiz ;
* tentatives de quiz ;
* feedbacks ;
* gestion complète des utilisateurs ;
* CRUD complet des cours par les formateurs.

Le projet se concentre sur le **catalogue des cours, modules et ressources**.

---

## 🚀 Évolutions possibles

Les fonctionnalités suivantes pourront être ajoutées dans les prochains briefs :

* authentification et gestion des rôles ;
* CRUD des cours ;
* inscriptions ;
* progression des apprenants ;
* quiz et tentatives ;
* feedbacks ;
* pagination ;
* recherche avancée ;
* tests automatisés ;
* documentation Swagger/OpenAPI.

---

## 👩‍💻 Auteur

**Souad El Barjiji**

Projet réalisé dans le cadre de la formation YouCode.
