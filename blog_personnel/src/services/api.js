import axios from 'axios';

// ─── Configuration Axios ──────────────────────────────────────────────────────

const api = axios.create({
  baseURL: 'http://localhost:5000',
  headers: { 'Content-Type': 'application/json' },
});

// Injecte le token JWT dans chaque requête automatiquement
api.interceptors.request.use(config => {
  const token = localStorage.getItem('blog_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Redirige vers /login si le token est expiré ou invalide
api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('blog_user');
      localStorage.removeItem('blog_token');
      window.location.href = '/login';
    }
    return Promise.reject(err.response?.data?.error || 'Erreur réseau');
  }
);

// ─── AUTH ─────────────────────────────────────────────────────────────────────

export const authService = {
  async login(username, password) {
    const { data } = await api.post('/api/auth/login', { username, password });
    return data; // { user, token }
  },

  async register(fullName, username, password) {
    const { data } = await api.post('/api/auth/register', { fullName, username, password });
    return data; // { user, token }
  },

  async getMe() {
    const { data } = await api.get('/api/auth/me');
    return data;
  },
};

// ─── ARTICLES ─────────────────────────────────────────────────────────────────

export const articleService = {
  async getMyArticles() {
    const { data } = await api.get('/api/articles/mine');
    return data;
  },

  async getFeedArticles() {
    const { data } = await api.get('/api/articles/feed');
    return data;
  },

  async getArticle(id) {
    const { data } = await api.get(`/api/articles/${id}`);
    return data;
  },

  async createArticle(userId, authorName, articleData) {
    const { data } = await api.post('/api/articles', {
      title:          articleData.title,
      content:        articleData.content,
      isPublic:       articleData.isPublic,
      allowComments:  articleData.allowComments,
    });
    return data;
  },

  async updateArticle(articleId, userId, updates) {
    const { data } = await api.put(`/api/articles/${articleId}`, {
      title:          updates.title,
      content:        updates.content,
      isPublic:       updates.isPublic,
      allowComments:  updates.allowComments,
    });
    return data;
  },

  async deleteArticle(articleId, userId) {
    const { data } = await api.delete(`/api/articles/${articleId}`);
    return data;
  },

  async addComment(articleId, authorName, content) {
    const { data } = await api.post(`/api/articles/${articleId}/comments`, { content });
    return data;
  },
};

// ─── FRIENDS ──────────────────────────────────────────────────────────────────

export const friendService = {
  async searchUsers(query, currentUserId) {
    const { data } = await api.get(`/api/friends/search?q=${encodeURIComponent(query)}`);
    return data;
  },

  async sendRequest(requesterId, receiverId) {
    const { data } = await api.post('/api/friends/request', { receiverId });
    return data;
  },

  async getPendingRequests(userId) {
    const { data } = await api.get('/api/friends/requests/pending');
    return data;
  },

  async respondToRequest(friendshipId, action) {
    const { data } = await api.put(`/api/friends/request/${friendshipId}/respond`, { action });
    return data;
  },

  async getMyFriends(userId) {
    const { data } = await api.get('/api/friends');
    return data;
  },

  async removeFriend(friendshipId) {
    const { data } = await api.delete(`/api/friends/${friendshipId}`);
    return data;
  },

  async blockUser(friendshipId, blockerId) {
    const { data } = await api.put(`/api/friends/${friendshipId}/block`);
    return data;
  },
};
