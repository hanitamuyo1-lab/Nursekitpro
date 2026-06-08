import { useState, useMemo, useEffect } from 'react';
import { DRUGS, SPECS } from '../../data/drugsData';

const INFO_TABS = [
  { id: 'dosage', label: 'Dosage' },
  { id: 'contra', label: 'Contraindications' },
  { id: 'side', label: 'Side Effects' },
  { id: 'inter', label: 'Interactions' },
  { id: 'nurse', label: 'Nurse Notes' },
];

export default function DrugReference({ bookmarks, onToggleBookmark, onAskTutor, initialSearch, onInitialSearchConsumed }) {
  const [search, setSearch] = useState(initialSearch || '');
  const [spec, setSpec] = useState('All');
  const [selectedDrug, setSelectedDrug] = useState(null);
  const [activeTab, setActiveTab] = useState('dosage');

  useEffect(() => {
    if (initialSearch) {
      setSearch(initialSearch);
      onInitialSearchConsumed?.();
    }
  }, []);

  const filtered = useMemo(() => {
    let drugs = DRUGS;
    if (spec !== 'All') drugs = drugs.filter(d => d.spec === spec);
    if (search.length > 1) {
      const q = search.toLowerCase();
      drugs = drugs.filter(d =>
        d.name.toLowerCase().includes(q) ||
        d.class.toLowerCase().includes(q) ||
        d.spec.toLowerCase().includes(q)
      );
    }
    return drugs;
  }, [search, spec]);

  function openDrug(drug) {
    setSelectedDrug(drug);
    setActiveTab('dosage');
  }

  if (selectedDrug) {
    const d = selectedDrug;
    const isSaved = bookmarks.has(d.name);
    return (
      <div className="nk-panel">
        <div className="nk-section-title">Drug <span>Reference</span></div>
        <div className="nk-section-sub">130+ drugs across 12 specialties</div>
        <button className="nk-back-btn" onClick={() => setSelectedDrug(null)}>← Back to search</button>

        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 2 }}>
          <div className="nk-drug-name" style={{ margin: 0 }}><span>{d.name}</span></div>
          <div style={{ display: 'flex', gap: 8, flexShrink: 0, marginTop: 4 }}>
            <button
              className={`nk-bm-detail-btn${isSaved ? ' saved' : ''}`}
              onClick={e => onToggleBookmark(e, d.name)}
            >
              {isSaved ? '★ Saved' : '☆ Bookmark'}
            </button>
            <button
              className="nk-bm-detail-btn"
              onClick={() => onAskTutor(`Explain ${d.name}: mechanism of action, key nursing considerations, and give me one NCLEX-style question about it.`)}
            >
              🤖 Ask Tutor
            </button>
          </div>
        </div>
        <div className="nk-drug-class">{d.class}</div>
        <div className="nk-drug-specialty-tag">{d.spec}</div>

        <div className="nk-info-tabs">
          {INFO_TABS.map(t => (
            <button
              key={t.id}
              className={`nk-info-tab${activeTab === t.id ? ' active' : ''}`}
              onClick={() => setActiveTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>

        {activeTab === 'dosage' && (
          <div className="nk-info-row"><span className="nk-info-label">Dosage</span><span className="nk-info-val">{d.dosage}</span></div>
        )}
        {activeTab === 'contra' && (
          <div className="nk-info-row"><span className="nk-info-label">Avoid if</span><span className="nk-info-val">{d.contraindications}</span></div>
        )}
        {activeTab === 'side' && (
          <div className="nk-info-row"><span className="nk-info-label">Adverse effects</span><span className="nk-info-val">{d.sideEffects}</span></div>
        )}
        {activeTab === 'inter' && (
          <div className="nk-info-row"><span className="nk-info-label">Interactions</span><span className="nk-info-val">{d.interactions}</span></div>
        )}
        {activeTab === 'nurse' && (
          <div className="nk-nurse-box">
            <h4>What the Nurse Needs to Know</h4>
            <ul>
              {(d.nurse || ['Always verify against local protocol and current BNF guidance.']).map((n, i) => (
                <li key={i}>{n}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="nk-panel">
      <div className="nk-section-title">Drug <span>Reference</span></div>
      <div className="nk-section-sub">130+ drugs across 12 specialties — dosage, contraindications, interactions &amp; nurse notes</div>

      <div className="nk-ref-top">
        <div className="nk-search-wrap">
          <span className="nk-search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search by drug name, class or specialty…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            autoComplete="off"
          />
        </div>
      </div>

      <div className="nk-cat-filter">
        {SPECS.map(s => (
          <button
            key={s}
            className={`nk-cat-btn${spec === s ? ' active' : ''}`}
            onClick={() => setSpec(s)}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="nk-drug-count">
        {filtered.length} drug{filtered.length !== 1 ? 's' : ''} found
      </div>

      {filtered.length === 0 ? (
        <div className="nk-empty">
          <div className="nk-empty-icon">💊</div>
          <div>No drug found. Try a different search.</div>
        </div>
      ) : (
        <div className="nk-drug-list">
          {filtered.map(d => {
            const isSaved = bookmarks.has(d.name);
            return (
              <div key={d.name} className="nk-drug-item">
                <span
                  className="nk-di-name"
                  onClick={() => openDrug(d)}
                  style={{ cursor: 'pointer', flex: 1 }}
                >
                  {d.name}
                </span>
                <div className="nk-di-meta">
                  <span className="nk-drug-cat">{d.class.split('/')[0].trim()}</span>
                  <span className="nk-drug-spec">{d.spec}</span>
                </div>
                <button
                  className={`nk-bm-btn${isSaved ? ' saved' : ''}`}
                  onClick={e => onToggleBookmark(e, d.name)}
                  title={isSaved ? 'Remove bookmark' : 'Bookmark'}
                >
                  {isSaved ? '★' : '☆'}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
