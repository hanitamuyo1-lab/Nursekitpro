import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { sb } from '../lib/supabase';
import SiteAuthModal from '../components/SiteAuthModal';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const userRef = useRef(null);

  async function loadProfile(u) {
    const { data } = await sb.from('profiles').select('*').eq('id', u.id).single();
    setProfile(data ?? { id: u.id, email: u.email, subscription_tier: 'free' });
  }

  useEffect(() => {
    sb.auth.getSession().then(({ data: { session } }) => {
      const u = session?.user ?? null;
      setUser(u);
      userRef.current = u;
      if (u) loadProfile(u).finally(() => setLoading(false));
      else setLoading(false);
    });

    const { data: { subscription } } = sb.auth.onAuthStateChange((_event, session) => {
      const u = session?.user ?? null;
      setUser(u);
      userRef.current = u;
      if (u) loadProfile(u);
      else setProfile(null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Global click interceptor — gates any button click when not logged in
  useEffect(() => {
    function interceptClick(e) {
      if (userRef.current) return; // logged in — let everything through

      // Let clicks inside the auth modal through
      if (e.target.closest('.site-modal-overlay')) return;

      // Let auth-exempt elements through (sign-in button, nav links)
      if (e.target.closest('[data-auth-exempt]')) return;

      // Only intercept actual button-like elements, not plain links/nav
      const btn = e.target.closest('button, [role="button"], input, textarea, select');
      if (!btn) return;

      e.preventDefault();
      e.stopImmediatePropagation();
      setShowModal(true);
    }

    document.addEventListener('click', interceptClick, true);
    return () => document.removeEventListener('click', interceptClick, true);
  }, []);

  async function signIn(email, password) {
    const { error } = await sb.auth.signInWithPassword({ email, password });
    return error;
  }

  async function signUp(email, password) {
    const { error } = await sb.auth.signUp({ email, password });
    return error;
  }

  async function signOut() {
    await sb.auth.signOut();
    setUser(null);
    userRef.current = null;
    setProfile(null);
  }

  const tier = profile?.subscription_tier ?? 'free';
  const isPro = tier === 'pro' || tier === 'lifetime';

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f0f4f5', fontFamily: 'Inter,sans-serif', color: '#4c6272', fontSize: 15 }}>
        Loading…
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      loading,
      tier,
      isPro,
      signIn,
      signUp,
      signOut,
      openAuthModal: () => setShowModal(true),
    }}>
      {children}
      {showModal && <SiteAuthModal onClose={() => setShowModal(false)} />}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
