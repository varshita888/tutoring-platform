import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function QuestionDetail() {
  const { id }   = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [question, setQuestion] = useState(null);
  const [answers,  setAnswers]  = useState([]);
  const [body,     setBody]     = useState('');
  const [loading,  setLoading]  = useState(true);
  const [posting,  setPosting]  = useState(false);
  const [error,    setError]    = useState('');
  const [success,  setSuccess]  = useState('');

  useEffect(() => {
    Promise.all([
      API.get(`/questions/${id}`),
      API.get(`/answers/${id}`)
    ]).then(([qRes, aRes]) => {
      setQuestion(qRes.data);
      setAnswers(aRes.data);
    }).catch(() => setError('Failed to load question'))
      .finally(() => setLoading(false));
  }, [id]);

  // Vote on question
  const voteQuestion = async () => {
    if (!user) return;
    try {
      const { data } = await API.put(`/questions/${id}/vote`);
      setQuestion(q => ({ ...q, votes: data.votes }));
    } catch { alert('Could not vote. Try again.'); }
  };

  // Vote on answer
  const voteAnswer = async (answerId) => {
    if (!user) return;
    try {
      const { data } = await API.put(`/answers/${answerId}/vote`);
      setAnswers(prev => prev.map(a =>
        a._id === answerId ? { ...a, votes: data.votes } : a
      ));
    } catch { alert('Could not vote. Try again.'); }
  };

  // Accept answer (only question author)
  const acceptAnswer = async (answerId) => {
    try {
      await API.put(`/answers/${answerId}/accept`);
      setAnswers(prev => prev.map(a => ({ ...a, isAccepted: a._id === answerId })));
      setQuestion(q => ({ ...q, isSolved: true }));
    } catch { alert('Could not accept answer.'); }
  };

  // Post a new answer
  const postAnswer = async (e) => {
    e.preventDefault();
    if (!body.trim()) return setError('Please write an answer before submitting');
    setPosting(true); setError(''); setSuccess('');
    try {
      const { data } = await API.post(`/answers/${id}`, { body });
      setAnswers(prev => [...prev, data]);
      setBody('');
      setSuccess('✅ Your answer was posted successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to post answer');
    } finally { setPosting(false); }
  };

  if (loading) return (
    <div style={{ textAlign: 'center', padding: '80px 20px' }}>
      <p style={{ color: '#718096', fontSize: '16px' }}>Loading question...</p>
    </div>
  );

  if (!question) return (
    <div style={{ textAlign: 'center', padding: '80px 20px' }}>
      <p style={{ color: '#e94560' }}>Question not found.</p>
      <button onClick={() => navigate('/questions-list')} style={styles.backBtn}>
        ← Back to Questions
      </button>
    </div>
  );

  const isQuestionAuthor = user?._id === question.author?._id;

  return (
    <div style={styles.page}>

      {/* Back button */}
      <button onClick={() => navigate('/questions-list')} style={styles.backBtn}>
        ← Back to All Questions
      </button>

      {/* ── Question Card ── */}
      <div style={styles.questionCard}>
        <div style={styles.questionInner}>

          {/* Vote button */}
          <div style={styles.voteCol}>
            <button
              onClick={voteQuestion}
              style={styles.voteBtn}
              title="Upvote this question"
            >▲</button>
            <span style={styles.voteCount}>{question.votes}</span>
            <span style={styles.voteLabel}>votes</span>
          </div>

          {/* Question content */}
          <div style={styles.questionContent}>
            <div style={styles.questionTopRow}>
              <h1 style={styles.questionTitle}>{question.title}</h1>
              {question.isSolved && (
                <span style={styles.solvedBadge}>✅ Solved</span>
              )}
            </div>

            <p style={styles.questionBody}>{question.body}</p>

            {/* Tags */}
            {question.tags?.length > 0 && (
              <div style={styles.tagsRow}>
                {question.tags.map(t => (
                  <span key={t} style={styles.tag}>{t}</span>
                ))}
              </div>
            )}

            {/* Meta */}
            <div style={styles.questionMeta}>
              <span>👤 Asked by <b>{question.author?.name}</b></span>
              <span>👁 {question.views} views</span>
              <span>🕐 {new Date(question.createdAt).toLocaleDateString('en-IN', {
                day: 'numeric', month: 'short', year: 'numeric'
              })}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Answers Section ── */}
      <div style={styles.answersHeader}>
        <h2 style={styles.answersTitle}>
          {answers.length} Answer{answers.length !== 1 ? 's' : ''}
        </h2>
        {answers.length > 0 && (
          <span style={styles.answersHint}>
            {isQuestionAuthor
              ? '✓ You can accept the best answer'
              : '▲ Vote for the most helpful answer'}
          </span>
        )}
      </div>

      {answers.length === 0 && (
        <div style={styles.noAnswers}>
          <div style={{ fontSize: '36px', marginBottom: '8px' }}>💬</div>
          <p style={{ color: '#718096', margin: 0 }}>
            No answers yet. Be the first to help!
          </p>
        </div>
      )}

      {answers.map((a, index) => (
        <div key={a._id} style={{
          ...styles.answerCard,
          borderColor: a.isAccepted ? '#38a169' : '#e8e8e8',
          borderWidth: a.isAccepted ? '2px' : '1.5px'
        }}>
          {/* Accepted banner */}
          {a.isAccepted && (
            <div style={styles.acceptedBanner}>
               Accepted Answer
            </div>
          )}

          <div style={styles.answerInner}>
            {/* Vote column */}
            <div style={styles.voteCol}>
              <button
                onClick={() => voteAnswer(a._id)}
                style={styles.voteBtn}
                title="Upvote this answer"
              >▲</button>
              <span style={styles.voteCount}>{a.votes}</span>
              <span style={styles.voteLabel}>votes</span>

              {/* Accept button — only question author sees this */}
              {isQuestionAuthor && !a.isAccepted && (
                <button
                  onClick={() => acceptAnswer(a._id)}
                  style={styles.acceptBtn}
                  title="Mark as accepted answer"
                >✓</button>
              )}
            </div>

            {/* Answer content */}
            <div style={styles.answerContent}>
              <div style={styles.answerNumber}>Answer #{index + 1}</div>
              <p style={styles.answerBody}>{a.body}</p>
              <div style={styles.answerMeta}>
                <span> Answered by <b>{a.author?.name}</b></span>
                <span> {new Date(a.createdAt).toLocaleDateString('en-IN', {
                  day: 'numeric', month: 'short', year: 'numeric'
                })}</span>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* ── Post Answer Form ── */}
      <div style={styles.formCard}>
        <h3 style={styles.formTitle}>
          {user ? ' Write Your Answer' : ' Login to Answer'}
        </h3>
        <p style={styles.formSubtitle}>
          {user
            ? `Answering as ${user.name} — be detailed and helpful`
            : 'You need to be logged in to post an answer'}
        </p>

        {error   && <div style={styles.errorBox}>⚠ {error}</div>}
        {success && <div style={styles.successBox}>{success}</div>}

        {user ? (
          <form onSubmit={postAnswer}>
            <textarea
              value={body}
              onChange={e => { setBody(e.target.value); setError(''); }}
              style={styles.textarea}
              placeholder={`Hi ${user.name}, write a clear and detailed answer here...`}
              rows={7}
            />
            <div style={styles.formFooter}>
              <span style={styles.charCount}>{body.length} characters</span>
              <button
                type="submit"
                style={{ ...styles.submitBtn, opacity: posting ? 0.7 : 1 }}
                disabled={posting}
              >
                {posting ? 'Posting...' : 'Post Answer →'}
              </button>
            </div>
          </form>
        ) : (
          <div style={styles.loginPrompt}>
            <button
              onClick={() => navigate('/login')}
              style={styles.loginPromptBtn}
            >
              Login to Answer this Question
            </button>
          </div>
        )}
      </div>

    </div>
  );
}

const styles = {
  page: { maxWidth: '860px', margin: '0 auto', fontFamily: "'Segoe UI', sans-serif" },

  backBtn: {
    background: 'none', border: 'none', color: '#4a6fa5', cursor: 'pointer',
    fontSize: '14px', fontWeight: '600', marginBottom: '20px', padding: '0',
    display: 'flex', alignItems: 'center', gap: '6px'
  },

  // Question
  questionCard: {
    border: '1.5px solid #e8e8e8', borderRadius: '14px', padding: '28px',
    background: '#fff', boxShadow: '0 4px 16px rgba(0,0,0,0.06)', marginBottom: '28px'
  },
  questionInner:   { display: 'flex', gap: '24px' },
  questionContent: { flex: 1 },
  questionTopRow:  { display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '14px', flexWrap: 'wrap' },
  questionTitle:   { fontSize: '22px', fontWeight: '800', color: '#1a1a2e', margin: 0, lineHeight: '1.4', flex: 1 },
  solvedBadge: {
    background: '#f0fff4', border: '1.5px solid #9ae6b4', color: '#276749',
    padding: '4px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: '700', whiteSpace: 'nowrap'
  },
  questionBody: { fontSize: '15px', color: '#333', lineHeight: '1.7', margin: '0 0 16px', whiteSpace: 'pre-wrap' },
  tagsRow:      { display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '16px' },
  tag: {
    background: '#eef2ff', color: '#4a6fa5', padding: '4px 12px',
    borderRadius: '20px', fontSize: '12px', fontWeight: '500'
  },
  questionMeta: { display: 'flex', gap: '20px', flexWrap: 'wrap', fontSize: '13px', color: '#718096', borderTop: '1px solid #f0f0f0', paddingTop: '12px' },

  // Vote column (shared)
  voteCol: {
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    gap: '6px', minWidth: '56px'
  },
  voteBtn: {
    background: '#f7f8fc', border: '1.5px solid #e2e8f0', borderRadius: '8px',
    width: '44px', height: '44px', fontSize: '18px', cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700',
    color: '#4a5568', transition: 'all 0.2s'
  },
  voteCount: { fontSize: '20px', fontWeight: '800', color: '#1a1a2e' },
  voteLabel: { fontSize: '11px', color: '#718096', textTransform: 'uppercase' },

  // Answers section
  answersHeader: {
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: '16px'
  },
  answersTitle: { fontSize: '20px', fontWeight: '800', color: '#1a1a2e', margin: 0 },
  answersHint:  { fontSize: '13px', color: '#718096', fontStyle: 'italic' },

  noAnswers: {
    textAlign: 'center', padding: '40px',
    background: '#f7f8fc', borderRadius: '12px',
    border: '1.5px dashed #e2e8f0', marginBottom: '24px'
  },

  answerCard: {
    border: 'solid', borderRadius: '12px', overflow: 'hidden',
    background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', marginBottom: '16px'
  },
  acceptedBanner: {
    background: '#f0fff4', borderBottom: '1.5px solid #9ae6b4',
    padding: '8px 20px', fontSize: '14px', fontWeight: '700', color: '#276749'
  },
  answerInner:   { display: 'flex', gap: '20px', padding: '20px' },
  answerContent: { flex: 1 },
  answerNumber:  { fontSize: '12px', fontWeight: '700', color: '#a0aec0', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' },
  answerBody:    { fontSize: '15px', color: '#333', lineHeight: '1.7', margin: '0 0 14px', whiteSpace: 'pre-wrap' },
  answerMeta:    { display: 'flex', gap: '20px', flexWrap: 'wrap', fontSize: '13px', color: '#718096', borderTop: '1px solid #f0f0f0', paddingTop: '10px' },

  acceptBtn: {
    marginTop: '8px', background: '#f0fff4', border: '1.5px solid #9ae6b4',
    color: '#276749', borderRadius: '8px', width: '44px', height: '44px',
    fontSize: '18px', cursor: 'pointer', fontWeight: '700',
    display: 'flex', alignItems: 'center', justifyContent: 'center'
  },

  // Answer form
  formCard: {
    border: '1.5px solid #e2e8f0', borderRadius: '14px', padding: '28px',
    background: '#fff', boxShadow: '0 4px 16px rgba(0,0,0,0.06)', marginTop: '28px'
  },
  formTitle:    { fontSize: '20px', fontWeight: '800', color: '#1a1a2e', margin: '0 0 4px' },
  formSubtitle: { fontSize: '14px', color: '#718096', margin: '0 0 20px' },

  errorBox:   { background: '#fff5f5', border: '1px solid #fed7d7', color: '#c53030', borderRadius: '8px', padding: '12px 16px', marginBottom: '16px', fontSize: '14px' },
  successBox: { background: '#f0fff4', border: '1px solid #9ae6b4', color: '#276749', borderRadius: '8px', padding: '12px 16px', marginBottom: '16px', fontSize: '14px', fontWeight: '600' },

  textarea: {
    width: '100%', padding: '14px', fontSize: '15px', lineHeight: '1.6',
    border: '1.5px solid #e2e8f0', borderRadius: '8px', boxSizing: 'border-box',
    fontFamily: "'Segoe UI', sans-serif", resize: 'vertical', color: '#1a1a2e',
    minHeight: '140px'
  },
  formFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' },
  charCount:  { fontSize: '13px', color: '#a0aec0' },
  submitBtn: {
    padding: '12px 28px', background: 'linear-gradient(135deg, #e94560, #c73652)',
    color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer',
    fontSize: '15px', fontWeight: '700'
  },

  loginPrompt:    { textAlign: 'center', padding: '20px 0' },
  loginPromptBtn: {
    padding: '12px 28px', background: '#1a1a2e', color: '#fff',
    border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '15px', fontWeight: '700'
  },
};