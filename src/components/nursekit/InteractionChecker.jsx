import { useState } from 'react';
import { DRUGS } from '../../data/drugsData';
import { INTERACTIONS } from '../../data/interactionsData';

export default function InteractionChecker() {
  const [selected, setSelected] = useState([]);
  const [miniSearch, setMiniSearch] = useState('');
  const [results, setResults] = useState(null);

  const searchResults = miniSearch.length >= 2
    ? DRUGS.filter(d => d.name.toLowerCase().includes(miniSearch.toLowerCase()) && !selected.includes(d.name)).slice(0, 12)
    : [];

  function addDrug(name) {
    if (selected.includes(name)) return;
    setSelected(prev => [...prev, name]);
    setMiniSearch('');
    setResults(null);
  }

  function removeDrug(name) {
    setSelected(prev => prev.filter(d => d !== name));
    setResults(null);
  }

  function checkInteractions() {
    if (selected.length < 2) {
      setResults({ type: 'warn' });
      return;
    }
    const found = [];
    for (let i = 0; i < selected.length; i++) {
      for (let j = i + 1; j < selected.length; j++) {
        const a = selected[i], b = selected[j];
        const match = INTERACTIONS.find(x => x.drugs.includes(a) && x.drugs.includes(b));
        if (match) found.push({ pair: `${a} + ${b}`, ...match });
        else found.push({ pair: `${a} + ${b}`, severity: 'none', text: 'No significant interaction found in our database. Always verify with clinical pharmacist or current BNF/Lexicomp.' });
      }
    }
    const order = { severe: 0, moderate: 1, minor: 2, none: 3 };
    found.sort((a, b) => order[a.severity] - order[b.severity]);
    setResults({ type: 'list', found });
  }

  const hasSevere = results?.found?.some(f => f.severity === 'severe');
  const hasMod = results?.found?.some(f => f.severity === 'moderate');

  return (
    <div className="nk-panel">
      <div className="nk-section-title">Interaction <span>Checker</span></div>
      <div className="nk-section-sub">Add 2 or more drugs to check for interactions across all specialties</div>

      <div className="nk-card">
        <div className="nk-card-title"><span className="nk-dot" />Add Drugs to Check</div>

        <div className="nk-drug-tags-wrap" onClick={() => document.getElementById('nk-int-search').focus()}>
          {selected.length === 0 && (
            <span style={{ fontSize: 13, color: 'var(--nk-muted)' }}>Click here, then type to add drugs…</span>
          )}
          {selected.map(name => (
            <div key={name} className="nk-dtag">
              {name}
              <button onClick={() => removeDrug(name)}>×</button>
            </div>
          ))}
        </div>

        <input
          id="nk-int-search"
          className="nk-mini-search"
          placeholder="Type drug name to add…"
          value={miniSearch}
          onChange={e => setMiniSearch(e.target.value)}
          autoComplete="off"
        />

        {searchResults.length > 0 && (
          <div className="nk-mini-drug-list">
            {searchResults.map(d => (
              <div key={d.name} className="nk-mini-drug-item" onClick={() => addDrug(d.name)}>
                <strong>{d.name}</strong>{' '}
                <span style={{ color: 'var(--nk-muted)', fontSize: 11 }}>{d.spec}</span>
              </div>
            ))}
          </div>
        )}

        <button className="nk-btn-primary nk-btn-gold" onClick={checkInteractions} style={{ marginTop: 10 }}>
          Check Interactions
        </button>
      </div>

      {results?.type === 'warn' && (
        <div className="nk-alert warn"><span className="nk-alert-icon">⚠️</span>Please add at least 2 drugs to check.</div>
      )}

      {results?.type === 'list' && (
        <>
          <div className={`nk-urgency-banner ${hasSevere ? 'critical' : hasMod ? 'concern' : 'normal'}`}>
            {hasSevere ? '⛔ SEVERE interaction detected — urgent clinical review required'
              : hasMod ? '⚠️ Moderate interaction(s) found — monitor closely'
              : '✓ No severe interactions found in database — always verify clinically'}
          </div>
          {results.found.map((f, i) => (
            <div key={i} className={`nk-int-result ${f.severity === 'none' ? 'minor' : f.severity}`}>
              <div className="nk-int-severity">
                {f.severity === 'none' ? 'no known interaction' : f.severity} — {f.pair}
              </div>
              <h4>{f.pair}</h4>
              <p>{f.text}</p>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
