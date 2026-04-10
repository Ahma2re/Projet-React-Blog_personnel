import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { articleService } from '../services/api';
import ArticleCard from '../components/articles/ArticleCard';

export default function DashboardPage() {
  const { user } = useAuth();
  const [feed, setFeed] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    articleService.getFeedArticles(user.id).then(data => { setFeed(data); setLoading(false); });
  }, [user.id]);

  const myCount = feed.filter(a => a.authorId === user.id).length;
  const friendCount = feed.filter(a => a.authorId !== user.id).length;

  return (
    <div className="fade-in">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">Bonjour, {user.fullName.split(' ')[0]} 👋</h2>
          <p className="text-muted mb-0">Voici votre fil d'actualité</p>
        </div>
        <Link to="/articles/new" className="btn btn-accent">
          <i className="bi bi-plus-lg me-1"></i> Nouvel article
        </Link>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="card stat-card">
            <div className="text-muted small">Mes articles</div>
            <div className="fs-2 fw-bold">{myCount}</div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card stat-card">
            <div className="text-muted small">Articles d'amis</div>
            <div className="fs-2 fw-bold">{friendCount}</div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card stat-card">
            <div className="text-muted small">Total dans le fil</div>
            <div className="fs-2 fw-bold">{feed.length}</div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5"><span className="spinner-border text-danger"></span></div>
      ) : feed.length === 0 ? (
        <div className="text-center py-5 text-muted">
          <i className="bi bi-file-earmark-x fs-1 d-block mb-2"></i>
          Aucun article. <Link to="/articles/new">Créez le vôtre</Link> ou <Link to="/friends/search">ajoutez des amis</Link>.
        </div>
      ) : (
        <div className="row g-3">
          {feed.map(a => <div key={a.id} className="col-md-6 col-lg-4"><ArticleCard article={a} currentUserId={user.id} onDelete={id => setFeed(f => f.filter(x => x.id !== id))} /></div>)}
        </div>
      )}
    </div>
  );
}
