import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { DRUGS } from '../data/drugsData';
import { useAuth } from '../contexts/AuthContext';

const PAGES = [
  { label: 'Home', path: '/' },
  { label: 'Features', path: '/features' },
  { label: 'AI Tutor (live demo)', path: '/features#tutor' },
  { label: 'Pricing', path: '/features#pricing' },
  { label: 'About', path: '/about' },
  { label: 'FAQ', path: '/faq' },
  { label: 'NurseKit Pro', path: '/nursekit', state: { tab: 'calc' } },
  { label: 'NurseKit — Drug Reference', path: '/nursekit', state: { tab: 'ref' } },
  { label: 'NurseKit — Interactions', path: '/nursekit', state: { tab: 'interact' } },
  { label: 'NurseKit — Lab Values', path: '/nursekit', state: { tab: 'labs' } },
  { label: 'NurseKit — AI Tutor', path: '/nursekit', state: { tab: 'tutor' } },
];

const TIER_LABEL = { free: 'Free', pro: 'Pro', lifetime: 'Lifetime' };
const TIER_CLASS = { free: 'tier-free', pro: 'tier-pro', lifetime: 'tier-lifetime' };

export default function Header() {
  const { user, tier, signOut, openAuthModal } = useAuth();
  const [query, setQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const searchRef = useRef(null);
  const menuRef = useRef(null);

  const q = query.trim().toLowerCase();
  const pageResults = q.length > 0 ? PAGES.filter(p => p.label.toLowerCase().includes(q)).slice(0, 4) : [];
  const drugResults = q.length > 1 ? DRUGS.filter(d => d.name.toLowerCase().includes(q) || d.class.toLowerCase().includes(q)).slice(0, 8) : [];
  const showDropdown = searchOpen && q.length > 0 && (pageResults.length > 0 || drugResults.length > 0);

  useEffect(() => {
    function handleClick(e) {
      if (searchRef.current && !searchRef.current.contains(e.target)) setSearchOpen(false);
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    if (!q) return;
    if (drugResults.length > 0) navigate('/nursekit', { state: { tab: 'ref', drugSearch: drugResults[0].name } });
    else if (pageResults.length > 0) { const p = pageResults[0]; navigate(p.path, p.state ? { state: p.state } : undefined); }
    setQuery(''); setSearchOpen(false);
  }

  function goDrug(name) { navigate('/nursekit', { state: { tab: 'ref', drugSearch: name } }); setQuery(''); setSearchOpen(false); }
  function goPage(p) { navigate(p.path, p.state ? { state: p.state } : undefined); setQuery(''); setSearchOpen(false); }

  const initial = user?.email?.[0]?.toUpperCase() || '?';

  return (
    <header className="site-header">
      <div className="header-inner">
        <Link to="/" className="brand">
          <span className="brand-mark">C<em>RN</em></span>
          <span className="brand-name">Confident RN — AI Nurse Tutor</span>
        </Link>

        <div className="header-right">
          <div className="search-wrap" ref={searchRef}>
            <form className="search" role="search" onSubmit={handleSubmit}>
              <input
                type="search"
                placeholder="Search topics, drugs, NCLEX…"
                aria-label="Search"
                value={query}
                autoComplete="off"
                onChange={e => { setQuery(e.target.value); setSearchOpen(true); }}
                onFocus={() => setSearchOpen(true)}
                onKeyDown={e => e.key === 'Escape' && setSearchOpen(false)}
              />
              <button type="submit" aria-label="Search">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                  <circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" />
                </svg>
              </button>
            </form>

            {showDropdown && (
              <div className="search-dropdown">
                {pageResults.length > 0 && (
                  <div className="search-group">
                    <div className="search-group-label">Pages</div>
                    {pageResults.map((p, i) => (
                      <button key={i} className="search-result" onMouseDown={() => goPage(p)}>
                        <span className="sr-icon">📄</span>
                        <span className="sr-label">{p.label}</span>
                      </button>
                    ))}
                  </div>
                )}
                {drugResults.length > 0 && (
                  <div className="search-group">
                    <div className="search-group-label">Drugs — NurseKit Pro</div>
                    {drugResults.map(d => (
                      <button key={d.name} className="search-result" onMouseDown={() => goDrug(d.name)}>
                        <span className="sr-icon">💊</span>
                        <span className="sr-label">{d.name}</span>
                        <span className="sr-meta">{d.class}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {user ? (
            <div className="user-menu" ref={menuRef}>
              <button className="user-btn" onClick={() => setMenuOpen(o => !o)} aria-label="Account menu">
                <span className="user-avatar">{initial}</span>
                <span className={`user-tier ${TIER_CLASS[tier]}`}>{TIER_LABEL[tier]}</span>
              </button>
              {menuOpen && (
                <div className="user-dropdown">
                  <div className="user-dropdown-email">{user.email}</div>
                  <div className={`user-dropdown-tier ${TIER_CLASS[tier]}`}>
                    {TIER_LABEL[tier]} plan
                  </div>
                  {tier === 'free' && (
                    <Link to="/features#pricing" className="user-dropdown-upgrade" onClick={() => setMenuOpen(false)}>
                      Upgrade to Pro →
                    </Link>
                  )}
                  <button className="user-dropdown-signout" onClick={() => { signOut(); setMenuOpen(false); }}>
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button className="header-signin-btn" data-auth-exempt onClick={openAuthModal}>Sign In</button>
          )}
        </div>
      </div>

      <nav className="subnav" aria-label="Sections">
        <div className="subnav-inner">
          <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>Home</NavLink>
          <NavLink to="/features" className={({ isActive }) => isActive ? 'active' : ''}>Features</NavLink>
          <NavLink to="/features#tutor" className="">AI Tutor</NavLink>
          <NavLink to="/features#pricing" className="">Pricing</NavLink>
          <NavLink to="/about" className={({ isActive }) => isActive ? 'active' : ''}>About</NavLink>
          <NavLink to="/faq" className={({ isActive }) => isActive ? 'active' : ''}>FAQ</NavLink>
          <NavLink to="/nursekit" className={({ isActive }) => isActive ? 'active' : ''}>NurseKit Pro</NavLink>
        </div>
      </nav>
    </header>
  );
}
