import { NavLink } from 'react-router-dom';

export default function Sidebar() {
  return (
    <div className="sidebar">
      <ul className="nav flex-column">
        <li><NavLink to="/dashboard" end className={({isActive})=>"nav-link "+(isActive?"active":"")}><i className="bi bi-house-door"></i> Tableau de bord</NavLink></li>
        <li><NavLink to="/articles" end className={({isActive})=>"nav-link "+(isActive?"active":"")}><i className="bi bi-file-earmark-text"></i> Mes articles</NavLink></li>
        <li><NavLink to="/articles/new" className={({isActive})=>"nav-link "+(isActive?"active":"")}><i className="bi bi-plus-circle"></i> Nouvel article</NavLink></li>
        <hr className="border-secondary my-1" />
        <li><NavLink to="/friends" end className={({isActive})=>"nav-link "+(isActive?"active":"")}><i className="bi bi-people"></i> Mes amis</NavLink></li>
        <li><NavLink to="/friends/search" className={({isActive})=>"nav-link "+(isActive?"active":"")}><i className="bi bi-person-plus"></i> Rechercher</NavLink></li>
        <li><NavLink to="/friends/requests" className={({isActive})=>"nav-link "+(isActive?"active":"")}><i className="bi bi-bell"></i> Invitations</NavLink></li>
      </ul>
    </div>
  );
}
