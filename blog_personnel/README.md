# Blog Personnel - Frontend React

## 🚀 Démarrage

> ⚠️ Le backend Flask doit être lancé en premier sur http://localhost:5000

```bash
npm install
npm run dev
```

L'app démarre sur **http://localhost:5173**

---

## 🧱 Architecture (MVC côté Frontend)

```
src/
├── context/
│   └── AuthContext.jsx         # State global + persistance token JWT
├── services/
│   └── api.js                  # Couche SERVICE — tous les appels vers Flask
├── components/
│   ├── common/
│   │   ├── Navbar.jsx
│   │   ├── Sidebar.jsx
│   │   └── PrivateRoute.jsx    # Guard JWT
│   └── articles/
│       └── ArticleCard.jsx
└── pages/                      # VUE
    ├── LoginPage.jsx
    ├── RegisterPage.jsx
    ├── DashboardPage.jsx
    ├── ArticlesPage.jsx
    ├── ArticleFormPage.jsx
    ├── ArticleDetailPage.jsx
    ├── FriendsPage.jsx
    ├── FriendSearchPage.jsx
    └── FriendRequestsPage.jsx
```

---

## 🎨 Stack
- React 18 + Vite
- React Router v6
- Bootstrap 5 + Bootstrap Icons
- Axios (avec intercepteurs JWT)

## 👥 Comptes de démo
| Utilisateur | Mot de passe |
|-------------|-------------|
| alice       | alice123    |
| bob         | bob123      |
| clara       | clara123    |
