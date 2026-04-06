import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/core/contexts/AuthContext';

export function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-20 border-b border-white/10 bg-black/30 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2">
              <span className="text-2xl font-semibold text-white">🌦️ Weather Insights</span>
            </Link>

            <div className="hidden sm:flex items-center gap-6 text-sm">
              <Link
                to="/"
                className={`transition ${
                  isActive('/')
                    ? 'text-white'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                Dashboard
              </Link>
              <Link
                to="/explore"
                className={`transition ${
                  isActive('/explore')
                    ? 'text-white'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                Insights
              </Link>
              {user?.role === 'admin' && (
                <Link
                  to="/users"
                  className={`transition ${
                    isActive('/users')
                      ? 'text-white'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  Users
                </Link>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm text-white/70">
            <span>
              Hello, <span className="text-white">{user?.name}</span>
            </span>
            <button
              onClick={handleLogout}
              className="rounded-full border border-white/20 px-3 py-1 text-white/80 transition hover:border-white/40 hover:text-white"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
