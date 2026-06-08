import { useState, useEffect, useCallback } from 'react';
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
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span className={`nk-tier-badge ${TIER_CLASS[tier]}`}>{TIER_LABEL[tier]}</span>
              <button className="nk-auth-btn signed-in" onClick={signOut}>
                {user.email.split('@')[0]}
              </button>
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
    </div>
  );
}
