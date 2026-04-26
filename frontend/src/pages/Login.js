import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [form,    setForm]    = useState({ email: '', password: '' });
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate  = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const { data } = await API.post('/auth/login', form);
      login(data);
      navigate('/home');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally { setLoading(false); }
  };

  return (
    <div style={styles.page}>
      {/* Left panel */}
      <div style={styles.left}>
        <div style={styles.brand}>
          <div style={styles.logo}></div>
          <h1 style={styles.brandName}>P2P Tutoring</h1>
          <p style={styles.brandSub}>Learn together. Grow together.</p>
          <div style={styles.featureList}>
            <div style={styles.feature}>✦ Ask questions, get answers</div>
            <div style={styles.feature}>✦ Share study materials</div>
            <div style={styles.feature}>✦ Connect with peers</div>
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div style={styles.right}>
        <div style={styles.card}>
          <h2 style={styles.title}>Welcome back</h2>
          <p style={styles.subtitle}>Sign in to your account</p>

          {error && <div style={styles.errorBox}>⚠ {error}</div>}

          <form onSubmit={handleSubmit}>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Email address</label>
              <input
                type="email" placeholder="you@example.com"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                style={styles.input} required
              />
            </div>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Password</label>
              <input
                type="password" placeholder="••••••••"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                style={styles.input} required
              />
            </div>
            <button type="submit" style={styles.btn} disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In →'}
            </button>
          </form>

          <div style={styles.divider}>
            <span style={styles.dividerLine} />
            <span style={styles.dividerText}>or</span>
            <span style={styles.dividerLine} />
          </div>

          <div style={styles.registerBox}>
            <span style={styles.registerText}>New user? </span>
            <Link to="/register" style={styles.registerLink}>Create an account</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page:      { display: 'flex', minHeight: '100vh', fontFamily: "'Segoe UI', sans-serif" },
  left:      { flex: 1, background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px' },
  brand:     { color: '#fff', maxWidth: '360px' },
  logo:      { fontSize: '56px', marginBottom: '16px' },
  brandName: { fontSize: '38px', fontWeight: '800', margin: '0 0 8px', color: '#fff' },
  brandSub:  { fontSize: '16px', color: '#a0aec0', margin: '0 0 40px' },
  featureList: { display: 'flex', flexDirection: 'column', gap: '14px' },
  feature:   { fontSize: '15px', color: '#cbd5e0' },
  right:     { flex: 1, background: '#f7f8fc', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' },
  card:      { background: '#fff', borderRadius: '16px', padding: '48px 44px', width: '100%', maxWidth: '420px', boxShadow: '0 8px 40px rgba(0,0,0,0.10)' },
  title:     { fontSize: '28px', fontWeight: '800', color: '#1a1a2e', margin: '0 0 6px' },
  subtitle:  { fontSize: '15px', color: '#718096', margin: '0 0 28px' },
  errorBox:  { background: '#fff5f5', border: '1px solid #fed7d7', color: '#c53030', borderRadius: '8px', padding: '12px 16px', marginBottom: '20px', fontSize: '14px' },
  fieldGroup:{ marginBottom: '20px' },
  label:     { display: 'block', fontSize: '13px', fontWeight: '600', color: '#4a5568', marginBottom: '6px' },
  input:     { width: '100%', padding: '12px 14px', fontSize: '15px', border: '1.5px solid #e2e8f0', borderRadius: '8px', boxSizing: 'border-box', color: '#1a1a2e' },
  btn:       { width: '100%', padding: '13px', fontSize: '16px', fontWeight: '700', background: 'linear-gradient(135deg, #e94560, #c73652)', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', marginTop: '8px' },
  divider:   { display: 'flex', alignItems: 'center', gap: '12px', margin: '28px 0 20px' },
  dividerLine: { flex: 1, height: '1px', background: '#e2e8f0' },
  dividerText: { fontSize: '13px', color: '#a0aec0' },
  registerBox: { textAlign: 'center' },
  registerText:{ fontSize: '15px', color: '#718096' },
  registerLink:{ fontSize: '15px', color: '#e94560', fontWeight: '700', textDecoration: 'none' },
};