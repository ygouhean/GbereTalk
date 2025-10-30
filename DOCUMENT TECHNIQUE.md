
# 📋 Document Technique - GbêrêTalk

## 🎯 Vue d'ensemble

**GbêrêTalk** est une application de chat en temps réel développée avec Node.js, Express, Socket.io et MongoDB. Elle permet aux utilisateurs de communiquer via des messages texte, des appels audio/vidéo, et des groupes de discussion.

## 🏗️ Architecture de l'application

### Stack Technologique
- **Backend** : Node.js + Express.js
- **Base de données** : MongoDB avec Mongoose
- **Temps réel** : Socket.io
- **Frontend** : EJS (templates) + JavaScript vanilla
- **Authentification** : JWT (JSON Web Tokens)
- **Sécurité** : bcryptjs pour le hachage des mots de passe

### Structure des dossiers
```
GbereTalkMongoDB/
├── app.js                 # Point d'entrée principal avec Socket.io
├── auth.js               # Configuration Express et routes
├── config.env            # Variables d'environnement
├── models/               # Modèles de données MongoDB
├── controllers/          # Logique métier
├── routes/              # Définition des routes
├── views/               # Templates EJS
├── public/              # Assets statiques (CSS, JS, images)
└── utils/               # Fonctions utilitaires
```

## 🗄️ Modèles de données

### 1. **User** (Utilisateur)
```javascript
{
  name: String (max 10 caractères),
  email: String (unique),
  password: String (haché avec bcrypt),
  location: String,
  image: String (default: 'default_image.jpg'),
  description: String (max 200 caractères),
  status: Enum ['Disponible', 'Occupé(e)'],
  notification: String (default: 1),
  is_muted: String (default: 1),
  isActive: Boolean,
  isBlocked: Boolean,
  lastActive: Date
}
```

### 2. **Contact** (Contacts)
```javascript
{
  name: String,
  email: String,
  user_id: ObjectId,
  created_by: ObjectId,
  last_msg_date: Date
}
```

### 3. **Messages** (Messages privés)
```javascript
{
  message: String,
  sender_id: ObjectId,
  receiver_id: ObjectId,
  file_upload: String,
  flag: String,
  createdAt: Date
}
```

### 4. **Group** (Groupes)
```javascript
{
  name: String,
  description: String,
  userId: ObjectId (créateur)
}
```

### 5. **GroupMessage** (Messages de groupe)
```javascript
{
  message: String,
  sender_id: ObjectId,
  group_id: ObjectId,
  file_upload: String,
  createdAt: Date
}
```

## 🔧 Fonctionnalités principales

### 1. **Authentification et sécurité**
- ✅ Inscription/Connexion avec validation
- ✅ Hachage des mots de passe (bcrypt)
- ✅ Tokens JWT pour l'authentification
- ✅ Réinitialisation de mot de passe par email
- ✅ Gestion des sessions

### 2. **Chat en temps réel**
- ✅ Messages privés instantanés
- ✅ Indicateur de frappe ("typing")
- ✅ Statut en ligne/hors ligne
- ✅ Recherche de messages
- ✅ Modification/suppression de messages
- ✅ Upload de fichiers/images

### 3. **Groupes de discussion**
- ✅ Création de groupes
- ✅ Ajout/suppression de membres
- ✅ Messages de groupe
- ✅ Gestion des administrateurs
- ✅ Recherche dans les groupes

### 4. **Appels audio/vidéo**
- ✅ Appels audio
- ✅ Appels vidéo
- ✅ WebRTC pour la communication P2P
- ✅ Interface d'appel intuitive

### 5. **Gestion des contacts**
- ✅ Ajout de contacts par email
- ✅ Liste des contacts
- ✅ Recherche de contacts
- ✅ Suppression de contacts

### 6. **Interface utilisateur**
- ✅ Design responsive (mobile/desktop)
- ✅ Interface moderne et intuitive
- ✅ PWA (Progressive Web App)
- ✅ Thème sombre/clair
- ✅ Notifications en temps réel

## 🚀 Installation et configuration

### Prérequis
- Node.js (version 10+)
- MongoDB (local ou Atlas)
- npm ou yarn

### Variables d'environnement (config.env)
```env
NODE_ENV=development
PORT=3000
DATABASE=mongodb://localhost:27017/gberetalk
DATABASE_PASSWORD=votre_mot_de_passe
JWT_SECRET=votre_secret_jwt
JWT_EXPIRES_IN=90d
JWT_COOKIE_EXPIRES_IN=90
EMAIL_USERNAME=votre_email
EMAIL_PASSWORD=votre_mot_de_passe_email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
```

### Installation
```bash
# 1. Cloner le projet
git clone [url-du-repo]

# 2. Installer les dépendances
npm install

# 3. Configurer les variables d'environnement
cp config.env.example config.env

# 4. Démarrer l'application
npm start
```

## 📡 API Endpoints

### Authentification
- `POST /api/v1/users/signup` - Inscription
- `POST /api/v1/users/signin` - Connexion
- `POST /api/v1/users/forgotPassword` - Mot de passe oublié
- `PATCH /api/v1/users/resetPassword/:token` - Réinitialisation

### Pages
- `GET /` - Page d'accueil
- `GET /login` - Page de connexion
- `GET /register` - Page d'inscription
- `GET /home` - Tableau de bord

## 🔌 Socket.io Events

### Connexion utilisateur
- `new-user-joined` - Nouvel utilisateur connecté
- `user-disconnected` - Utilisateur déconnecté

### Messages
- `chat message` - Envoi de message
- `typing` - Indicateur de frappe
- `message_update` - Modification de message
- `message_delete` - Suppression de message

### Groupes
- `createGroups` - Création de groupe
- `group message` - Message de groupe
- `addGroupContacts` - Ajouter des contacts au groupe

### Appels
- `ringcall` - Démarrer un appel
- `answerd` - Répondre à un appel
- `cutphone` - Terminer un appel

## 🛡️ Sécurité

### Mesures implémentées
- ✅ Hachage des mots de passe (bcrypt, coût 12)
- ✅ Validation des données d'entrée
- ✅ Protection contre les injections
- ✅ Tokens JWT sécurisés
- ✅ Cookies HTTPOnly
- ✅ Validation des emails
- ✅ Gestion des erreurs

### Recommandations
- 🔒 Utiliser HTTPS en production
- 🔒 Configurer CORS correctement
- 🔒 Limiter les tentatives de connexion
- 🔒 Sauvegarder régulièrement la base de données

## 📱 Fonctionnalités PWA

- ✅ Manifest.json configuré
- ✅ Service Worker (à implémenter)
- ✅ Installation sur mobile
- ✅ Mode hors ligne (à développer)

## 🎨 Interface utilisateur

### Design
- Interface moderne et responsive
- Thème cohérent avec couleurs personnalisées
- Animations fluides
- Support mobile optimisé

### Composants principaux
- Barre latérale avec contacts
- Zone de chat principale
- Interface d'appel audio/vidéo
- Panneau de paramètres
- Notifications en temps réel

## 🔄 Flux de données

1. **Connexion** : Utilisateur → Authentification → JWT → Interface chat
2. **Message** : Saisie → Socket.io → Base de données → Diffusion temps réel
3. **Appel** : Initiation → WebRTC → Communication P2P
4. **Groupe** : Création → Ajout membres → Messages partagés

## 📊 Performance

### Optimisations
- ✅ Connexions Socket.io optimisées
- ✅ Requêtes MongoDB indexées
- ✅ Assets statiques compressés
- ✅ Pagination des messages

### Monitoring
- Logs de connexion/déconnexion
- Gestion des erreurs centralisée
- Métriques de performance (à implémenter)

## 🚀 Déploiement

### Production
1. Configurer les variables d'environnement
2. Utiliser MongoDB Atlas
3. Configurer un serveur web (Nginx)
4. Utiliser PM2 pour la gestion des processus
5. Configurer SSL/HTTPS

### Docker (optionnel)
```dockerfile
FROM node:16
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

## 🔧 Maintenance

### Tâches régulières
- Sauvegarde de la base de données
- Mise à jour des dépendances
- Monitoring des performances
- Nettoyage des fichiers temporaires

### Logs importants
- Connexions utilisateurs
- Erreurs d'authentification
- Problèmes de Socket.io
- Erreurs de base de données

---

**Version** : 1.0.0  
**Développeur** : GYSC  
**Technologies** : Node.js, Express, Socket.io, MongoDB, EJS  
**Licence** : ISC

Ce document technique fournit une vue d'ensemble complète de l'application GbêrêTalk, facilitant la compréhension, la maintenance et l'évolution du projet.