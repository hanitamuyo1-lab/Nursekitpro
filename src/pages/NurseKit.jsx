import { useState, useEffect, useCallback, useRef } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { sb } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { DRUGS } from '../data/drugsData';
import '../nursekit.css';
import Calculator from '../components/nursekit/Calculator';
import DrugReference from '../components/nursekit/DrugReference';
import InteractionChecker from '../components/nursekit/InteractionChecker';
import LabInterpreter from '../components/nursekit/LabInterpreter';
import NurseKitTutor from '../components/nursekit/NurseKitTutor';

const TABS = [
  { id: 'calc', label: '⚡ Calculator' },
  { id: 'ref', label: '💊 Drug Reference' },
  { id: 'interact', label: '⚠️ Interactions' },
  { id: 'labs', label: '🔬 Lab Values' },
  { id: 'tutor', label: '🤖 AI Tutor' },
];

const TIER_LABEL = { free: 'Free', pro: 'Pro', lifetime: 'Lifetime' };
const TIER_CLASS = { free: 'tier-badge-free', pro: 'tier-badge-pro', lifetime: 'tier-badge-lifetime' };

export default function NurseKit() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, tier, signOut, openAuthModal } = useAuth();

  const [activeTab, setActiveTab] = useState(() => location.state?.tab || 'calc');
  const [initialDrugSearch, setInitialDrugSearch] = useState(() => location.state?.drugSearch || '');
  const [bookmarks, setBookmarks] = useState(() => new Set(JSON.parse(localStorage.getItem('nkp_bookmarks') || '[]')));
  const [tutorPrompt, setTutorPrompt] = useState(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (location.state?.tab || location.state?.drugSearch) {
      navigate('.', { replace: true, state: {} });
    }
  }, []);

  useEffect(() => {
    if (user) loadBookmarksFromDB(user);
  }, [user]);

  async function loadBookmarksFromDB(u) {
    const { data } = await sb.from('nursekitpro_bookmarks').select('drug_name').eq('user_id', u.id);
    if (data) {
      const bm = new Set(data.map(r => r.drug_name));
      setBookmarks(bm);
      localStorage.setItem('nkp_bookmarks', JSON.stringify([...bm]));
    }
  }

  const toggleBookmark = useCallback(async (e, name) => {
    e.stopPropagation();
    setBookmarks(prev => {
      const next = new Set(prev);
      if (next.has(name)) {
        next.delete(name);
        if (user) sb.from('nursekitpro_bookmarks').delete().eq('user_id', user.id).eq('drug_name', name);
      } else {
        next.add(name);
        if (user) {
          const sessionId = localStorage.getItem('nkp_session') || '';
          const drug = DRUGS.find(d => d.name === name);
          sb.from('nursekitpro_bookmarks').upsert(
            { user_id: user.id, session_id: sessionId, drug_name: name, drug_class: drug?.class || '', drug_spec: drug?.spec || '' },
            { onConflict: 'user_id,drug_name' }
          );
        }
      }
      localStorage.setItem('nkp_bookmarks', JSON.stringify([...next]));
      return next;
    });
  }, [user]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
    }
    if (showUserMenu) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showUserMenu]);

  async function handleDeleteAccount() {
    setDeleting(true);
    // Cancel active Stripe subscription first if on pro
    if (tier === 'pro') {
      const { data: { session } } = await sb.auth.getSession();
      await fetch('https://aovgxslluxrenozowpoo.supabase.co/functions/v1/cancel-subscription', {
        method: 'POST',
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
    }
    const { error } = await sb.rpc('delete_user');
    if (error) {
      alert('Could not delete account: ' + error.message);
      setDeleting(false);
      setDeleteConfirm(false);
      return;
    }
    await sb.auth.signOut();
    localStorage.removeItem('nkp_bookmarks');
    navigate('/');
  }

  function askTutor(prompt) {
    setTutorPrompt(prompt);
    setActiveTab('tutor');
  }

  return (
    <div className="nursekit-root">
      <div className="nk-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <Link to="/" className="nk-home-link">← Home</Link>
          <div className="nk-logo">Nurse<span>Kit</span><em>Pro</em></div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div className="nk-header-badge">v2 · 130+ Drugs</div>
          {user ? (
            <div style={{ position: 'relative' }} ref={menuRef}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span className={`nk-tier-badge ${TIER_CLASS[tier]}`}>{TIER_LABEL[tier]}</span>
                <button className="nk-auth-btn signed-in" onClick={() => setShowUserMenu(m => !m)}>
                  {user.email.split('@')[0]} ▾
                </button>
              </div>
              {showUserMenu && (
                <div style={{ position: 'absolute', right: 0, top: '110%', background: '#fff', border: '1px solid #dde5ea', borderRadius: 10, boxShadow: '0 4px 18px rgba(0,0,0,0.10)', minWidth: 180, zIndex: 100, overflow: 'hidden' }}>
                  <div style={{ padding: '10px 16px', fontSize: 12, color: '#7a8e97', borderBottom: '1px solid #f0f4f5', wordBreak: 'break-all' }}>{user.email}</div>
                  <button
                    onClick={() => { setShowUserMenu(false); signOut(); }}
                    style={{ width: '100%', padding: '11px 16px', textAlign: 'left', background: 'none', border: 'none', fontSize: 14, color: '#1a2e35', cursor: 'pointer', display: 'block' }}
                  >
                    Sign out
                  </button>
                  <button
                    onClick={() => { setShowUserMenu(false); setDeleteConfirm(true); }}
                    style={{ width: '100%', padding: '11px 16px', textAlign: 'left', background: 'none', border: 'none', fontSize: 14, color: '#e03030', cursor: 'pointer', display: 'block', borderTop: '1px solid #f0f4f5' }}
                  >
                    Delete account
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button className="nk-auth-btn" data-auth-exempt onClick={openAuthModal}>Sign In</button>
          )}
        </div>
      </div>

      <div className="nk-nav">
        {TABS.map(t => (
          <button
            key={t.id}
            className={`nk-nav-tab${activeTab === t.id ? ' active' : ''}`}
            onClick={() => setActiveTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="nk-panels">
        {activeTab === 'calc' && <Calculator />}
        {activeTab === 'ref' && (
          <DrugReference
            bookmarks={bookmarks}
            onToggleBookmark={toggleBookmark}
            onAskTutor={askTutor}
            initialSearch={initialDrugSearch}
            onInitialSearchConsumed={() => setInitialDrugSearch('')}
          />
        )}
        {activeTab === 'interact' && <InteractionChecker />}
        {activeTab === 'labs' && <LabInterpreter />}
        {activeTab === 'tutor' && (
          <NurseKitTutor
            initialPrompt={tutorPrompt}
            onPromptConsumed={() => setTutorPrompt(null)}
          />
        )}
      </div>

      {deleteConfirm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: 16 }}>
          <div style={{ background: '#fff', borderRadius: 14, padding: '32px 28px', maxWidth: 360, width: '100%', boxShadow: '0 8px 32px rgba(0,0,0,0.15)' }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: '#1a2e35', marginBottom: 10 }}>Delete your account?</h3>
            {tier === 'pro' && (
              <div style={{ background: '#fff8e1', border: '1px solid #ffe082', borderRadius: 8, padding: '10px 14px', marginBottom: 14, fontSize: 13, color: '#7a5800' }}>
                You have an active Pro subscription. Deleting your account will cancel it immediately.
              </div>
            )}
            <p style={{ fontSize: 14, color: '#4c6272', marginBottom: 24 }}>This permanently deletes your account, bookmarks, and all data. This cannot be undone.</p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={() => setDeleteConfirm(false)}
                disabled={deleting}
                style={{ flex: 1, padding: '11px 0', borderRadius: 8, border: '1.5px solid #d0dce2', background: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer', color: '#1a2e35' }}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={deleting}
                style={{ flex: 1, padding: '11px 0', borderRadius: 8, border: 'none', background: '#e03030', color: '#fff', fontSize: 14, fontWeight: 700, cursor: deleting ? 'not-allowed' : 'pointer', opacity: deleting ? 0.7 : 1 }}
              >
                {deleting ? 'Deleting…' : 'Yes, delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
