# 📚 Bibliothèque - API REST avec JWT

## 📖 Description

Application de gestion de bibliothèque avec authentification JWT.

### Fonctionnalités utilisateur
- 🔐 S'inscrire et se connecter
- 📖 Voir la liste des livres
- 📚 Emprunter et retourner des livres
- 👤 Modifier son profil

### Fonctionnalités admin
- 👑 Ajouter des livres
- 🗑️ Supprimer des livres

---

## 🛠️ Technologies

**Backend :** Node.js, Express, MongoDB, Mongoose, JWT, Bcrypt  
**Frontend :** React, React Router, Axios

---

## 🚀 Installation

### 1. Cloner le projet
bash
git clone https://github.com/ton-username/hackathon-bibliotheque.git
cd hackathon-bibliotheque
### 2. Backend
bash
cd backend
npm install
Créer un fichier .env :

env
JWT_SECRET=super_secret_key_12345
PORT=5000
MONGODB_URI=mongodb://localhost:27017/library
Lancer les seeds :

bash
node seedAdmin.js
node seedBooks.js
Démarrer :

bash
npm run dev
### 3. Frontend
bash
cd ../frontend
npm install
npm start
### 4. Accès
Frontend : http://localhost:3000

Backend : http://localhost:5000

🔑 Comptes
Rôle	Email	Mot de passe
Admin	admin@bibliotheque.com	admin123
User	Crée ton propre compte	-
📡 Routes API
Méthode	Endpoint	Description	Accès
POST	/api/auth/signup	Inscription	Public
POST	/api/auth/login	Connexion	Public
GET	/api/books	Liste des livres	User + Admin
POST	/api/books	Ajouter un livre	Admin
DELETE	/api/books/:id	Supprimer un livre	Admin
POST	/api/borrows	Emprunter	User + Admin
PUT	/api/borrows/return/:id	Retourner	User + Admin
GET	/api/borrows/me	Mes emprunts	User + Admin
GET	/api/profile	Voir profil	User + Admin
PUT	/api/profile	Modifier profil	User + Admin
📁 Structure
text
hackathon-bibliotheque/
├── backend/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── server.js
│   ├── seedAdmin.js
│   └── seedBooks.js
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── App.jsx
    │   └── index.js
    └── public/
🐛 Dépannage
MongoDB ne démarre pas :

bash
mongod
Les boutons admin n'apparaissent pas :
Connecte-toi avec admin@bibliotheque.com / admin123
Vérifie que le backend tourne sur http://localhost:5000

