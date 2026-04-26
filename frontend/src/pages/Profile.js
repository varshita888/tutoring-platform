import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [myQuestions, setMyQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/questions', { params: { limit: 100 } })
      .then(res => {
        const mine = res.data.questions.filter(q => q.author?._id === user?._id);
        setMyQuestions(mine);
      })
      .finally(() => setLoading(false));
  }, [user]);

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <div style={styles.page}>
      {/* Profile card */}
      <div style={styles.profileCard}>
        <div style={styles.avatarCircle}>
          {user?.name?.charAt(0).toUpperCase()}
        </div>
        <div style={styles.profileInfo}>
          <h2 style={styles.name}>{user?.name}</h2>
          <p style={styles.email}>📧 {user?.email}</p>
          <p style={styles.meta}>🎓 Student · Member since {new Date().getFullYear()}</p>
        </div>
        <button onClick={handleLogout} style={styles.logoutBtn}>
          ⎋ Logout
        </button>
      </div>

      {/* Stats row */}
      <div style={styles.statsRow}>
        <div style={styles.statCard}>
          <div style={styles.statNum}>{myQuestions.length}</div>
          <div style={styles.statLabel}>Questions Asked</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statNum}>{myQuestions.filter(q => q.isSolved).length}</div>
          <div style={styles.statLabel}>Solved</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statNum}>{user?.reputation ?? 0}</div>
          <div style={styles.statLabel}>Reputation</div>
        </div>
      </div>

      {/* My Questions */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>My Questions</h3>
        {loading ? <p>Loading...</p> : myQuestions.length === 0
          ? <p style={{ color: '#888' }}>You haven't asked any questions yet.</p>
          : myQuestions.map(q => (
            <div key={q._id} style={styles.qCard}
              onClick={() => navigate(`/questions/${q._id}`)}>
              <div style={styles.qTitle}>{q.title}</div>
              <div style={styles.qMeta}>
                <span style={q.isSolved ? styles.solved : styles.open}>
                  {q.isSolved ? ' Solved' : '○ Open'}
                </span>
                <span style={styles.qStat}>▲ {q.votes} votes</span>
                <span style={styles.qStat}>👁 {q.views} views</span>
                <span style={styles.qDate}>{new Date(q.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  );
}

const styles = {
  page: { maxWidth: '800px', margin: '0 auto', fontFamily: "'Segoe UI', sans-serif" },
  profileCard: {
    display: 'flex', alignItems: 'center', gap: '24px',
    background: 'linear-gradient(135deg, #1a1a2e, #0f3460)',
    borderRadius: '16px', padding: '32px 36px', marginBottom: '24px',
    flexWrap: 'wrap',
  },
  avatarCircle: {
    width: '72px', height: '72px', borderRadius: '50%',
    background: '#e94560', color: '#fff',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '32px', fontWeight: '800', flexShrink: 0,
  },
  profileInfo: { flex: 1 },
  name:  { fontSize: '26px', fontWeight: '800', color: '#fff', margin: '0 0 4px' },
  email: { fontSize: '15px', color: '#a0aec0', margin: '0 0 4px' },
  meta:  { fontSize: '14px', color: '#718096', margin: 0 },
  logoutBtn: {
    background: 'rgba(233,69,96,0.15)', border: '1.5px solid #e94560',
    color: '#e94560', padding: '10px 20px', borderRadius: '8px',
    cursor: 'pointer', fontWeight: '700', fontSize: '14px',
  },
  statsRow: {
    display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '16px', marginBottom: '28px',
  },
  statCard: {
    background: '#fff', border: '1.5px solid #e8e8e8',
    borderRadius: '12px', padding: '24px', textAlign: 'center',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
  },
  statNum:   { fontSize: '36px', fontWeight: '800', color: '#1a1a2e' },
  statLabel: { fontSize: '13px', color: '#718096', marginTop: '4px', fontWeight: '600' },
  section:      { background: '#fff', borderRadius: '12px', padding: '28px', border: '1.5px solid #e8e8e8' },
  sectionTitle: { fontSize: '20px', fontWeight: '800', color: '#1a1a2e', margin: '0 0 20px' },
  qCard: {
    padding: '16px', borderRadius: '8px', border: '1px solid #e8e8e8',
    marginBottom: '12px', cursor: 'pointer',
    transition: 'background 0.2s',
  },
  qTitle: { fontSize: '16px', fontWeight: '600', color: '#1a1a2e', marginBottom: '8px' },
  qMeta:  { display: 'flex', gap: '16px', flexWrap: 'wrap', fontSize: '13px' },
  solved: { color: '#38a169', fontWeight: '600' },
  open:   { color: '#718096', fontWeight: '600' },
  qStat:  { color: '#4a6fa5' },
  qDate:  { color: '#a0aec0', marginLeft: 'auto' },
};