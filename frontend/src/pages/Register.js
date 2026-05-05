import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api/axios';

export default function Register() {
  const [form,    setForm]    = useState({ name: '', email: '', password: '', confirm: '' });
  const [error,   setError]   = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');

    if (!form.name.trim())
      return setError('Please enter your full name');
    if (!form.email.trim())
      return setError('Please enter your email');
    if (form.password.length < 6)
      return setError('Password must be at least 6 characters');
    if (form.password !== form.confirm)
      return setError('Passwords do not match');

    setLoading(true);
    try {
      await API.post('/api/auth/register', {
        name:     form.name.trim(),
        email:    form.email.trim().toLowerCase(),
        password: form.password
      });

      // Show success, then redirect to login after 2 seconds
      setSuccess(' Account created successfully! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);

    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      {/* Left panel */}
      <div style={styles.left}>
        <div style={styles.brand}>
          <div style={styles.logo}>🎓</div>
          <h1 style={styles.brandName}>Join P2P Tutoring</h1>
          <p style={styles.brandSub}>Your academic community awaits.</p>
          <div style={styles.featureList}>
            <div style={styles.feature}>✦ Free to join, always</div>
            <div style={styles.feature}>✦ Post & answer questions</div>
            <div style={styles.feature}>✦ Upload study materials</div>
            <div style={styles.feature}>✦ Build your reputation</div>
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div style={styles.right}>
        <div style={styles.card}>
          <h2 style={styles.title}>Create account</h2>
          <p style={styles.subtitle}>Fill in your details to get started</p>

          {/* Error message */}
          {error && (
            <div style={styles.errorBox}>⚠ {error}</div>
          )}

          {/* Success message */}
          {success && (
            <div style={styles.successBox}>{success}</div>
          )}

          {/* Hide form after success */}
          {!success && (
            <form onSubmit={handleSubmit}>
              <div style={styles.fieldGroup}>
                <label style={styles.label}>Full Name</label>
                <input
                  placeholder="e.g. Varshita Sharma"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  style={styles.input}
                  required
                />
              </div>

              <div style={styles.fieldGroup}>
                <label style={styles.label}>Email address</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  style={styles.input}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div style={styles.fieldGroup}>
                  <label style={styles.label}>Password</label>
                  <input
                    type="password"
                    placeholder="Min 6 chars"
                    value={form.password}
                    onChange={e => setForm({ ...form, password: e.target.value })}
                    style={styles.input}
                    required
                  />
                </div>
                <div style={styles.fieldGroup}>
                  <label style={styles.label}>Confirm Password</label>
                  <input
                    type="password"
                    placeholder="Repeat password"
                    value={form.confirm}
                    onChange={e => setForm({ ...form, confirm: e.target.value })}
                    style={styles.input}
                    required
                  />
                </div>
              </div>

              <button type="submit" style={styles.btn} disabled={loading}>
                {loading ? 'Creating account...' : 'Create Account →'}
              </button>
            </form>
          )}

          <div style={styles.divider}>
            <span style={styles.dividerLine} />
            <span style={styles.dividerText}>or</span>
            <span style={styles.dividerLine} />
          </div>

          <div style={styles.loginBox}>
            <span style={styles.loginText}>Already have an account? </span>
            <Link to="/login" style={styles.loginLink}>Sign in</Link>
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
  brandName: { fontSize: '36px', fontWeight: '800', margin: '0 0 8px', color: '#fff' },
  brandSub:  { fontSize: '16px', color: '#a0aec0', margin: '0 0 40px' },
  featureList: { display: 'flex', flexDirection: 'column', gap: '14px' },
  feature:   { fontSize: '15px', color: '#cbd5e0' },
  right:     { flex: 1, background: '#f7f8fc', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' },
  card:      { background: '#fff', borderRadius: '16px', padding: '44px', width: '100%', maxWidth: '460px', boxShadow: '0 8px 40px rgba(0,0,0,0.10)' },
  title:     { fontSize: '28px', fontWeight: '800', color: '#1a1a2e', margin: '0 0 6px' },
  subtitle:  { fontSize: '15px', color: '#718096', margin: '0 0 24px' },
  errorBox:  { background: '#fff5f5', border: '1px solid #fed7d7', color: '#c53030', borderRadius: '8px', padding: '12px 16px', marginBottom: '20px', fontSize: '14px' },
  successBox:{ background: '#f0fff4', border: '1px solid #9ae6b4', color: '#276749', borderRadius: '8px', padding: '16px', marginBottom: '20px', fontSize: '15px', fontWeight: '600', textAlign: 'center' },
  fieldGroup:{ marginBottom: '16px' },
  label:     { display: 'block', fontSize: '13px', fontWeight: '600', color: '#4a5568', marginBottom: '6px' },
  input:     { width: '100%', padding: '12px 14px', fontSize: '15px', border: '1.5px solid #e2e8f0', borderRadius: '8px', boxSizing: 'border-box', color: '#1a1a2e' },
  btn:       { width: '100%', padding: '13px', fontSize: '16px', fontWeight: '700', background: 'linear-gradient(135deg, #e94560, #c73652)', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', marginTop: '8px' },
  divider:   { display: 'flex', alignItems: 'center', gap: '12px', margin: '24px 0 20px' },
  dividerLine: { flex: 1, height: '1px', background: '#e2e8f0' },
  dividerText: { fontSize: '13px', color: '#a0aec0' },
  loginBox:  { textAlign: 'center' },
  loginText: { fontSize: '15px', color: '#718096' },
  loginLink: { fontSize: '15px', color: '#e94560', fontWeight: '700', textDecoration: 'none' },
};