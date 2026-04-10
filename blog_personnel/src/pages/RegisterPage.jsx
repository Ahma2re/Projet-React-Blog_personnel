import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/api';

export default function RegisterPage() {
  const [form, setForm] = useState({ fullName: '', username: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) { setError('Les mots de passe ne correspondent pas'); return; }
    setError(''); setLoading(true);
    try {
      const { user, token } = await authService.register(form.fullName, form.username, form.password);
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
          <p className="text-muted">Créer votre compte</p>
        </div>
        {error && <div className="alert alert-danger py-2">{error}</div>}
        <form onSubmit={submit}>
          <div className="mb-3">
            <label className="form-label">Nom complet</label>
            <input name="fullName" className="form-control" value={form.fullName} onChange={handle} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Nom d'utilisateur</label>
            <input name="username" className="form-control" value={form.username} onChange={handle} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Mot de passe</label>
            <input name="password" type="password" className="form-control" value={form.password} onChange={handle} required />
          </div>
          <div className="mb-4">
            <label className="form-label">Confirmer le mot de passe</label>
            <input name="confirm" type="password" className="form-control" value={form.confirm} onChange={handle} required />
          </div>
          <button type="submit" className="btn btn-accent w-100" disabled={loading}>
            {loading ? <span className="spinner-border spinner-border-sm me-2"></span> : null}
            Créer mon compte
          </button>
        </form>
        <p className="text-center mt-3 text-muted">
          Déjà un compte ? <Link to="/login">Se connecter</Link>
        </p>
      </div>
    </div>
  );
}
