import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { articleService } from '../../services/api';

export default function ArticleCard({ article, currentUserId, onDelete }) {
  const [deleting, setDeleting] = useState(false);
  const navigate = useNavigate();
  const isOwner = article.authorId === currentUserId;

  const handleDelete = async () => {
    if (!window.confirm('Supprimer cet article ?')) return;
    setDeleting(true);
    try {
      await articleService.deleteArticle(article.id, currentUserId);
      onDelete && onDelete(article.id);
    } finally { setDeleting(false); }
  };

  return (
    <div className="card h-100 article-card">
      <div className="card-body d-flex flex-column">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <span className={`badge ${article.isPublic ? 'badge-public' : 'badge-private'}`}>
            <i className={`bi ${article.isPublic ? 'bi-globe' : 'bi-lock'} me-1`}></i>
            {article.isPublic ? 'Public' : 'Privé'}
          </span>
          {!article.allowComments && <span className="badge bg-secondary"><i className="bi bi-chat-slash me-1"></i>Sans commentaires</span>}
        </div>
        <h5 className="card-title">{article.title}</h5>
        <p className="card-text text-muted small flex-grow-1">
          {article.content.substring(0, 120)}{article.content.length > 120 ? '...' : ''}
        </p>
        <div className="d-flex align-items-center justify-content-between mt-2">
          <small className="text-muted">
            <i className="bi bi-person me-1"></i>@{article.authorName} · {article.createdAt}
          </small>
          <small className="text-muted">
            <i className="bi bi-chat me-1"></i>{article.comments?.length || 0}
          </small>
        </div>
      </div>
      <div className="card-footer bg-transparent border-top-0 d-flex gap-2">
        <Link to={`/articles/${article.id}`} className="btn btn-sm btn-outline-secondary flex-grow-1">
          <i className="bi bi-eye me-1"></i>Lire
        </Link>
        {isOwner && (
          <>
            <Link to={`/articles/${article.id}/edit`} className="btn btn-sm btn-outline-primary">
              <i className="bi bi-pencil"></i>
            </Link>
            <button className="btn btn-sm btn-outline-danger" onClick={handleDelete} disabled={deleting}>
              <i className="bi bi-trash"></i>
            </button>
          </>
        )}
      </div>
    </div>
  );
}
