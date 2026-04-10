import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { articleService } from '../services/api';

export default function ArticleDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    articleService.getArticle(parseInt(id))
      .then(setArticle)
      .catch(() => navigate('/dashboard'));
  }, [id]);

  const submitComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    setSubmitting(true);
    try {
      const c = await articleService.addComment(parseInt(id), user.username, comment);
      setArticle(a => ({ ...a, comments: [...(a.comments || []), c] }));
      setComment('');
    } catch (err) {
      setError(err);
    } finally { setSubmitting(false); }
  };

  if (!article) return <div className="text-center py-5"><span className="spinner-border text-danger"></span></div>;

  return (
    <div className="fade-in" style={{ maxWidth: 750 }}>
      <button className="btn btn-sm btn-outline-secondary mb-4" onClick={() => navigate(-1)}>
        <i className="bi bi-arrow-left me-1"></i>Retour
      </button>
      <div className="card p-4 mb-4">
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div>
            <span className={`badge me-2 ${article.isPublic ? 'badge-public' : 'badge-private'}`}>
              {article.isPublic ? 'Public' : 'Privé'}
            </span>
            {!article.allowComments && <span className="badge bg-secondary">Sans commentaires</span>}
          </div>
          {article.authorId === user.id && (
            <Link to={`/articles/${article.id}/edit`} className="btn btn-sm btn-outline-primary">
              <i className="bi bi-pencil me-1"></i>Modifier
            </Link>
          )}
        </div>
        <h1 className="mb-3">{article.title}</h1>
        <p className="text-muted small mb-4">
          <i className="bi bi-person me-1"></i>@{article.authorName} &nbsp;·&nbsp;
          <i className="bi bi-calendar me-1"></i>{article.createdAt}
        </p>
        <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.8 }}>{article.content}</div>
      </div>

      <div className="card p-4">
        <h5 className="mb-3"><i className="bi bi-chat-dots me-2"></i>Commentaires ({article.comments?.length || 0})</h5>
        {error && <div className="alert alert-danger py-2 small">{error}</div>}
        {article.allowComments ? (
          <form onSubmit={submitComment} className="mb-4">
            <div className="d-flex gap-2">
              <input className="form-control" value={comment} onChange={e => setComment(e.target.value)} placeholder="Laisser un commentaire..." required />
              <button className="btn btn-accent" disabled={submitting}>
                {submitting ? <span className="spinner-border spinner-border-sm"></span> : <i className="bi bi-send"></i>}
              </button>
            </div>
          </form>
        ) : (
          <div className="alert alert-secondary py-2 small">Les commentaires sont désactivés pour cet article.</div>
        )}
        {article.comments?.length === 0 ? (
          <p className="text-muted small">Aucun commentaire pour l'instant.</p>
        ) : (
          article.comments?.map(c => (
            <div key={c.id} className="d-flex gap-2 mb-3">
              <div className="avatar flex-shrink-0">{c.authorName?.[0]?.toUpperCase()}</div>
              <div className="bg-light rounded p-2 flex-grow-1">
                <div className="d-flex justify-content-between">
                  <strong className="small">@{c.authorName}</strong>
                  <small className="text-muted">{c.createdAt}</small>
                </div>
                <div className="small mt-1">{c.content}</div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
