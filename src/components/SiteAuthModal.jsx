import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { sb } from '../lib/supabase';

const pwToggleStyle = {
  position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
  background: 'none', border: 'none', cursor: 'pointer', fontSize: 12,
  color: '#7a8e97', fontWeight: 600, padding: '2px 4px', lineHeight: 1,
};

export default function SiteAuthModal({ onClose }) {
  const { signIn, signUp } = useAuth();
  const [tab, setTab] = useState('signup');
  const [screen, setScreen] = useState('main');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [msg, setMsg] = useState(null);
  const [busy, setBusy] = useState(false);

  function switchTab(t) {
    setTab(t);
    setScreen('main');
    setMsg(null);
    setEmail('');
    setPassword('');
    setShowPw(false);
  }

  function openForgot() {
    setScreen('forgot');
    setMsg(null);
    setPassword('');
    setShowPw(false);
  }

  async function handleSignIn(e) {
    e.preventDefault();
    if (!email || !password) { setMsg({ err: true, text: 'Please fill in all fields.' }); return; }
    setBusy(true);
    const error = await signIn(email, password);
    if (error) {
      setMsg({ err: true, text: error.message });
    } else {
      setTimeout(onClose, 300);
    }
    setBusy(false);
  }

  async function handleSignUp(e) {
    e.preventDefault();
    if (!email || !password) { setMsg({ err: true, text: 'Please fill in all fields.' }); return; }
    if (password.length < 6) { setMsg({ err: true, text: 'Password must be at least 6 characters.' }); return; }
    setBusy(true);
    const error = await signUp(email, password);
    if (error) {
      setMsg({ err: true, text: error.message });
      setBusy(false);
      return;
    }
    // Auto sign in immediately — no email verification required
    const signInError = await signIn(email, password);
    setBusy(false);
    if (signInError) {
      setMsg({ err: false, text: 'Account created! Please sign in.' });
      switchTab('signin');
    } else {
      setTimeout(onClose, 300);
    }
  }

  async function handleForgot(e) {
    e.preventDefault();
    if (!email) { setMsg({ err: true, text: 'Please enter your email address.' }); return; }
    setBusy(true);
    const { error } = await sb.auth.resetPasswordForEmail(email, {
      redirectTo: 'https://www.nursekitpro.uk/reset-password',
    });
    setBusy(false);
    if (error) {
      setMsg({ err: true, text: error.message });
    } else {
      setScreen('forgot-sent');
    }
  }

  if (screen === 'forgot' || screen === 'forgot-sent') {
    return (
      <div className="site-modal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
        <div className="site-modal" data-auth-exempt>
          <button className="site-modal-close" onClick={onClose} aria-label="Close">×</button>
          <div className="site-modal-brand">
            <span className="brand-mark">C<em>RN</em></span>
            <span>Confident RN</span>
          </div>

          {screen === 'forgot' ? (
            <>
              <h2 className="site-modal-title">Reset your password</h2>
              <p className="site-modal-sub">Enter your email and we&apos;ll send a reset link.</p>
              <form onSubmit={handleForgot}>
                <div className="site-modal-field">
                  <label>Email address</label>
                  <input type="email" placeholder="nurse@email.com" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} required />
                </div>
                {msg && <div className={`site-modal-msg${msg.err ? ' err' : ' ok'}`}>{msg.text}</div>}
                <button type="submit" className="site-modal-submit" disabled={busy}>
                  {busy ? 'Sending…' : 'Send reset link'}
                </button>
              </form>
              <p className="site-modal-switch">
                <button type="button" onClick={() => switchTab('signin')}>← Back to sign in</button>
              </p>
            </>
          ) : (
            <>
              <h2 className="site-modal-title">Check your email</h2>
              <p className="site-modal-sub">
                We&apos;ve sent a password reset link to <strong>{email}</strong>. Click the link in the email to set a new password.
              </p>
              <p className="site-modal-sub" style={{ marginTop: 8, fontSize: 13, color: '#7a8e97' }}>
                Didn&apos;t receive it? Check your spam folder or{' '}
                <button type="button" style={{ background: 'none', border: 'none', color: '#e03030', cursor: 'pointer', padding: 0, fontSize: 13 }} onClick={() => { setScreen('forgot'); setMsg(null); }}>
                  try again
                </button>.
              </p>
              <button type="button" className="site-modal-submit" style={{ marginTop: 20 }} onClick={() => switchTab('signin')}>
                Back to sign in
              </button>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="site-modal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="site-modal" data-auth-exempt>
        <button className="site-modal-close" onClick={onClose} aria-label="Close">×</button>

        <div className="site-modal-brand">
          <span className="brand-mark">C<em>RN</em></span>
          <span>Confident RN</span>
        </div>

        <h2 className="site-modal-title">
          {tab === 'signup' ? 'Create your free account' : 'Welcome back'}
        </h2>
        <p className="site-modal-sub">
          {tab === 'signup'
            ? 'Join thousands of nursing students. Start free, upgrade anytime.'
            : 'Sign in to access your subscription and study progress.'}
        </p>

        <div className="site-modal-tabs">
          <button className={`site-modal-tab${tab === 'signup' ? ' active' : ''}`} onClick={() => switchTab('signup')}>Create Account</button>
          <button className={`site-modal-tab${tab === 'signin' ? ' active' : ''}`} onClick={() => switchTab('signin')}>Sign In</button>
        </div>

        <form onSubmit={tab === 'signin' ? handleSignIn : handleSignUp}>
          <div className="site-modal-field">
            <label>Email address</label>
            <input type="email" placeholder="nurse@email.com" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div className="site-modal-field">
            <label>{tab === 'signup' ? 'Password (min 6 characters)' : 'Password'}</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPw ? 'text' : 'password'}
                placeholder="••••••••"
                autoComplete={tab === 'signup' ? 'new-password' : 'current-password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                style={{ paddingRight: 52 }}
              />
              <button type="button" style={pwToggleStyle} onClick={() => setShowPw(v => !v)}>
                {showPw ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          {tab === 'signin' && (
            <div style={{ textAlign: 'right', marginTop: -4, marginBottom: 8 }}>
              <button type="button" onClick={openForgot} style={{ background: 'none', border: 'none', color: '#e03030', cursor: 'pointer', fontSize: 13, padding: 0 }}>
                Forgot password?
              </button>
            </div>
          )}

          {msg && (
            <div className={`site-modal-msg${msg.err ? ' err' : ' ok'}`}>{msg.text}</div>
          )}

          <button type="submit" className="site-modal-submit" disabled={busy}>
            {busy ? 'Please wait…' : tab === 'signin' ? 'Sign In' : 'Create Free Account'}
          </button>
        </form>

        {tab === 'signup' && (
          <p className="site-modal-switch">
            Already have an account?{' '}
            <button type="button" onClick={() => switchTab('signin')}>Sign in</button>
          </p>
        )}
        {tab === 'signin' && (
          <p className="site-modal-switch">
            Don&apos;t have an account?{' '}
            <button type="button" onClick={() => switchTab('signup')}>Create one free</button>
          </p>
        )}

        <div className="site-modal-plans">
          <div className="smp-item">
            <span className="smp-badge free">Free</span>
            <span>10 AI messages/day · NurseKit Pro access</span>
          </div>
          <div className="smp-item">
            <span className="smp-badge pro">Pro £2.99/mo</span>
            <span>Unlimited AI · Full NurseKit Pro</span>
          </div>
          <div className="smp-item">
            <span className="smp-badge lifetime">Lifetime £9.99</span>
            <span>Everything forever · All future updates</span>
          </div>
        </div>
      </div>
    </div>
  );
}
