import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { sb } from '../lib/supabase';

export default function ResetPassword() {
  const navigate = useNavigate();
  const [screen, setScreen] = useState('loading'); // loading | form | success | invalid
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [msg, setMsg] = useState(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    // Supabase fires PASSWORD_RECOVERY when the hash token is detected
    const { data: { subscription } } = sb.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setScreen('form');
      }
    });

    // If no recovery event fires within 3s, the link is invalid/expired
    const timer = setTimeout(() => {
      setScreen(s => s === 'loading' ? 'invalid' : s);
    }, 3000);

    return () => {
      subscription.unsubscribe();
      clearTimeout(timer);
    };
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    if (password.length < 6) { setMsg({ err: true, text: 'Password must be at least 6 characters.' }); return; }
    if (password !== confirm) { setMsg({ err: true, text: 'Passwords do not match.' }); return; }
    setBusy(true);
    const { error } = await sb.auth.updateUser({ password });
    setBusy(false);
    if (error) {
      setMsg({ err: true, text: error.message });
    } else {
      setScreen('success');
      setTimeout(() => navigate('/'), 2500);
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f0f4f5', fontFamily: 'Inter,sans-serif', padding: '0 16px' }}>
      <div style={{ background: '#fff', borderRadius: 14, padding: '40px 36px', maxWidth: 400, width: '100%', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
          <span style={{ fontWeight: 800, fontSize: 18, color: '#1a2e35' }}>Nurse<span style={{ color: '#e03030' }}>Kit</span><em style={{ fontStyle: 'normal', color: '#4c6272' }}>Pro</em></span>
        </div>

        {screen === 'loading' && (
          <p style={{ color: '#4c6272', fontSize: 15 }}>Verifying your reset link…</p>
        )}

        {screen === 'invalid' && (
          <>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: '#1a2e35', marginBottom: 8 }}>Link expired</h2>
            <p style={{ color: '#4c6272', fontSize: 14, marginBottom: 24 }}>This password reset link has expired or already been used. Please request a new one.</p>
            <Link to="/" style={{ display: 'block', background: '#e03030', color: '#fff', borderRadius: 8, padding: '12px 0', textAlign: 'center', textDecoration: 'none', fontWeight: 600, fontSize: 15 }}>
              Back to home
            </Link>
          </>
        )}

        {screen === 'form' && (
          <>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: '#1a2e35', marginBottom: 6 }}>Set a new password</h2>
            <p style={{ color: '#4c6272', fontSize: 14, marginBottom: 24 }}>Choose a strong password for your account.</p>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#2c4a57', marginBottom: 6 }}>New password (min 6 characters)</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPw ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    autoComplete="new-password"
                    required
                    style={{ width: '100%', padding: '10px 44px 10px 12px', border: '1.5px solid #d0dce2', borderRadius: 8, fontSize: 15, boxSizing: 'border-box' }}
                  />
                  <button type="button" onClick={() => setShowPw(v => !v)} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, color: '#7a8e97', fontWeight: 600 }}>
                    {showPw ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#2c4a57', marginBottom: 6 }}>Confirm new password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={confirm}
                    onChange={e => setConfirm(e.target.value)}
                    autoComplete="new-password"
                    required
                    style={{ width: '100%', padding: '10px 44px 10px 12px', border: '1.5px solid #d0dce2', borderRadius: 8, fontSize: 15, boxSizing: 'border-box' }}
                  />
                  <button type="button" onClick={() => setShowConfirm(v => !v)} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, color: '#7a8e97', fontWeight: 600 }}>
                    {showConfirm ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>
              {msg && (
                <div style={{ padding: '10px 14px', borderRadius: 8, fontSize: 13, marginBottom: 16, background: msg.err ? '#fff0f0' : '#f0fff4', color: msg.err ? '#c00' : '#1a6b3a', border: `1px solid ${msg.err ? '#fcc' : '#b2dfcc'}` }}>
                  {msg.text}
                </div>
              )}
              <button
                type="submit"
                disabled={busy}
                style={{ width: '100%', background: '#e03030', color: '#fff', border: 'none', borderRadius: 8, padding: '13px 0', fontSize: 15, fontWeight: 700, cursor: busy ? 'not-allowed' : 'pointer', opacity: busy ? 0.7 : 1 }}
              >
                {busy ? 'Updating…' : 'Set new password'}
              </button>
            </form>
          </>
        )}

        {screen === 'success' && (
          <>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: '#1a2e35', marginBottom: 8 }}>Password updated!</h2>
            <p style={{ color: '#4c6272', fontSize: 14 }}>Your password has been changed successfully. Redirecting you home…</p>
          </>
        )}
      </div>
    </div>
  );
}
