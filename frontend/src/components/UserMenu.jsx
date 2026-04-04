import { useAuth } from '../contexts/useAuth';
import './UserMenu.css';

export function UserMenu() {
  const { user, logout, authEnabled } = useAuth();

  return (
    <div className="user-menu">
      <div className="user-info">
        <div className="user-avatar">
          {user?.name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase()}
        </div>
        <div className="user-details">
          <span className="user-name">{user?.name || 'User'}</span>
          <span className="user-email">
            {authEnabled ? user?.email : 'Public demo mode'}
          </span>
        </div>
      </div>
      {authEnabled ? (
        <button className="logout-button" onClick={logout}>
          Sign Out
        </button>
      ) : null}
    </div>
  );
}
