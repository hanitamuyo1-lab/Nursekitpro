import { useState } from 'react';

const MODES = [
  { id: 'mgkg', label: 'mg/kg Dose' },
  { id: 'iv', label: 'IV Drip Rate' },
  { id: 'infusion', label: 'Infusion Rate' },
  { id: 'recon', label: 'Reconstitution' },
];

function ResultBox({ main, unit, detail, alerts }) {
  return (
    <div style={{ marginTop: 14 }}>
      <div className="nk-result-box">
        <div className="nk-result-main">{main}<span className="nk-result-unit">{unit}</span></div>
        <div className="nk-result-detail" dangerouslySetInnerHTML={{ __html: detail }} />
      </div>
      {alerts.map((a, i) => (
        <div key={i} className={`nk-alert ${a.type}`}>
          <span className="nk-alert-icon">{a.icon}</span>{a.text}
        </div>
      ))}
    </div>
  );
}

export default function Calculator() {
  const [mode, setMode] = useState('mgkg');
  const [result, setResult] = useState(null);

  // mg/kg fields
  const [weight, setWeight] = useState('');
  const [weightUnit, setWeightUnit] = useState('kg');
  const [doseMgKg, setDoseMgKg] = useState('');
  const [freq, setFreq] = useState('once');
  const [maxDose, setMaxDose] = useState('');
  const [concMgKg, setConcMgKg] = useState('');

  // IV fields
  const [ivVol, setIvVol] = useState('');
  const [ivTime, setIvTime] = useState('');
  const [dropFactor, setDropFactor] = useState('20');

  // Infusion fields
  const [infWeight, setInfWeight] = useState('');
  const [infDose, setInfDose] = useState('');
  const [infDrug, setInfDrug] = useState('');
  const [infVol, setInfVol] = useState('');

  // Recon fields
  const [reconDose, setReconDose] = useState('');
  const [reconVial, setReconVial] = useState('');
  const [reconDiluent, setReconDiluent] = useState('');
  const [reconDisplace, setReconDisplace] = useState('0');

  function calcMgKg() {
    let w = parseFloat(weight);
    const d = parseFloat(doseMgKg);
    const mx = parseFloat(maxDose) || null;
    const conc = parseFloat(concMgKg) || null;
    if (!w || !d) {
      setResult({ type: 'warn', text: 'Please enter weight and dose.' });
      return;
    }
    if (weightUnit === 'lbs') w = w * 0.453592;
    let dose = w * d;
    let capped = false;
    if (mx && dose > mx) { dose = mx; capped = true; }
    const freqMap = {
      once: 'single dose',
      bd: `×2 = ${(dose * 2).toFixed(1)} mg/day`,
      tds: `×3 = ${(dose * 3).toFixed(1)} mg/day`,
      qds: `×4 = ${(dose * 4).toFixed(1)} mg/day`,
      q4h: `×6 = ${(dose * 6).toFixed(1)} mg/day`,
      q6h: `×4 = ${(dose * 4).toFixed(1)} mg/day`,
      q8h: `×3 = ${(dose * 3).toFixed(1)} mg/day`,
    };
    const volStr = conc ? `<strong>Volume to draw:</strong> ${(dose / conc).toFixed(2)} mL<br>` : '';
    const alerts = [{ type: 'ok', icon: '✓', text: 'Verify dose against local protocol before administration.' }];
    if (capped) alerts.unshift({ type: 'warn', icon: '⚠️', text: `Max dose applied — calculated ${(parseFloat(weight) * (weightUnit === 'lbs' ? 0.453592 : 1) * d).toFixed(1)} mg exceeds ${mx} mg maximum.` });
    setResult({
      type: 'box',
      main: dose.toFixed(1), unit: 'mg',
      detail: `${volStr}<strong>Weight:</strong> ${w.toFixed(1)} kg &nbsp;|&nbsp; <strong>Rate:</strong> ${d} mg/kg<br><strong>Daily total:</strong> ${freqMap[freq]}`,
      alerts,
    });
  }

  function calcIV() {
    const vol = parseFloat(ivVol);
    const hrs = parseFloat(ivTime);
    const df = parseInt(dropFactor);
    if (!vol || !hrs) {
      setResult({ type: 'warn', text: 'Please enter volume and time.' });
      return;
    }
    const mlhr = (vol / hrs).toFixed(1);
    const dpm = ((vol * df) / (hrs * 60)).toFixed(0);
    setResult({
      type: 'box',
      main: mlhr, unit: 'mL/hr',
      detail: `<strong>Drop rate:</strong> ${dpm} drops/min (${df} drop factor)<br><strong>Volume:</strong> ${vol} mL over ${hrs} hrs`,
      alerts: [{ type: 'ok', icon: '✓', text: 'Check pump settings independently. Monitor infusion site.' }],
    });
  }

  function calcInfusion() {
    const wt = parseFloat(infWeight);
    const dose = parseFloat(infDose);
    const drug = parseFloat(infDrug);
    const vol = parseFloat(infVol);
    if (!wt || !dose || !drug || !vol) {
      setResult({ type: 'warn', text: 'All fields required.' });
      return;
    }
    const concMcgMl = (drug * 1000) / vol;
    const mlhr = ((dose * wt * 60) / concMcgMl).toFixed(2);
    setResult({
      type: 'box',
      main: mlhr, unit: 'mL/hr',
      detail: `<strong>Concentration:</strong> ${concMcgMl.toFixed(1)} mcg/mL<br><strong>Delivery:</strong> ${dose} mcg/kg/min &nbsp;|&nbsp; ${drug}mg in ${vol}mL`,
      alerts: [{ type: 'warn', icon: '⚠️', text: 'High-alert infusion — double-check with second nurse before starting.' }],
    });
  }

  function calcRecon() {
    const dose = parseFloat(reconDose);
    const vial = parseFloat(reconVial);
    const dil = parseFloat(reconDiluent);
    const displace = parseFloat(reconDisplace) || 0;
    if (!dose || !vial || !dil) {
      setResult({ type: 'warn', text: 'Please complete all fields.' });
      return;
    }
    const totalVol = dil + displace;
    const conc = vial / totalVol;
    const volNeeded = (dose / conc).toFixed(2);
    setResult({
      type: 'box',
      main: volNeeded, unit: 'mL',
      detail: `<strong>Concentration:</strong> ${conc.toFixed(2)} mg/mL<br><strong>Total vial vol:</strong> ${totalVol.toFixed(1)} mL`,
      alerts: [{ type: 'ok', icon: '✓', text: 'Discard remaining per policy. Label syringe immediately.' }],
    });
  }

  function handleCalc() {
    setResult(null);
    if (mode === 'mgkg') calcMgKg();
    else if (mode === 'iv') calcIV();
    else if (mode === 'infusion') calcInfusion();
    else calcRecon();
  }

  return (
    <div className="nk-panel">
      <div className="nk-section-title">Drug <span>Calculator</span></div>
      <div className="nk-section-sub">Fast, safe dosage &amp; IV rate calculations</div>
      <div className="nk-card">
        <div className="nk-card-title"><span className="nk-dot" />Calculation Mode</div>
        <div className="nk-mode-pills">
          {MODES.map(m => (
            <button key={m.id} className={`nk-pill${mode === m.id ? ' active' : ''}`}
              onClick={() => { setMode(m.id); setResult(null); }}>
              {m.label}
            </button>
          ))}
        </div>

        {mode === 'mgkg' && (
          <div className="nk-form-grid">
            <div className="nk-field"><label>Patient Weight</label><input type="number" placeholder="e.g. 70" min="0.1" value={weight} onChange={e => setWeight(e.target.value)} /></div>
            <div className="nk-field"><label>Weight Unit</label>
              <select value={weightUnit} onChange={e => setWeightUnit(e.target.value)}>
                <option value="kg">kg</option><option value="lbs">lbs</option>
              </select>
            </div>
            <div className="nk-field"><label>Dose (mg/kg)</label><input type="number" placeholder="e.g. 0.1" step="0.01" value={doseMgKg} onChange={e => setDoseMgKg(e.target.value)} /></div>
            <div className="nk-field"><label>Frequency</label>
              <select value={freq} onChange={e => setFreq(e.target.value)}>
                <option value="once">Single dose</option><option value="bd">BD (twice daily)</option>
                <option value="tds">TDS (three daily)</option><option value="qds">QDS (four daily)</option>
                <option value="q4h">Q4H</option><option value="q6h">Q6H</option><option value="q8h">Q8H</option>
              </select>
            </div>
            <div className="nk-field"><label>Max Single Dose (mg)</label><input type="number" placeholder="Optional" value={maxDose} onChange={e => setMaxDose(e.target.value)} /></div>
            <div className="nk-field"><label>Concentration (mg/mL)</label><input type="number" placeholder="e.g. 10" step="0.1" value={concMgKg} onChange={e => setConcMgKg(e.target.value)} /></div>
          </div>
        )}

        {mode === 'iv' && (
          <div className="nk-form-grid">
            <div className="nk-field"><label>Volume to Infuse (mL)</label><input type="number" placeholder="e.g. 500" value={ivVol} onChange={e => setIvVol(e.target.value)} /></div>
            <div className="nk-field"><label>Time (hours)</label><input type="number" placeholder="e.g. 8" step="0.5" value={ivTime} onChange={e => setIvTime(e.target.value)} /></div>
            <div className="nk-field"><label>Drop Factor (drops/mL)</label>
              <select value={dropFactor} onChange={e => setDropFactor(e.target.value)}>
                <option value="20">20 (standard)</option><option value="15">15 (blood)</option><option value="60">60 (micro)</option>
              </select>
            </div>
          </div>
        )}

        {mode === 'infusion' && (
          <div className="nk-form-grid">
            <div className="nk-field"><label>Patient Weight (kg)</label><input type="number" placeholder="e.g. 70" value={infWeight} onChange={e => setInfWeight(e.target.value)} /></div>
            <div className="nk-field"><label>Dose (mcg/kg/min)</label><input type="number" placeholder="e.g. 5" step="0.1" value={infDose} onChange={e => setInfDose(e.target.value)} /></div>
            <div className="nk-field"><label>Drug Amount (mg)</label><input type="number" placeholder="e.g. 200" value={infDrug} onChange={e => setInfDrug(e.target.value)} /></div>
            <div className="nk-field"><label>Diluent Volume (mL)</label><input type="number" placeholder="e.g. 50" value={infVol} onChange={e => setInfVol(e.target.value)} /></div>
          </div>
        )}

        {mode === 'recon' && (
          <div className="nk-form-grid">
            <div className="nk-field"><label>Required Dose (mg)</label><input type="number" placeholder="e.g. 250" value={reconDose} onChange={e => setReconDose(e.target.value)} /></div>
            <div className="nk-field"><label>Vial Strength (mg)</label><input type="number" placeholder="e.g. 500" value={reconVial} onChange={e => setReconVial(e.target.value)} /></div>
            <div className="nk-field"><label>Diluent Added (mL)</label><input type="number" placeholder="e.g. 10" value={reconDiluent} onChange={e => setReconDiluent(e.target.value)} /></div>
            <div className="nk-field"><label>Displacement Value (mL)</label><input type="number" placeholder="e.g. 0.3" step="0.1" value={reconDisplace} onChange={e => setReconDisplace(e.target.value)} /></div>
          </div>
        )}

        <button className="nk-btn-primary" onClick={handleCalc}>
          {mode === 'mgkg' ? 'Calculate Dose' : mode === 'iv' ? 'Calculate IV Rate' : mode === 'infusion' ? 'Calculate Infusion' : 'Calculate Volume'}
        </button>
      </div>

      {result && result.type === 'box' && (
        <ResultBox main={result.main} unit={result.unit} detail={result.detail} alerts={result.alerts} />
      )}
      {result && result.type === 'warn' && (
        <div className="nk-alert warn"><span className="nk-alert-icon">⚠️</span>{result.text}</div>
      )}
    </div>
  );
}
