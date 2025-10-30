# 🎯 Parcours Utilisateur - GbêrêTalk

## Vue d'ensemble

Ce document décrit les différents parcours utilisateur de l'application GbêrêTalk, de l'inscription à l'utilisation quotidienne des fonctionnalités de messagerie, appels et collaboration.

---

## Parcours 1 : Nouvel Utilisateur

### 📱 Étape 1 : Découverte et Inscription

#### 1.1 Arrivée sur la page d'accueil (`/`)
- L'utilisateur découvre **GbêrêTalk**
- Lit la description : *"Plateforme de communication moderne"*
- Explore les fonctionnalités présentées :
  - 💬 Chat en temps réel
  - 👥 Groupes & Équipes
  - 📹 Appels vidéo
  - 📎 Partage de fichiers
  - 🔒 Sécurité avancée
  - 📱 Multi-plateforme

#### 1.2 Inscription
1. Clic sur le bouton **"S'inscrire"** ou **"Créer un compte"**
2. Redirection vers `/register`
3. Remplit le formulaire d'inscription :
   - **Nom complet** : Jean Dupont
   - **Email** : jean.dupont@example.com
   - **Mot de passe** : ••••••••
   - **Confirmation** : ••••••••
4. Clic sur **"Créer un compte"**
5. ✅ **Message de succès** : "Compte créé avec succès !"
6. **Redirection automatique** vers la page de connexion

### 🔐 Étape 2 : Première Connexion

#### 2.1 Authentification
1. Page de connexion (`/login`)
2. Saisit ses identifiants :
   - **Email** : jean.dupont@example.com
   - **Mot de passe** : ••••••••
3. Clic sur **"Se connecter"**
4. ✅ **Authentifié avec JWT** (token stocké)
5. **Redirection** vers l'application principale

#### 2.2 Première vue de l'application
- Arrive sur l'interface de chat (`/`)
- Voit le message d'accueil : *"Débuter le gbêrê (conversation)"*
- Interface vide (pas encore de contacts)
- Menu de navigation visible :
  - **Desktop** : Barre latérale gauche verticale
  - **Mobile** : Menu fixé en bas de l'écran
    ```
    👤  💬  👥  📇  ⚙️  🚪
    ```

### 👤 Étape 3 : Configuration du Profil

#### 3.1 Accès au profil
1. Clic sur l'icône **Profil** (👤)
2. Voit son profil par défaut :
   - 📷 Photo : image par défaut (default_image.jpg)
   - 👤 Nom : Jean Dupont
   - 📧 Email : jean.dupont@example.com
   - 📝 Description : Texte générique
   - 🟢 Statut : Disponible

#### 3.2 Personnalisation
1. Clic sur **"Modifier"** (onglet Paramètres ⚙️)
2. **Changer la photo de profil** :
   - Clic sur l'icône crayon ✏️
   - Sélectionne une image depuis son appareil
   - Image uploadée et affichée instantanément
3. **Modifier les informations** :
   - Change son nom : "Jean D."
   - Ajoute une description : *"Développeur passionné 🚀"*
   - Définit son statut : "Disponible" ou "Occupé(e)"
4. Clic sur **"Enregistrer"**
5. ✅ **Profil mis à jour** et visible par tous les contacts

### 📇 Étape 4 : Ajout de Contacts

#### 4.1 Accès à la liste de contacts
1. Clic sur l'onglet **Contacts** (📇)
2. Liste vide affichée : *"Aucun contact pour le moment"*
3. Barre de recherche disponible
4. Bouton **"+"** (Ajouter un contact) visible en haut

#### 4.2 Ajouter un nouveau contact
1. Clic sur le bouton **"+"**
2. Modal/Fenêtre d'ajout s'ouvre
3. Remplit le formulaire :
   - **Nom du contact** : Marie Martin
   - **Email du contact** : marie.martin@example.com
   - ⚠️ *L'email doit correspondre à un utilisateur existant*
4. Clic sur **"Inviter un contact"**
5. ✅ **Message de succès** : "Contact ajouté avec succès"
6. Le contact apparaît dans la liste avec :
   - 📷 Sa photo de profil
   - 👤 Son nom
   - 🟢 Son statut (En ligne / Hors ligne)
   - 🕐 Heure de dernière activité

#### 4.3 Contact ajouté des deux côtés
- Marie reçoit automatiquement Jean dans ses contacts
- Relation bidirectionnelle créée
- Les deux peuvent maintenant communiquer

---

## Parcours 2 : Utilisateur Régulier - Messagerie

### 💬 Étape 1 : Démarrer une Conversation

#### 1.1 Navigation vers les chats
1. Clic sur l'onglet **Chats** (💬)
2. Liste des contacts affichée avec :
   - 📷 Photo de profil
   - 👤 Nom du contact
   - 💬 Dernier message échangé
   - 🕐 Horodatage
   - 🔴 Badge de messages non lus (si applicable)

#### 1.2 Ouvrir une conversation
1. Clic sur **Marie Martin**
2. **Comportement selon l'appareil** :
   - **Mobile** : Conversation s'ouvre en plein écran
   - **Desktop** : Conversation s'ouvre dans le panneau de droite
3. Historique des messages chargé (pagination automatique)
4. Indicateur de statut :
   - 🟢 "En ligne" si Marie est connectée
   - 🕐 "Vu il y a X minutes" si hors ligne

### ✍️ Étape 2 : Envoyer des Messages

#### 2.1 Zone de saisie
- Champ de texte en bas de l'écran
- Placeholder : *"Entrer le Message..."*
- Icônes d'actions disponibles :
  - 📷 **Caméra** : Prendre une photo
  - 😊 **Emoji** : Ajouter des emojis
  - 📎 **Fichier** : Joindre un document/image/vidéo
  - ➤ **Envoyer** : Bouton d'envoi

#### 2.2 Écrire et envoyer
1. Jean tape : *"Salut Marie ! Comment vas-tu ?"*
2. Marie voit en temps réel : *"Jean est en train d'écrire..."*
3. Jean appuie sur **Entrée** ou clic sur ➤
4. Message envoyé instantanément via **Socket.io**

#### 2.3 Affichage du message
- **Côté Jean (expéditeur)** :
  - Message apparaît à **droite** (bulle bleue)
  - Heure d'envoi : "14:32"
  - Aligné à droite de l'écran
  
- **Côté Marie (destinataire)** :
  - Notification sonore 🔔 (si activée)
  - Message apparaît à **gauche** (bulle grise)
  - Photo de Jean affichée
  - Badge de notification sur l'onglet Chats : 🔴1

### 📨 Étape 3 : Recevoir et Répondre

#### 3.1 Marie reçoit le message
1. **Notification** :
   - Son 🔔 "notification.mp3"
   - Badge numérique sur l'onglet
   - Message visible dans la conversation
2. **Affichage** :
   - Bulle grise à gauche
   - Photo de Jean
   - Contenu : *"Salut Marie ! Comment vas-tu ?"*
   - Heure : "14:32"

#### 3.2 Marie répond
1. Clique dans le champ de saisie
2. Jean voit : *"Marie est en train d'écrire..."*
3. Marie tape : *"Très bien merci ! Et toi ?"*
4. Envoie le message ➤
5. Conversation bidirectionnelle établie

#### 3.3 Actions sur les messages
Long press (mobile) ou clic droit (desktop) sur un message :
- ✏️ **Modifier le message** (uniquement ses propres messages)
- 🗑️ **Supprimer le message** :
  - Pour moi
  - Pour tout le monde (si moins de 1h)
- ↗️ **Transférer le message** vers un autre contact
- 📋 **Copier le texte**
- ⭐ **Marquer comme important**

### 🔍 Étape 4 : Fonctionnalités Avancées

#### 4.1 Recherche dans la conversation
1. Clic sur l'icône 🔍 en haut
2. Tape un mot-clé : "rendez-vous"
3. Tous les messages contenant le mot sont surlignés
4. Navigation entre les résultats

#### 4.2 Supprimer toute la conversation
1. Menu ⋮ (trois points) en haut à droite
2. Sélectionne "Supprimer un message"
3. Confirmation demandée
4. ✅ Conversation vidée

#### 4.3 Profil du contact
1. Clic sur le nom ou la photo en haut
2. Panneau latéral s'ouvre (desktop) ou nouvelle page (mobile)
3. Informations affichées :
   - 📷 Photo en grand
   - 👤 Nom complet
   - 📧 Email
   - 📝 Description
   - 🕐 Dernière activité
4. Bouton **"Modifier"** pour renommer localement

---

## Parcours 3 : Utilisation des Groupes

### 👥 Étape 1 : Créer un Groupe

#### 1.1 Accès à la section Groupes
1. Clic sur l'onglet **Groupes** (👥)
2. Liste des groupes existants (vide si premier groupe)
3. Bouton **"+"** visible en haut : *"Créer un grin (groupe)"*

#### 1.2 Formulaire de création
1. Clic sur **"+"**
2. Modal s'ouvre : *"Créer un nouveau Grin (Groupe)"*
3. **Nom du groupe** : "Équipe Projet Web"
4. **Description** : "Groupe de travail pour le projet GbêrêTalk"
5. **Sélection des membres** :
   - Clic sur "Sélectionner des Membres"
   - Liste des contacts s'affiche
   - Coche les membres :
     - ☑️ Marie Martin
     - ☑️ Thomas Dubois
     - ☑️ Sophie Laurent
6. Clic sur **"Créer des Grin (Groupes)"**
7. ✅ **Groupe créé avec succès**

#### 1.3 Confirmation
- Groupe apparaît dans la liste
- Badge : 👥 + nombre de membres (4 personnes)
- Jean est automatiquement **admin** du groupe
- Tous les membres reçoivent une notification

### 💬 Étape 2 : Discuter en Groupe

#### 2.1 Ouvrir la conversation de groupe
1. Clic sur **"Équipe Projet Web"**
2. Conversation de groupe s'ouvre
3. Interface similaire au chat individuel mais :
   - Chaque message affiche le **nom de l'expéditeur**
   - **Photo de profil** de chaque participant
   - Indication du nombre de membres en haut

#### 2.2 Envoyer un message de groupe
1. Jean tape : *"Bonjour à tous ! Bienvenue dans le groupe 👋"*
2. Clic sur ➤ Envoyer
3. **Diffusion instantanée** :
   - Marie reçoit le message
   - Thomas reçoit le message
   - Sophie reçoit le message
4. Chaque membre voit :
   - 📷 Photo de Jean
   - 👤 Nom "Jean D."
   - 💬 Message
   - 🕐 Heure

#### 2.3 Conversation de groupe active
- Marie répond : *"Salut tout le monde !"*
- Thomas : *"Hello 👋"*
- Sophie : *"Bonjour à tous !"*
- Tous les messages apparaissent en temps réel
- Indicateur de frappe : *"Marie est en train d'écrire..."*

### 👑 Étape 3 : Gérer le Groupe (Admin)

#### 3.1 Options d'administration
1. Clic sur le nom du groupe en haut
2. Menu s'ouvre avec options :
   - 👥 **Voir les membres** (4)
   - ➕ **Ajouter des membres**
   - ✏️ **Modifier le nom du groupe**
   - 🗑️ **Supprimer le groupe**

#### 3.2 Ajouter un nouveau membre
1. Clic sur **"Ajouter des membres"**
2. Liste des contacts non-membres s'affiche
3. Sélectionne : ☑️ Lucas Petit
4. Clic sur **"Ajouter un membre"**
5. ✅ Lucas rejoint le groupe
6. Message système : *"Lucas Petit a rejoint le groupe"*
7. Tous les membres sont notifiés

#### 3.3 Modifier le nom
1. Clic sur **"Modifier le nom du groupe"**
2. Change : "Équipe Projet Web" → "Team GbêrêTalk 🚀"
3. Enregistre
4. Message système : *"Jean a modifié le nom du groupe"*

#### 3.4 Retirer un membre
1. Liste des membres affichée
2. Clic sur ❌ à côté d'un membre non-admin
3. Confirmation : "Êtes-vous sûr ?"
4. ✅ Membre retiré du groupe
5. Message système : *"Sophie a quitté le groupe"*

---

## Parcours 4 : Appels Audio/Vidéo

### 📞 Étape 1 : Appel Audio

#### 1.1 Initier un appel audio
1. Jean ouvre la conversation avec Marie
2. Clic sur l'icône **téléphone** 📞 en haut
3. **Modal d'appel audio** s'ouvre :
   - 📷 Grande photo de Marie
   - 👤 Nom "Marie Martin"
   - 🔵 "Appel en cours..."
   - Son de sonnerie 🎵 "call-ring.mp3"

#### 1.2 Côté destinataire (Marie)
1. **Notification d'appel entrant** :
   - Modal plein écran s'affiche
   - 📷 Photo de Jean
   - 👤 "Jean D. vous appelle"
   - Son de sonnerie 🎵
2. **Options disponibles** :
   - ✅ **Répondre** (bouton vert rond)
   - ❌ **Refuser** (bouton rouge rond)

#### 1.3 Appel en cours
1. Marie clique sur ✅ **Répondre**
2. **Connexion établie** (WebRTC)
3. **Interface d'appel active** :
   - 📷 Photo du contact
   - ⏱️ Durée : "00:15" (timer)
   - **Contrôles** :
     - 🎤 **Muet** : Couper/Activer le micro
     - 📞 **Raccrocher** : Terminer l'appel

#### 1.4 Pendant l'appel
- Audio bidirectionnel actif
- Qualité ajustée selon la connexion
- Timer en temps réel : "02:34"
- Possibilité de mettre en sourdine 🎤
- Possibilité de passer en haut-parleur 🔊 (mobile)

#### 1.5 Fin de l'appel
1. Jean clique sur **Raccrocher** 📞
2. Appel terminé pour les deux parties
3. Message système dans le chat :
   - 📞 "Appel audio - Durée : 02:34"

### 📹 Étape 2 : Appel Vidéo

#### 2.1 Initier un appel vidéo
1. Jean ouvre la conversation avec Marie
2. Clic sur l'icône **vidéo** 📹 en haut
3. **Permission caméra demandée** (première fois)
4. **Modal d'appel vidéo** s'ouvre :
   - 📹 Prévisualisation de sa propre caméra (petit coin)
   - 📷 Photo de Marie en grand
   - "Appel vidéo en cours..."
   - Son de sonnerie 🎵

#### 2.2 Marie reçoit l'appel
1. **Notification d'appel vidéo entrant** :
   - 📹 "Jean D. vous appelle en vidéo"
   - 📷 Photo de Jean
   - Options :
     - ✅ **Répondre avec vidéo**
     - ❌ **Refuser**

#### 2.3 Appel vidéo actif
1. Marie répond
2. **Interface d'appel vidéo** :
   - 📹 **Vidéo de Marie** : Grand écran principal
   - 📹 **Vidéo de Jean** : Petit coin (PiP - Picture in Picture)
   - Position : Haut à droite
   - Taille : 120×80px
   - Draggable (peut être déplacé)

#### 2.4 Contrôles pendant l'appel
**Barre de contrôles en bas** :
- 📹 **Vidéo** : Activer/Désactiver la caméra
  - Désactivée : Fond noir avec initiales
- 🎤 **Audio** : Couper/Activer le micro
  - Coupé : Icône barrée
- 🔄 **Basculer** : Caméra avant/arrière (mobile uniquement)
- 📞 **Raccrocher** : Terminer l'appel (bouton rouge)

#### 2.5 Mode plein écran (optionnel)
1. Double-clic sur la vidéo
2. **Mode plein écran activé**
3. Contrôles masqués automatiquement
4. Réapparaissent au mouvement de souris/touch
5. Échap pour quitter

#### 2.6 Gestion des problèmes de connexion
- **Mauvaise connexion** :
  - Qualité vidéo réduite automatiquement
  - Message : "Connexion faible"
- **Perte de connexion** :
  - Tentative de reconnexion automatique
  - Timer : "Reconnexion... 5s"
- **Échec de reconnexion** :
  - Appel terminé automatiquement
  - Message : "Appel interrompu"

#### 2.7 Fin de l'appel vidéo
1. Jean clique sur **Raccrocher** 📞
2. Appel terminé pour les deux
3. Caméras désactivées
4. Message système :
   - 📹 "Appel vidéo - Durée : 05:42"

---

## Parcours 5 : Partage de Fichiers

### 📎 Étape 1 : Envoyer un Fichier

#### 1.1 Joindre un fichier
1. Jean est dans une conversation avec Marie
2. Clic sur l'icône **trombone** 📎
3. **Explorateur de fichiers** s'ouvre
4. Types de fichiers supportés :
   - 📄 Documents (PDF, DOC, TXT, etc.)
   - 🖼️ Images (JPG, PNG, GIF, etc.)
   - 🎥 Vidéos (MP4, AVI, MOV, etc.)
   - 🎵 Audio (MP3, WAV, etc.)

#### 1.2 Sélection et prévisualisation
1. Jean sélectionne : **"Rapport-Q4.pdf"** (2.5 MB)
2. **Aperçu du fichier** s'affiche :
   - 📄 Icône du type de fichier
   - 📝 Nom : "Rapport-Q4.pdf"
   - 📊 Taille : "2.5 MB"
   - ❌ Bouton pour annuler
3. Peut ajouter un message : *"Voici le rapport dont on a parlé"*
4. Clic sur **Envoyer** ➤

#### 1.3 Upload et envoi
1. **Barre de progression** s'affiche :
   ```
   Envoi en cours... ▓▓▓▓▓▓▓░░░ 65%
   ```
2. Une fois uploadé : ✅ "Envoyé"
3. **Message avec fichier** apparaît dans le chat

#### 1.4 Affichage du fichier envoyé
**Côté Jean (expéditeur)** :
- Bulle bleue à droite
- 📄 Icône + nom du fichier
- 📊 Taille : "2.5 MB"
- 🕐 Heure : "15:23"

**Côté Marie (destinataire)** :
- Notification 🔔
- Bulle grise à gauche
- 📷 Photo de Jean
- 📄 "Rapport-Q4.pdf" (2.5 MB)
- 💬 Message : *"Voici le rapport dont on a parlé"*
- Bouton **"Télécharger"** 📥

### 🖼️ Étape 2 : Envoyer une Image

#### 2.1 Sélectionner une image
1. Clic sur 📎
2. Sélectionne **"photo-vacances.jpg"**
3. **Prévisualisation de l'image** s'affiche
4. Options :
   - ✏️ Ajouter du texte/dessin (optionnel)
   - 🔄 Rotation
   - ✂️ Recadrer
5. Clic sur **Envoyer**

#### 2.2 Affichage de l'image
- **Dans le chat** :
  - Miniature de l'image (300×200px)
  - Clic pour agrandir
  - Galerie en mode lightbox
- **Actions disponibles** :
  - 📥 Télécharger
  - 🔍 Voir en grand
  - ↗️ Transférer
  - 🗑️ Supprimer

### 📷 Étape 3 : Prendre une Photo

#### 3.1 Activer la caméra
1. Dans une conversation
2. Clic sur l'icône **caméra** 📷
3. **Permission caméra demandée** (si première fois)
4. **Flux vidéo en direct** s'affiche :
   - Prévisualisation 350×270px
   - Contrôles :
     - 📸 Bouton de capture (grand, rond, bleu)
     - 🔄 Basculer caméra avant/arrière
     - ❌ Fermer

#### 3.2 Capture de la photo
1. Jean pointe la caméra
2. Clic sur **📸 Capturer**
3. **Photo capturée** :
   - Flux vidéo s'arrête
   - Image fixe s'affiche
   - Options :
     - ✅ **Envoyer** (bouton vert)
     - 🔄 **Reprendre** (bouton bleu)
     - ❌ **Annuler** (bouton rouge)

#### 3.3 Envoi de la photo
1. Clic sur ✅ **Envoyer**
2. Photo envoyée dans le chat
3. Affichage identique aux images jointes
4. Marie voit la photo instantanément

### 🎥 Étape 4 : Envoyer une Vidéo

#### 4.1 Sélection de vidéo
1. Clic sur 📎
2. Sélectionne **"presentation.mp4"** (15 MB)
3. **Aperçu vidéo** avec miniature
4. ⚠️ Limite de taille : 20 MB (configurable)
5. Clic sur **Envoyer**

#### 4.2 Upload de la vidéo
- **Barre de progression détaillée** :
  ```
  Upload en cours...
  ▓▓▓▓▓▓▓▓░░░░░░░ 45%
  6.7 MB / 15 MB
  Temps restant : 12s
  ```

#### 4.3 Lecture de la vidéo
**Dans le chat** :
- Miniature avec icône ▶️ Play
- Durée : "2:34"
- Taille : "15 MB"
- **Clic sur la vidéo** :
  - Lecteur vidéo s'ouvre
  - Contrôles : Play, Pause, Volume, Plein écran
  - Timeline de navigation

---

## Parcours 6 : Paramètres et Personnalisation

### ⚙️ Étape 1 : Accès aux Paramètres

#### 1.1 Navigation
1. Clic sur l'onglet **Paramètres** (⚙️)
2. **Sections disponibles** :
   ```
   ├─ 📋 Informations personnelles
   ├─ 🔒 Sécurité
   └─ 🌓 Thème
   ```

### 🔧 Étape 2 : Informations Personnelles

#### 2.1 Modifier le profil
1. Section **"Informations personnelles"** ouverte par défaut
2. **Champs disponibles** :
   - 👤 **Nom** : "Jean D." [✏️ Modifier]
   - 📧 **Email** : jean.dupont@example.com (lecture seule)
   - 🕐 **Heure** : 14:35
   - 📍 **Location** : Abidjan, CIV
   
3. **Modifier le nom** :
   - Clic sur ✏️ à côté du nom
   - Champ devient éditable
   - Change : "Jean D." → "Jean Dupont"
   - Clic sur **"Enregistrer"**
   - ✅ Nom mis à jour partout

#### 2.2 Changer la photo de profil
1. Section photo en haut
2. Survol : Icône ✏️ apparaît
3. Clic sur l'icône
4. Sélectionne une nouvelle image
5. Upload automatique
6. ✅ Photo mise à jour instantanément
7. Visible pour tous les contacts

#### 2.3 Modifier la description
1. Section **Description**
2. Texte actuel : *"Si plusieurs langues fusionnent..."*
3. Clic sur **"Modifier"**
4. Zone de texte s'ouvre (200 caractères max)
5. Tape : *"Développeur Full Stack | Passionné de tech 🚀"*
6. Compteur : "47/200 caractères"
7. Clic sur **"Enregistrer"**
8. ✅ Description mise à jour

### 🔒 Étape 3 : Paramètres de Sécurité

#### 3.1 Notifications de sécurité
1. Section **"Sécurité"** (repliée par défaut)
2. Clic pour déplier
3. **Option** : "Afficher la notification de sécurité"
   - Toggle switch : ☑️ Activé
   - Description : *"Recevoir des alertes de sécurité"*
4. Basculer sur ☐ Désactivé si souhaité

#### 3.2 Notification sonore
1. **Option** : "Notification Sonore"
   - Toggle switch : ☑️ Activé
   - Sons joués pour :
     - 📨 Nouveaux messages
     - 📞 Appels entrants
     - 👥 Invitations de groupe
2. **Tester** :
   - Bascule sur ☐ Désactivé
   - Reçoit un message → Pas de son
   - Rebascule sur ☑️ Activé
   - Reçoit un message → 🔔 Son joué

### 🌓 Étape 4 : Thème et Apparence

#### 4.1 Mode Sombre/Clair
1. Bouton **"Mode Sombre / Clair"** 🌓 visible en bas (desktop)
2. **État actuel** : Mode Clair ☀️
   - Fond : Blanc #FFFFFF
   - Texte : Noir #000000
3. **Basculer en Mode Sombre** :
   - Clic sur l'icône 🌓
   - Transition smooth (0.3s)
   - **Nouveau thème** :
     - Fond : #262e35 (gris foncé)
     - Texte : #FFFFFF (blanc)
     - Accents : Bleu #0066ff
4. **Préférence sauvegardée** :
   - Stockée en localStorage
   - Appliquée à chaque connexion

#### 4.2 Statut personnalisé
1. Section statut en haut de Paramètres
2. **Dropdown menu** : "Disponible" ▼
3. Options :
   - 🟢 **Disponible**
   - 🔴 **Occupé(e)**
4. Sélectionne "Occupé(e)"
5. ✅ Statut mis à jour
6. Visible par tous les contacts
7. Apparaît sur son profil et dans les listes

---

## Parcours 7 : Expérience Mobile

### 📱 Navigation Mobile Spécifique

#### 7.1 Interface mobile
**Menu fixe en bas de l'écran** :
```
┌─────────────────────────────────────┐
│     Contenu principal               │
│     (Chats / Groupes / etc.)        │
│                                     │
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│  👤   💬   👥   📇   ⚙️   🚪      │ ← Menu fixe (60px)
└─────────────────────────────────────┘
```

#### 7.2 Navigation entre onglets
1. **Tap sur 💬 (Chats)** :
   - Liste des conversations s'affiche en plein écran
   - Scroll vertical
   - Barre de recherche en haut

2. **Tap sur 👥 (Groupes)** :
   - Transition smooth (0.3s)
   - Liste des groupes s'affiche
   - Menu reste fixé en bas

3. **Tap sur 📇 (Contacts)** :
   - Liste des contacts
   - Bouton + flottant en haut

### 🤏 Étape 2 : Gestes Tactiles

#### 2.1 Ouvrir une conversation
1. **Tap sur un contact** dans la liste
2. **Animation** :
   - Slide de droite à gauche
   - Conversation s'ouvre en plein écran
3. **Bouton retour ← visible** en haut à gauche
4. Menu en bas reste visible

#### 2.2 Swipe pour retour
1. Dans une conversation
2. **Swipe de gauche à droite** (geste naturel)
3. Conversation se ferme
4. Retour à la liste des chats
5. Animation slide inverse

#### 2.3 Long press sur un message
1. **Long press** (maintenir 0.5s) sur un message
2. **Menu contextuel apparaît** :
   ```
   ┌─────────────────┐
   │ ✏️ Modifier     │
   │ 📋 Copier       │
   │ ↗️ Transférer   │
   │ 🗑️ Supprimer   │
   └─────────────────┘
   ```
3. **Tap sur une action** → Exécution
4. **Tap ailleurs** → Menu se ferme

### ⌨️ Étape 3 : Gestion du Clavier Virtuel

#### 3.1 Ouverture du clavier
1. **Tap dans le champ de saisie**
2. **Clavier virtuel s'ouvre** (300-400ms)
3. **Adaptation automatique** :
   - Zone de chat s'ajuste en hauteur
   - Scroll automatique vers le bas
   - Champ de saisie reste visible
   - Menu en bas reste fixé

#### 3.2 Saisie de texte
1. Utilisateur tape son message
2. **Hauteur viewport adaptée** :
   ```
   Avant : 100vh (812px sur iPhone 12)
   Après : calc(100vh - 336px) = 476px
   ```
3. **Zone de chat** : 40vh
4. **Pas de défilement indésirable**

#### 3.3 Fermeture du clavier
1. **Tap sur ➤ Envoyer**
2. Message envoyé
3. **Clavier se ferme automatiquement**
4. **Layout revient à la normale** :
   - Zone de chat reprend sa hauteur complète
   - Transition smooth

### 📐 Étape 4 : Orientation

#### 4.1 Mode Portrait (vertical)
**Layout par défaut** :
- Largeur : 100%
- Menu en bas : visible
- Conversations : plein écran
- Optimal pour chat et navigation

#### 4.2 Basculer en Mode Paysage
1. **Utilisateur tourne son téléphone** 📱➜📱
2. **Détection automatique** (orientation change event)
3. **Layout s'adapte** (0.2s) :
   - Hauteur réduite
   - Largeur augmentée
   - Zone de chat : Height ajustée
   - Menu reste en bas mais plus compact

#### 4.3 Appels vidéo en paysage
1. En appel vidéo
2. Basculer en paysage
3. **Vidéo s'adapte** :
   - Prend toute la largeur
   - Meilleure utilisation de l'espace
   - Vidéo locale repositionnée
   - Contrôles en bas

### 🔋 Étape 5 : Optimisations Performances Mobile

#### 5.1 Lazy Loading
- **Images** chargées progressivement
- Au scroll : Les images visibles se chargent
- Placeholder avant chargement
- Économie de données et batterie

#### 5.2 Scroll Optimisé
- **Momentum scroll** activé (iOS)
- Events passifs pour performance
- Pas de lag au défilement
- Smooth experience

#### 5.3 Animations GPU
- Transitions utilisent `transform` et `opacity`
- Accélération matérielle
- 60 FPS maintenu
- Pas de jank

---

## Parcours 8 : Déconnexion

### 🚪 Étape 1 : Se Déconnecter

#### 1.1 Initier la déconnexion
1. Clic sur l'icône **Déconnexion** (🚪)
2. **Options** :
   - Desktop : Dans le menu latéral
   - Mobile : Dans le menu en bas (dernière icône)

#### 1.2 Confirmation (optionnel)
1. **Modal de confirmation** peut s'afficher :
   ```
   Êtes-vous sûr de vouloir vous déconnecter ?
   
   [Annuler]  [Se déconnecter]
   ```
2. Clic sur **"Se déconnecter"**

#### 1.3 Processus de déconnexion
1. **Session terminée** :
   - Token JWT invalidé
   - Socket.io déconnecté
   - LocalStorage vidé
   - État utilisateur réinitialisé
2. **Redirection** : `/login`
3. **Message de succès** : *"Vous êtes déconnecté"*

### 🔄 Étape 2 : Après Déconnexion

#### 2.1 Page de connexion
- Formulaire de connexion vide
- Option "Se souvenir de moi" (si implémentée)
- Lien "Mot de passe oublié ?"
- Lien "Créer un compte"

#### 2.2 Reconnexion
1. Entre ses identifiants
2. Clic sur "Se connecter"
3. **Retour à l'application** :
   - Conversations restaurées
   - Contacts chargés
   - Derniers messages affichés

---

## 📊 Résumé des Flux Principaux

### Schéma de Navigation Globale

```
        🏠 PAGE D'ACCUEIL
              ↓
    ┌─────────┴─────────┐
    ↓                   ↓
📝 INSCRIPTION     🔐 CONNEXION
    ↓                   ↓
    └────────┬──────────┘
             ↓
       💬 APPLICATION
             ↓
    ┌────────┼────────┐
    ↓        ↓        ↓
👤 PROFIL  💬 CHATS  👥 GROUPES
    ↓        ↓        ↓
    ↓    ┌───┴───┐    ↓
    ↓    ↓       ↓    ↓
    ↓  📝 MSG  📞 TEL  ↓
    ↓    ↓       ↓    ↓
    └────┼───────┼────┘
         ↓       ↓
      📎 FICHIERS
         ↓
      ⚙️ PARAMÈTRES
         ↓
      🚪 DÉCONNEXION
```

### Temps Moyen par Action

| Action | Temps Moyen | Complexité |
|--------|-------------|------------|
| **Inscription** | 2-3 minutes | ⭐⭐ |
| **Connexion** | 15 secondes | ⭐ |
| **Ajout contact** | 30 secondes | ⭐ |
| **Premier message** | 5-10 secondes | ⭐ |
| **Créer groupe** | 1-2 minutes | ⭐⭐ |
| **Appel audio** | 5 secondes (lancement) | ⭐ |
| **Appel vidéo** | 10 secondes (setup) | ⭐⭐ |
| **Envoyer fichier** | 10-60 secondes | ⭐⭐ |
| **Modifier profil** | 30-60 secondes | ⭐ |

### Fréquence d'Utilisation

**Actions Quotidiennes** :
- ✅ Envoyer/Recevoir messages
- ✅ Consulter conversations
- ✅ Vérifier notifications
- ✅ Appels audio/vidéo

**Actions Hebdomadaires** :
- ⚙️ Modifier paramètres
- 👥 Gérer groupes
- 📇 Ajouter contacts

**Actions Mensuelles** :
- 👤 Mettre à jour profil
- 🗑️ Nettoyer conversations anciennes

---

## 🎯 Points Clés d'Expérience Utilisateur

### ✅ Forces de l'Application

1. **Temps Réel**
   - Messages instantanés (Socket.io)
   - Indicateurs de frappe
   - Notifications immédiates

2. **Interface Intuitive**
   - Navigation claire
   - Icônes reconnaissables
   - Actions évidentes

3. **Responsive**
   - Desktop : Layout multi-colonnes
   - Tablette : Layout adaptatif
   - Mobile : Menu en bas, navigation optimisée

4. **Fonctionnalités Complètes**
   - Chat 1-to-1
   - Groupes
   - Appels audio/vidéo
   - Partage de fichiers
   - Personnalisation

5. **Performance**
   - Chargement rapide
   - Scroll fluide
   - Animations smooth
   - Optimisé mobile

### 🎨 Design Pattern Utilisés

1. **Bottom Navigation** (Mobile)
   - Accès rapide aux fonctions principales
   - Toujours visible
   - Retour tactile

2. **Swipe Gestures**
   - Retour arrière naturel
   - Navigation intuitive
   - Gain de place (pas de bouton)

3. **Floating Action Button**
   - Ajouter contact : +
   - Créer groupe : +
   - Action principale visible

4. **Modal/Overlay**
   - Appels entrants
   - Confirmations
   - Formulaires

5. **Skeleton Loading**
   - Placeholders lors du chargement
   - Perception de rapidité
   - UX améliorée

---

## 🔮 Parcours Futurs (Améliorations Possibles)

### 📋 Fonctionnalités Envisagées

1. **Messages Vocaux**
   - Enregistrement audio
   - Lecture inline
   - Transcription automatique

2. **Statuts / Stories**
   - Partage de photos 24h
   - Vidéos courtes
   - Vue par tous les contacts

3. **Appels de Groupe**
   - Vidéoconférence jusqu'à 8 personnes
   - Partage d'écran
   - Chat pendant l'appel

4. **Réactions aux Messages**
   - Emoji rapides : ❤️ 👍 😂 😮 😢 🙏
   - Visible pour tous
   - Compteur de réactions

5. **Mode Hors Ligne**
   - Service Worker
   - Cache des messages
   - Sync en arrière-plan

6. **Recherche Avancée**
   - Filtres : Date, Contact, Type de fichier
   - Recherche globale
   - Résultats surlignés

7. **Chiffrement End-to-End**
   - Sécurité renforcée
   - Badge "Chiffré" 🔒
   - Conversations privées

---

## 📈 Métriques de Succès

### KPI Utilisateur

1. **Engagement**
   - Taux de connexion quotidien : > 60%
   - Messages par utilisateur/jour : > 20
   - Durée de session : > 15 min

2. **Adoption**
   - Temps pour premier message : < 5 min
   - Taux de complétion profil : > 70%
   - Contacts ajoutés (7 jours) : > 5

3. **Satisfaction**
   - Taux d'utilisation appels : > 30%
   - Partage de fichiers : > 10/jour
   - Groupes créés : > 2/utilisateur

---

**🎉 L'utilisateur bénéficie d'une expérience complète de communication moderne, fluide sur tous les appareils, avec des fonctionnalités riches et une interface intuitive.**

---

*Document créé le : 8 Octobre 2025*  
*Version : 1.0*  
*Projet : GbêrêTalk - Application de Chat Temps Réel*

