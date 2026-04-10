import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => { logout(); navigate('/login'); };
  const initials = user?.fullName?.split(' ').map(n => n[0]).join('').toUpperCase() || '?';

  return (
    <nav className="navbar navbar-custom navbar-dark fixed-top px-3">
      <Link className="navbar-brand" to="/dashboard">
        <i className="bi bi-feather me-2"></i>BlogPerso
      </Link>
      {user && (
        <div className="d-flex align-items-center gap-3">
          <span className="text-white-50 d-none d-md-inline">
            <i className="bi bi-person-circle me-1"></i>{user.fullName}
          </span>
          <div className="avatar">{initials}</div>
          <button className="btn btn-sm btn-outline-light" onClick={handleLogout}>
            <i className="bi bi-box-arrow-right"></i>
          </button>
        </div>
      )}
    </nav>
  );
}
