import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/api';

export default function LoginPage() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const { user, token } = await authService.login(form.username, form.password);
      login(user, token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card fade-in">
        <div className="text-center mb-4">
          <div className="brand-title">BlogPerso</div>
          <p className="text-muted">Connexion à votre espace</p>
        </div>
        {error && <div className="alert alert-danger py-2">{error}</div>}
        <form onSubmit={submit}>
          <div className="mb-3">
            <label className="form-label fw-500">Nom d'utilisateur</label>
            <input name="username" className="form-control" value={form.username} onChange={handle} required />
          </div>
          <div className="mb-4">
            <label className="form-label fw-500">Mot de passe</label>
            <input name="password" type="password" className="form-control" value={form.password} onChange={handle} required />
          </div>
          <button type="submit" className="btn btn-accent w-100" disabled={loading}>
            {loading ? <span className="spinner-border spinner-border-sm me-2"></span> : null}
            Se connecter
          </button>
        </form>
        <p className="text-center mt-3 text-muted">
          Pas encore de compte ? <Link to="/register">S'inscrire</Link>
        </p>
        <div className="mt-3 p-2 bg-light rounded small text-muted">
          <strong>Comptes test :</strong> ahma / ahma123 — boubs / boubs123 
        </div>
      </div>
    </div>
  );
}
