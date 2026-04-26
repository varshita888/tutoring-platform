import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';

export default function QuestionsList() {
  const [questions, setQuestions] = useState([]);
  const [search,    setSearch]    = useState('');
  const [tag,       setTag]       = useState('');
  const [loading,   setLoading]   = useState(true);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const { data } = await API.get('/questions', { params: { search, tag } });
      setQuestions(data.questions);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchQuestions(); }, []);

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>All Questions</h1>
          <p style={styles.subtitle}>Browse questions from everyone — answer and help your peers</p>
        </div>
        <Link to="/ask" style={styles.askBtn}>+ Ask Question</Link>
      </div>

      {/* Search Bar */}
      <div style={styles.searchRow}>
        <input
          placeholder="🔍 Search questions..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && fetchQuestions()}
          style={styles.searchInp}
        />
        <input
          placeholder=" Filter by tag..."
          value={tag}
          onChange={e => setTag(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && fetchQuestions()}
          style={{ ...styles.searchInp, maxWidth: '180px' }}
        />
        <button onClick={fetchQuestions} style={styles.searchBtn}>Search</button>
        <button onClick={() => { setSearch(''); setTag(''); setTimeout(fetchQuestions, 100); }}
          style={styles.clearBtn}>Clear</button>
      </div>

      {/* Stats bar */}
      {!loading && (
        <div style={styles.statsBar}>
          <span style={styles.statsText}>
            Showing <b>{questions.length}</b> question{questions.length !== 1 ? 's' : ''}
            {search && ` for "${search}"`}
            {tag    && ` tagged "${tag}"`}
          </span>
          <span style={styles.hint}> Click any question to read and reply</span>
        </div>
      )}

      {/* Questions */}
      {loading ? (
        <div style={styles.loadingBox}>
          <div style={styles.spinner} />
          <p style={{ color: '#718096', marginTop: '12px' }}>Loading questions...</p>
        </div>
      ) : questions.length === 0 ? (
        <div style={styles.emptyBox}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}></div>
          <h3 style={{ color: '#4a5568', margin: '0 0 8px' }}>No questions found</h3>
          <p style={{ color: '#718096', margin: '0 0 20px' }}>
            {search || tag ? 'Try different search terms' : 'Be the first to ask a question!'}
          </p>
          <Link to="/ask" style={styles.askBtn}>+ Ask the First Question</Link>
        </div>
      ) : (
        questions.map(q => (
          <Link
            to={`/questions/${q._id}`}
            key={q._id}
            style={{ textDecoration: 'none' }}
          >
            <div style={styles.card}
              onMouseEnter={e => e.currentTarget.style.borderColor = '#e94560'}
              onMouseLeave={e => e.currentTarget.style.borderColor = '#e8e8e8'}
            >
              <div style={styles.cardInner}>
                {/* Stats column */}
                <div style={styles.statsCol}>
                  <div style={styles.statItem}>
                    <span style={styles.statNum}>{q.votes}</span>
                    <span style={styles.statLabel}>votes</span>
                  </div>
                  <div style={{
                    ...styles.statItem,
                    background: q.isSolved ? '#f0fff4' : '#f7f8fc',
                    border: `1px solid ${q.isSolved ? '#9ae6b4' : '#e2e8f0'}`,
                    borderRadius: '6px', padding: '6px 10px'
                  }}>
                    <span style={{ fontSize: '16px' }}>{q.isSolved ? '✅' : '○'}</span>
                    <span style={{ ...styles.statLabel, color: q.isSolved ? '#38a169' : '#718096' }}>
                      {q.isSolved ? 'solved' : 'open'}
                    </span>
                  </div>
                  <div style={styles.statItem}>
                    <span style={styles.statNum}>{q.views}</span>
                    <span style={styles.statLabel}>views</span>
                  </div>
                </div>

                {/* Content column */}
                <div style={styles.contentCol}>
                  <h3 style={styles.qTitle}>{q.title}</h3>
                  <p style={styles.qBody}>
                    {q.body.substring(0, 150)}{q.body.length > 150 ? '...' : ''}
                  </p>

                  {/* Tags */}
                  {q.tags?.length > 0 && (
                    <div style={styles.tagsRow}>
                      {q.tags.map(t => (
                        <span key={t} style={styles.tag}>{t}</span>
                      ))}
                    </div>
                  )}

                  {/* Footer */}
                  <div style={styles.cardFooter}>
                    <span style={styles.authorText}>
                       <b>{q.author?.name}</b>
                    </span>
                    <span style={styles.dateText}>
                       {new Date(q.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric', month: 'short', year: 'numeric'
                      })}
                    </span>
                    <span style={styles.replyHint}>Click to view &amp; reply →</span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))
      )}
    </div>
  );
}

const styles = {
  page: { fontFamily: "'Segoe UI', sans-serif" },

  header: {
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'flex-start', marginBottom: '24px', flexWrap: 'wrap', gap: '16px'
  },
  title:    { fontSize: '28px', fontWeight: '800', color: '#1a1a2e', margin: '0 0 4px' },
  subtitle: { fontSize: '15px', color: '#718096', margin: 0 },

  askBtn: {
    background: 'linear-gradient(135deg, #e94560, #c73652)',
    color: '#fff', padding: '10px 20px', borderRadius: '8px',
    textDecoration: 'none', fontWeight: '700', fontSize: '14px', whiteSpace: 'nowrap'
  },

  searchRow: { display: 'flex', gap: '10px', marginBottom: '16px', flexWrap: 'wrap' },
  searchInp: {
    flex: 1, padding: '11px 16px', border: '1.5px solid #e2e8f0',
    borderRadius: '8px', fontSize: '15px', minWidth: '160px', color: '#1a1a2e'
  },
  searchBtn: {
    padding: '11px 20px', background: '#1a1a2e', color: '#fff',
    border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '700'
  },
  clearBtn: {
    padding: '11px 16px', background: '#f7f8fc', color: '#718096',
    border: '1.5px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer', fontWeight: '600'
  },

  statsBar: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    background: '#f7f8fc', border: '1px solid #e2e8f0', borderRadius: '8px',
    padding: '10px 16px', marginBottom: '20px', flexWrap: 'wrap', gap: '8px'
  },
  statsText: { fontSize: '14px', color: '#4a5568' },
  hint:      { fontSize: '13px', color: '#a0aec0', fontStyle: 'italic' },

  loadingBox: { textAlign: 'center', padding: '60px 20px' },
  spinner: {
    width: '36px', height: '36px', border: '4px solid #e2e8f0',
    borderTop: '4px solid #e94560', borderRadius: '50%',
    animation: 'spin 0.8s linear infinite', margin: '0 auto'
  },
  emptyBox: {
    textAlign: 'center', padding: '60px 20px',
    background: '#f7f8fc', borderRadius: '12px', border: '1.5px dashed #e2e8f0'
  },

  card: {
    border: '1.5px solid #e8e8e8', borderRadius: '12px', padding: '20px',
    marginBottom: '14px', background: '#fff',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
    transition: 'border-color 0.2s, box-shadow 0.2s', cursor: 'pointer'
  },
  cardInner:   { display: 'flex', gap: '20px' },

  statsCol: {
    display: 'flex', flexDirection: 'column', gap: '12px',
    alignItems: 'center', minWidth: '70px', textAlign: 'center'
  },
  statItem:  { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' },
  statNum:   { fontSize: '20px', fontWeight: '800', color: '#1a1a2e' },
  statLabel: { fontSize: '11px', color: '#718096', textTransform: 'uppercase', letterSpacing: '0.5px' },

  contentCol: { flex: 1, minWidth: 0 },
  qTitle: {
    fontSize: '17px', fontWeight: '700', color: '#1a1a2e',
    margin: '0 0 8px', lineHeight: '1.4'
  },
  qBody: {
    fontSize: '14px', color: '#555', margin: '0 0 12px',
    lineHeight: '1.6', wordBreak: 'break-word'
  },
  tagsRow: { display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '12px' },
  tag: {
    background: '#eef2ff', color: '#4a6fa5', padding: '3px 10px',
    borderRadius: '20px', fontSize: '12px', fontWeight: '500'
  },
  cardFooter: {
    display: 'flex', gap: '16px', flexWrap: 'wrap',
    alignItems: 'center', borderTop: '1px solid #f0f0f0', paddingTop: '10px'
  },
  authorText: { fontSize: '13px', color: '#4a5568' },
  dateText:   { fontSize: '13px', color: '#a0aec0' },
  replyHint:  {
    fontSize: '13px', color: '#e94560', fontWeight: '600', marginLeft: 'auto'
  },
};