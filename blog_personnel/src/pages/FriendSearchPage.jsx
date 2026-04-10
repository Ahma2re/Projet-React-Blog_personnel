import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { friendService } from '../services/api';

export default function FriendSearchPage() {
  const { user } = useAuth();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState({});

  const search = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    const data = await friendService.searchUsers(query, user.id);
    setResults(data);
    setSearched(true);
    setLoading(false);
  };

  const sendRequest = async (receiverId) => {
    try {
      await friendService.sendRequest(user.id, receiverId);
      setSent(s => ({ ...s, [receiverId]: true }));
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="fade-in" style={{ maxWidth: 600 }}>
      <h2 className="mb-4">Rechercher des utilisateurs</h2>
      <div className="card p-4 mb-4">
        <form onSubmit={search} className="d-flex gap-2">
          <input
            className="form-control"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Rechercher par nom d'utilisateur..."
          />
          <button className="btn btn-accent" disabled={loading}>
            {loading ? <span className="spinner-border spinner-border-sm"></span> : <i className="bi bi-search"></i>}
          </button>
        </form>
      </div>

      {searched && (
        results.length === 0 ? (
          <div className="text-center text-muted py-4">
            <i className="bi bi-person-x fs-2 d-block mb-2"></i>
            Aucun utilisateur trouvé pour "{query}"
          </div>
        ) : (
          <div className="d-flex flex-column gap-2">
            {results.map(u => (
              <div key={u.id} className="card p-3 d-flex flex-row align-items-center gap-3">
                <div className="avatar avatar-lg flex-shrink-0">{u.fullName?.[0]?.toUpperCase()}</div>
                <div className="flex-grow-1">
                  <div className="fw-semibold">{u.fullName}</div>
                  <div className="text-muted small">@{u.username}</div>
                </div>
                <button
                  className="btn btn-sm btn-accent"
                  onClick={() => sendRequest(u.id)}
                  disabled={sent[u.id]}
                >
                  {sent[u.id] ? (
                    <><i className="bi bi-check-lg me-1"></i>Envoyé</>
                  ) : (
                    <><i className="bi bi-person-plus me-1"></i>Ajouter</>
                  )}
                </button>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
}
