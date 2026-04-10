import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { friendService } from '../services/api';

export default function FriendRequestsPage() {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    friendService.getPendingRequests(user.id).then(data => { setRequests(data); setLoading(false); });
  }, [user.id]);

  const respond = async (friendshipId, action) => {
    await friendService.respondToRequest(friendshipId, action);
    setRequests(r => r.filter(x => x.id !== friendshipId));
  };

  return (
    <div className="fade-in" style={{ maxWidth: 600 }}>
      <h2 className="mb-4">Invitations reçues <span className="badge bg-danger ms-2">{requests.length}</span></h2>
      {loading ? (
        <div className="text-center py-5"><span className="spinner-border text-danger"></span></div>
      ) : requests.length === 0 ? (
        <div className="text-center text-muted py-5">
          <i className="bi bi-bell fs-1 d-block mb-2"></i>
          Aucune invitation en attente
        </div>
      ) : (
        <div className="d-flex flex-column gap-3">
          {requests.map(r => (
            <div key={r.id} className="card p-3 d-flex flex-row align-items-center gap-3">
              <div className="avatar avatar-lg flex-shrink-0">{r.requesterName?.[0]?.toUpperCase()}</div>
              <div className="flex-grow-1">
                <div className="fw-semibold">{r.requesterName}</div>
                <div className="text-muted small">@{r.requesterUsername} souhaite vous ajouter</div>
              </div>
              <div className="d-flex gap-2">
                <button className="btn btn-sm btn-success" onClick={() => respond(r.id, 'accept')}>
                  <i className="bi bi-check-lg"></i>
                </button>
                <button className="btn btn-sm btn-outline-danger" onClick={() => respond(r.id, 'reject')}>
                  <i className="bi bi-x-lg"></i>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
