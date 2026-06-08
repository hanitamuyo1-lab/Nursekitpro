import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function SiteAuthModal({ onClose }) {
  const { signIn, signUp } = useAuth();
  const [tab, setTab] = useState('signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState(null);
  const [busy, setBusy] = useState(false);

  function switchTab(t) {
    setTab(t);
    setMsg(null);
    setEmail('');
    setPassword('');
  }

  async function handleSignIn(e) {
    e.preventDefault();
    if (!email || !password) { setMsg({ err: true, text: 'Please fill in all fields.' }); return; }
    setBusy(true);
    const error = await signIn(email, password);
    if (error) {
      setMsg({ err: true, text: error.message });
    } else {
      setMsg({ err: false, text: 'Signed in!' });
      setTimeout(onClose, 700);
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
    } else {
      setMsg({ err: false, text: 'Account created! Check your email to verify, then sign in.' });
    }
    setBusy(false);
  }

  return (
    <div className="site-modal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      {/* data-auth-exempt on the modal so the interceptor never blocks its own buttons */}
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
            <input type="password" placeholder="••••••••" autoComplete={tab === 'signup' ? 'new-password' : 'current-password'} value={password} onChange={e => setPassword(e.target.value)} required />
          </div>

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
