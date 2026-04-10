import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { articleService } from '../services/api';
import ArticleCard from '../components/articles/ArticleCard';

export default function ArticlesPage() {
  const { user } = useAuth();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    articleService.getMyArticles(user.id).then(data => { setArticles(data); setLoading(false); });
  };
  useEffect(load, [user.id]);

  return (
    <div className="fade-in">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Mes articles</h2>
        <Link to="/articles/new" className="btn btn-accent">
          <i className="bi bi-plus-lg me-1"></i> Nouvel article
        </Link>
      </div>
      {loading ? (
        <div className="text-center py-5"><span className="spinner-border text-danger"></span></div>
      ) : articles.length === 0 ? (
        <div className="text-center py-5 text-muted">
          <i className="bi bi-file-earmark-plus fs-1 d-block mb-3"></i>
          <p>Vous n'avez pas encore d'articles.</p>
          <Link to="/articles/new" className="btn btn-accent">Créer mon premier article</Link>
        </div>
      ) : (
        <div className="row g-3">
          {articles.map(a => (
            <div key={a.id} className="col-md-6 col-lg-4">
              <ArticleCard article={a} currentUserId={user.id} onDelete={id => setArticles(p => p.filter(x => x.id !== id))} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
