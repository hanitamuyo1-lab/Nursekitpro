import { useState } from 'react';

export default function AuthModal({ supabase, onClose }) {
  const [tab, setTab] = useState('signin');
  const [siEmail, setSiEmail] = useState('');
  const [siPassword, setSiPassword] = useState('');
  const [suEmail, setSuEmail] = useState('');
  const [suPassword, setSuPassword] = useState('');
  const [msg, setMsg] = useState(null);

  async function signIn() {
    if (!siEmail || !siPassword) { setMsg({ type: 'err', text: 'Please fill in all fields.' }); return; }
    const { error } = await supabase.auth.signInWithPassword({ email: siEmail, password: siPassword });
    if (error) { setMsg({ type: 'err', text: error.message }); }
    else { setMsg({ type: 'ok', text: 'Signed in!' }); setTimeout(onClose, 800); }
  }

  async function signUp() {
    if (!suEmail || !suPassword) { setMsg({ type: 'err', text: 'Please fill in all fields.' }); return; }
    if (suPassword.length < 6) { setMsg({ type: 'err', text: 'Password must be at least 6 characters.' }); return; }
    const { error } = await supabase.auth.signUp({ email: suEmail, password: suPassword });
    if (error) { setMsg({ type: 'err', text: error.message }); }
    else { setMsg({ type: 'ok', text: 'Account created! Check your email to verify.' }); }
  }

  function switchTab(t) {
    setTab(t);
    setMsg(null);
  }

  return (
    <div className="nk-auth-overlay" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="nk-auth-modal">
        <button className="nk-auth-close" onClick={onClose}>×</button>
        <h2>NurseKit <span style={{ color: 'var(--nk-teal-light)' }}>Pro</span></h2>
        <p>Sign in to sync bookmarks and tutor history across devices</p>

        <div className="nk-auth-tabs">
          <button className={`nk-auth-tab${tab === 'signin' ? ' active' : ''}`} onClick={() => switchTab('signin')}>Sign In</button>
          <button className={`nk-auth-tab${tab === 'signup' ? ' active' : ''}`} onClick={() => switchTab('signup')}>Create Account</button>
        </div>

        {tab === 'signin' && (
          <>
            <div className="nk-auth-field">
              <label>Email</label>
              <input type="email" placeholder="nurse@email.com" autoComplete="email" value={siEmail} onChange={e => setSiEmail(e.target.value)} />
            </div>
            <div className="nk-auth-field">
              <label>Password</label>
              <input type="password" placeholder="••••••••" autoComplete="current-password" value={siPassword} onChange={e => setSiPassword(e.target.value)} />
            </div>
            <button className="nk-auth-submit" onClick={signIn}>Sign In</button>
          </>
        )}

        {tab === 'signup' && (
          <>
            <div className="nk-auth-field">
              <label>Email</label>
              <input type="email" placeholder="nurse@email.com" autoComplete="email" value={suEmail} onChange={e => setSuEmail(e.target.value)} />
            </div>
            <div className="nk-auth-field">
              <label>Password (min 6 chars)</label>
              <input type="password" placeholder="••••••••" autoComplete="new-password" value={suPassword} onChange={e => setSuPassword(e.target.value)} />
            </div>
            <button className="nk-auth-submit" onClick={signUp}>Create Account</button>
          </>
        )}

        {msg && <div className={`nk-auth-msg ${msg.type}`}>{msg.text}</div>}
      </div>
    </div>
  );
}
