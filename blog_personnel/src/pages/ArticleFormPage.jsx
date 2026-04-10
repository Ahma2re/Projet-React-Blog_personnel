import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { articleService } from '../services/api';

export default function ArticleFormPage() {
  const { id } = useParams();
  const isEdit = !!id;
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', content: '', isPublic: true, allowComments: true });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEdit) {
      articleService.getArticle(parseInt(id))
        .then(a => setForm({ title: a.title, content: a.content, isPublic: a.isPublic, allowComments: a.allowComments }))
        .catch(() => navigate('/articles'));
    }
  }, [id, isEdit]);

  const handle = e => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm(f => ({ ...f, [e.target.name]: val }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      if (isEdit) {
        await articleService.updateArticle(parseInt(id), user.id, form);
      } else {
        await articleService.createArticle(user.id, user.username, form);
      }
      navigate('/articles');
    } catch (err) {
      setError(typeof err === 'string' ? err : 'Erreur lors de la sauvegarde');
    } finally { setLoading(false); }
  };

  return (
    <div className="fade-in" style={{ maxWidth: 700 }}>
      <div className="d-flex align-items-center gap-3 mb-4">
        <button className="btn btn-sm btn-outline-secondary" onClick={() => navigate(-1)}>
          <i className="bi bi-arrow-left"></i>
        </button>
        <h2 className="mb-0">{isEdit ? "Modifier l'article" : 'Nouvel article'}</h2>
      </div>
      <div className="card p-4">
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={submit}>
          <div className="mb-3">
            <label className="form-label fw-semibold">Titre <span className="text-danger">*</span></label>
            <input name="title" className="form-control form-control-lg" value={form.title} onChange={handle} required placeholder="Un titre accrocheur..." />
          </div>
          <div className="mb-3">
            <label className="form-label fw-semibold">Contenu <span className="text-danger">*</span></label>
            <textarea name="content" className="form-control" rows={10} value={form.content} onChange={handle} required placeholder="Rédigez votre article ici..." />
          </div>
          <div className="row g-3 mb-4">
            <div className="col-md-6">
              <div className="card p-3">
                <div className="form-check form-switch">
                  <input className="form-check-input" type="checkbox" name="isPublic" id="isPublic" checked={form.isPublic} onChange={handle} />
                  <label className="form-check-label" htmlFor="isPublic">
                    <i className={`bi ${form.isPublic ? 'bi-globe text-success' : 'bi-lock text-danger'} me-2`}></i>
                    <strong>{form.isPublic ? 'Public' : 'Privé'}</strong>
                    <div className="text-muted small">{form.isPublic ? 'Visible par vos amis' : 'Visible uniquement par vous'}</div>
                  </label>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card p-3">
                <div className="form-check form-switch">
                  <input className="form-check-input" type="checkbox" name="allowComments" id="allowComments" checked={form.allowComments} onChange={handle} />
                  <label className="form-check-label" htmlFor="allowComments">
                    <i className={`bi ${form.allowComments ? 'bi-chat-dots text-success' : 'bi-chat-slash text-danger'} me-2`}></i>
                    <strong>{form.allowComments ? 'Commentaires activés' : 'Commentaires désactivés'}</strong>
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div className="d-flex gap-2">
            <button type="submit" className="btn btn-accent" disabled={loading}>
              {loading ? <span className="spinner-border spinner-border-sm me-2"></span> : null}
              <i className="bi bi-check-lg me-1"></i>{isEdit ? 'Enregistrer' : 'Publier'}
            </button>
            <button type="button" className="btn btn-outline-secondary" onClick={() => navigate(-1)}>Annuler</button>
          </div>
        </form>
      </div>
    </div>
  );
}
