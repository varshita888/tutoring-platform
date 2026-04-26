import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ questions: 0, materials: 0 });

  useEffect(() => {
    // Fetch counts for display
    Promise.all([
      API.get('/questions', { params: { limit: 1 } }),
      API.get('/materials')
    ]).then(([qRes, mRes]) => {
      setStats({ questions: qRes.data.total || 0, materials: mRes.data.length || 0 });
    }).catch(() => {});
  }, []);

  const cards = [
    {
      icon: '❓',
      title: 'Questions',
      desc: 'Browse questions from your peers, post your own, and help others by answering.',
      stat: `${stats.questions} questions posted`,
      color: '#e94560',
      gradient: 'linear-gradient(135deg, #fff5f7, #ffe4ea)',
      border: '#fbb6c6',
      path: '/questions-list',
    },
    {
      icon: '📁',
      title: 'Materials',
      desc: 'Upload and download study materials, notes, PDFs, and presentations.',
      stat: `${stats.materials} files shared`,
      color: '#4a6fa5',
      gradient: 'linear-gradient(135deg, #f0f4ff, #dde8ff)',
      border: '#b3c9ff',
      path: '/materials',
    },
    {
      icon: '👤',
      title: 'My Profile',
      desc: 'View your activity, questions asked, answers given, and account details.',
      stat: `Welcome, ${user?.name?.split(' ')[0]}`,
      color: '#38a169',
      gradient: 'linear-gradient(135deg, #f0fff4, #d4edda)',
      border: '#9ae6b4',
      path: '/profile',
    },
  ];

  return (
    <div style={styles.page}>
      {/* Hero section */}
      <div style={styles.hero}>
        <h1 style={styles.heroTitle}>
          Hello, {user?.name?.split(' ')[0]} 
        </h1>
        <p style={styles.heroSub}>What would you like to do today?</p>
      </div>

      {/* Three main cards */}
      <div style={styles.grid}>
        {cards.map(card => (
          <div
            key={card.title}
            style={{ ...styles.card, background: card.gradient, borderColor: card.border }}
            onClick={() => navigate(card.path)}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 16px 40px rgba(0,0,0,0.12)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.06)'; }}
          >
            <div style={styles.cardIcon}>{card.icon}</div>
            <h2 style={{ ...styles.cardTitle, color: card.color }}>{card.title}</h2>
            <p style={styles.cardDesc}>{card.desc}</p>
            <div style={{ ...styles.cardStat, color: card.color }}>
              {card.stat}
            </div>
            <div style={{ ...styles.cardBtn, background: card.color }}>
              Go to {card.title} →
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  page: { fontFamily: "'Segoe UI', sans-serif" },
  hero: {
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 60%, #0f3460 100%)',
    borderRadius: '16px', padding: '48px 44px', marginBottom: '36px',
    color: '#fff',
  },
  heroTitle: { fontSize: '36px', fontWeight: '800', margin: '0 0 8px', color: '#fff' },
  heroSub:   { fontSize: '17px', color: '#a0aec0', margin: 0 },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '24px',
  },
  card: {
    border: '1.5px solid', borderRadius: '16px', padding: '36px 32px',
    cursor: 'pointer', transition: 'transform 0.25s ease, box-shadow 0.25s ease',
    boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
  },
  cardIcon:  { fontSize: '44px', marginBottom: '16px' },
  cardTitle: { fontSize: '24px', fontWeight: '800', margin: '0 0 10px' },
  cardDesc:  { fontSize: '15px', color: '#555', lineHeight: '1.6', margin: '0 0 16px' },
  cardStat:  { fontSize: '13px', fontWeight: '600', marginBottom: '20px' },
  cardBtn: {
    display: 'inline-block', padding: '10px 20px', borderRadius: '8px',
    color: '#fff', fontSize: '14px', fontWeight: '700',
  },
};