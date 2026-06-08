import { useState } from 'react';
import { LABS, LAB_FIELDS } from '../../data/labRangesData';

export default function LabInterpreter() {
  const [values, setValues] = useState({});
  const [results, setResults] = useState(null);

  function handleChange(key, val) {
    setValues(prev => ({ ...prev, [key]: val }));
  }

  function interpretLabs() {
    const found = [];
    let hasCritical = false;
    let hasConcern = false;

    for (const field of LAB_FIELDS) {
      const raw = values[field.key];
      if (!raw && raw !== 0) continue;
      const val = parseFloat(raw);
      if (isNaN(val)) continue;

      const lab = LABS[field.key];
      let matched = null;
      for (const r of lab.ranges) {
        if (val <= r.max) { matched = r; break; }
      }
      if (!matched) matched = lab.ranges[lab.ranges.length - 1];

      if (matched.status === 'critical') hasCritical = true;
      if (matched.status === 'high' || matched.status === 'low') hasConcern = true;

      found.push({ label: lab.label, val, unit: lab.unit, matched });
    }

    if (found.length === 0) {
      setResults({ type: 'empty' });
      return;
    }

    setResults({ type: 'list', found, hasCritical, hasConcern });
  }

  return (
    <div className="nk-panel">
      <div className="nk-section-title">Lab <span>Interpreter</span></div>
      <div className="nk-section-sub">Enter lab results — instant interpretation, urgency level &amp; nurse action</div>

      <div className="nk-card">
        <div className="nk-card-title"><span className="nk-dot" />Enter Lab Results</div>
        <div className="nk-lab-grid">
          {LAB_FIELDS.map(f => (
            <div key={f.key} className="nk-lab-field">
              <label>{f.label}</label>
              <input
                type="number"
                placeholder={f.placeholder}
                step={f.step}
                value={values[f.key] ?? ''}
                onChange={e => handleChange(f.key, e.target.value)}
              />
              <span className="nk-lab-ref">{f.ref}</span>
            </div>
          ))}
        </div>
        <button className="nk-btn-primary" onClick={interpretLabs}>Interpret Results</button>
      </div>

      {results?.type === 'empty' && (
        <div className="nk-alert warn"><span className="nk-alert-icon">⚠️</span>Please enter at least one lab value.</div>
      )}

      {results?.type === 'list' && (
        <>
          <div className={`nk-urgency-banner ${results.hasCritical ? 'critical' : results.hasConcern ? 'concern' : 'normal'}`}>
            {results.hasCritical
              ? '⛔ CRITICAL VALUES PRESENT — Immediate clinical action required'
              : results.hasConcern
              ? '⚠️ Abnormal values detected — review and monitor'
              : '✓ All entered values within normal range'}
          </div>
          {results.found.map((r, i) => (
            <div key={i} className={`nk-status-${r.matched.status}`}>
              <div className="nk-lab-result-item">
                <div className="nk-lab-status">
                  <span className="nk-status-badge">{r.matched.status.toUpperCase()}</span>
                  <div className="nk-status-val">
                    {r.val}
                    {r.unit && <><br /><span style={{ fontSize: 9, opacity: 0.6 }}>{r.unit}</span></>}
                  </div>
                </div>
                <div className="nk-lab-info">
                  <h4>{r.label}</h4>
                  <p>{r.matched.text}</p>
                  <span className="nk-lab-action">→ {r.matched.action}</span>
                </div>
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
