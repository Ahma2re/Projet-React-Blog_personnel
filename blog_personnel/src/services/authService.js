import api from './api';

/**
 * SERVICE AUTHENTIFICATION
 * Connecter ce service à votre API backend en remplaçant BASE_URL dans api.js
 */

// Inscription d'un nouvel utilisateur
export const register = async (fullName, username, password) => {
  const response = await api.post('/auth/register', {
    full_name: fullName,
    username,
    password,
  });
  return response.data;
};

// Connexion
export const login = async (username, password) => {
  const response = await api.post('/auth/login', { username, password });
  // Attendu : { user: {...}, token: "..." }
  return response.data;
};

// Déconnexion (optionnel côté backend)
export const logout = async () => {
  try {
    await api.post('/auth/logout');
  } catch (e) {
    // On efface le token même si la requête échoue
  }
};

// Récupérer le profil de l'utilisateur connecté
export const getProfile = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};
