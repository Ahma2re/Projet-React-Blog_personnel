import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { friendService } from '../services/api';

export default function FriendsPage() {
  const { user } = useAuth();
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    friendService.getMyFriends(user.id).then(data => { setFriends(data); setLoading(false); });
  };
  useEffect(load, [user.id]);

  const handleRemove = async (friendshipId) => {
    if (!window.confirm('Retirer cet ami ?')) return;
    await friendService.removeFriend(friendshipId);
    setFriends(f => f.filter(x => x.friendshipId !== friendshipId));
  };

  const handleBlock = async (friendshipId) => {
    if (!window.confirm('Bloquer cet utilisateur ?')) return;
    await friendService.blockUser(friendshipId, user.id);
    setFriends(f => f.filter(x => x.friendshipId !== friendshipId));
  };

  return (
    <div className="fade-in">
      <h2 className="mb-4">Mes amis <span className="badge bg-secondary fs-6 ms-2">{friends.length}</span></h2>
      {loading ? (
        <div className="text-center py-5"><span className="spinner-border text-danger"></span></div>
      ) : friends.length === 0 ? (
        <div className="text-center py-5 text-muted">
          <i className="bi bi-people fs-1 d-block mb-3"></i>
          <p>Vous n'avez pas encore d'amis.</p>
        </div>
      ) : (
        <div className="row g-3">
          {friends.map(f => (
            <div key={f.friendshipId} className="col-md-6 col-lg-4">
              <div className="card p-3 d-flex flex-row align-items-center gap-3">
                <div className="avatar avatar-lg flex-shrink-0">{f.fullName?.[0]?.toUpperCase()}</div>
                <div className="flex-grow-1">
                  <div className="fw-semibold">{f.fullName}</div>
                  <div className="text-muted small">@{f.username}</div>
                </div>
                <div className="d-flex flex-column gap-1">
                  <button className="btn btn-sm btn-outline-warning" onClick={() => handleRemove(f.friendshipId)} title="Retirer">
                    <i className="bi bi-person-dash"></i>
                  </button>
                  <button className="btn btn-sm btn-outline-danger" onClick={() => handleBlock(f.friendshipId)} title="Bloquer">
                    <i className="bi bi-ban"></i>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
