# Blog Personnel - Backend Flask

## ⚙️ Installation

```bash
# 1. Créer un environnement virtuel
python -m venv venv

# Windows
venv\Scripts\activate

# Mac / Linux
source venv/bin/activate

# 2. Installer les dépendances
pip install -r requirements.txt

# 3. Lancer le serveur
python run.py
```

Le serveur démarre sur **http://localhost:5000**

---

## 📁 Structure du projet

```
blog-backend/
├── app.py              # Application factory + seed data
├── run.py              # Point d'entrée
├── extensions.py       # SQLAlchemy, JWT, CORS
├── .env                # Variables d'environnement
├── requirements.txt
├── config/
│   └── settings.py     # Configuration dev/prod
├── models/
│   ├── user.py         # Modèle User
│   ├── article.py      # Modèles Article + Comment
│   └── friendship.py   # Modèle Friendship
└── routes/
    ├── auth.py         # /api/auth/*
    ├── articles.py     # /api/articles/*
    └── friends.py      # /api/friends/*
```

---

## 🔗 Endpoints API

### Auth
| Méthode | Route | Description |
|---------|-------|-------------|
| POST | /api/auth/register | Créer un compte |
| POST | /api/auth/login | Se connecter |
| GET  | /api/auth/me | Profil de l'utilisateur connecté |

### Articles
| Méthode | Route | Description |
|---------|-------|-------------|
| GET  | /api/articles/feed | Fil d'actualité |
| GET  | /api/articles/mine | Mes articles |
| POST | /api/articles | Créer un article |
| GET  | /api/articles/:id | Détail d'un article |
| PUT  | /api/articles/:id | Modifier un article |
| DELETE | /api/articles/:id | Supprimer un article |
| POST | /api/articles/:id/comments | Ajouter un commentaire |

### Amis
| Méthode | Route | Description |
|---------|-------|-------------|
| GET  | /api/friends | Liste de mes amis |
| GET  | /api/friends/search?q=... | Rechercher un utilisateur |
| POST | /api/friends/request | Envoyer une demande |
| GET  | /api/friends/requests/pending | Invitations reçues |
| PUT  | /api/friends/request/:id/respond | Accepter/refuser |
| DELETE | /api/friends/:id | Supprimer un ami |
| PUT  | /api/friends/:id/block | Bloquer |

---

## 👥 Comptes de démo
| Utilisateur | Mot de passe |
|-------------|-------------|
| alice       | alice123    |
| bob         | bob123      |
| clara       | clara123    |

---

## 🔐 Authentification

Toutes les routes protégées nécessitent un header :
```
Authorization: Bearer <token>
```
Le token est retourné lors du login/register.
