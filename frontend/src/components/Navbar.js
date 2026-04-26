import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();

  const handleLogout = () => { logout(); navigate('/login'); };
  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

  return (
    <nav style={styles.nav}>
      <Link to="/home" style={styles.brand}> P2P Tutoring</Link>
      <div style={styles.links}>
        <Link to="/questions-list" style={{ ...styles.link, ...(isActive('/questions') ? styles.activeLink : {}) }}>
           Questions
        </Link>
        <Link to="/materials" style={{ ...styles.link, ...(isActive('/materials') ? styles.activeLink : {}) }}>
           Materials
        </Link>
        <Link to="/profile" style={{ ...styles.link, ...(isActive('/profile') ? styles.activeLink : {}) }}>
           {user?.name?.split(' ')[0]}
        </Link>
        <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    background: '#1a1a2e', padding: '14px 32px',
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    position: 'sticky', top: 0, zIndex: 100,
    boxShadow: '0 2px 12px rgba(0,0,0,0.3)',
  },
  brand: { color: '#e94560', fontWeight: '800', fontSize: '20px', textDecoration: 'none' },
  links: { display: 'flex', gap: '8px', alignItems: 'center' },
  link:  {
    color: '#a0aec0', textDecoration: 'none', fontSize: '14px', fontWeight: '500',
    padding: '7px 14px', borderRadius: '6px', transition: 'all 0.2s',
  },
  activeLink: { color: '#fff', background: 'rgba(255,255,255,0.1)' },
  logoutBtn: {
    background: 'rgba(233,69,96,0.15)', border: '1.5px solid #e94560',
    color: '#e94560', padding: '7px 14px', borderRadius: '6px',
    cursor: 'pointer', fontSize: '14px', fontWeight: '600', marginLeft: '8px',
  },
};