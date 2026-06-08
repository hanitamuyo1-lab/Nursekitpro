import { useState, useRef, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const DEFAULT_KEY = import.meta.env.VITE_ANTHROPIC_KEY || '';

const SYSTEM_PROMPT = [
  'You are a warm, encouraging AI nurse tutor on the Confident RN platform.',
  'Help student nurses and newly qualified RNs study and prepare for exams including NCLEX.',
  '',
  'Your role:',
  '- Explain nursing concepts clearly and simply',
  '- Quiz students with NCLEX-style 4-option questions (A-D); wait for their answer before revealing it',
  '- Use real clinical scenarios to make learning relatable',
  '- Be supportive and motivating — nursing school is tough!',
  '- Cover all nursing topics: anatomy, pharmacology, patient care, vital signs, ADPIE, fluid & electrolytes, med-surg, pediatrics, OB, mental health',
  '- Keep responses under 200 words unless a detailed explanation is needed',
  '- Use short bullet points or numbered steps where helpful',
  '- End every reply with an encouraging note or a follow-up question',
].join('\n');

function escHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function fmt(text) {
  return escHtml(text)
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n\n/g, '<br><br>')
    .replace(/\n/g, '<br>');
}

function Message({ role, html }) {
  return (
    <div className={`msg${role === 'user' ? ' me' : ''}`}>
      <div className="av" aria-hidden="true">{role === 'user' ? 'You' : 'RN'}</div>
      <div className="bub" dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="msg">
      <div className="av" aria-hidden="true">RN</div>
      <div className="bub">
        <div className="dots">
          <span /><span /><span />
        </div>
      </div>
    </div>
  );
}

function AiTutor() {
  const [messages, setMessages] = useState([
    { role: 'assistant', html: 'Hi! I am your <strong>Confident RN AI Tutor</strong> &mdash; ready to help you study smarter. 🎉<br><br>Ask me to explain a concept, quiz you on a topic, or give you an NCLEX-style question. What shall we study today?' }
  ]);
  const [chatHistory, setChatHistory] = useState([]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [isReady, setIsReady] = useState(true);
  const [showBanner, setShowBanner] = useState(false);
  const msgBoxRef = useRef(null);

  useEffect(() => {
    if (msgBoxRef.current) {
      msgBoxRef.current.scrollTop = msgBoxRef.current.scrollHeight;
    }
  }, [messages]);

  const getKey = () => localStorage.getItem('crn_api_key') || DEFAULT_KEY;
  const saveKey = (k) => localStorage.setItem('crn_api_key', k);
  const clearKey = () => localStorage.removeItem('crn_api_key');

  const promptApiKey = () => {
    const key = window.prompt(
      'Paste your Anthropic API key (starts with sk-ant-).\n\n' +
      'It is saved only in this browser\'s localStorage and sent directly to api.anthropic.com.\n\n' +
      'Get a key at: console.anthropic.com/settings/keys'
    );
    if (key === null) return;
    const trimmed = key.trim();
    if (!trimmed) return;
    if (!trimmed.startsWith('sk-')) {
      alert('That does not look like a valid Anthropic API key (should start with sk-ant-).\nPlease try again.');
      return;
    }
    saveKey(trimmed);
    setIsReady(true);
    setShowBanner(false);
    setMessages(prev => [...prev, { role: 'assistant', html: 'API key saved! 🎉 Ask me anything — I\'m ready to help you study.' }]);
  };

  const sendMsg = useCallback(async () => {
    if (busy) return;
    const text = input.trim();
    if (!text) return;

    const apiKey = getKey();
    if (!apiKey) {
      setIsReady(false);
      setShowBanner(true);
      setMessages(prev => [...prev, { role: 'assistant', html: 'Please set your Anthropic API key using the banner above to activate the live tutor.' }]);
      return;
    }

    setInput('');
    setBusy(true);
    const userHtml = fmt(text);
    setMessages(prev => [...prev, { role: 'user', html: userHtml }]);

    const newHistory = [...chatHistory, { role: 'user', content: text }];
    setChatHistory(newHistory);

    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 512,
          system: SYSTEM_PROMPT,
          messages: newHistory,
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        const msg = (body?.error?.message) || `API error ${res.status}`;
        const err = new Error(msg);
        err.status = res.status;
        throw err;
      }

      const data = await res.json();
      const reply = data?.content?.[0]?.text || '';
      if (!reply) throw new Error('Empty response from API');

      setChatHistory(prev => [...prev, { role: 'assistant', content: reply }]);
      setMessages(prev => [...prev, { role: 'assistant', html: fmt(reply) }]);
    } catch (err) {
      const msg = err.message || 'Unknown error';
      const lc = msg.toLowerCase();
      if (err.status === 401 || lc.includes('invalid x-api-key') || lc.includes('authentication')) {
        clearKey();
        setIsReady(false);
        setShowBanner(true);
        setMessages(prev => [...prev, { role: 'assistant', html: 'Your API key was rejected (401). Please set a valid key using the banner above.' }]);
      } else if (err.status === 429 || lc.includes('rate')) {
        setMessages(prev => [...prev, { role: 'assistant', html: 'Rate limit reached. Please wait a moment and try again.' }]);
      } else {
        setMessages(prev => [...prev, { role: 'assistant', html: `Connection issue: ${escHtml(msg)}. Please try again.` }]);
      }
    } finally {
      setBusy(false);
    }
  }, [busy, input, chatHistory]);

  const quickAsk = (text) => {
    if (busy) return;
    setInput(text);
    setTimeout(() => {
      setInput(t => {
        if (t === text) {
          sendMsg();
          return t;
        }
        return t;
      });
    }, 0);
  };

  const handleQuickAsk = (text) => {
    if (busy) return;
    const apiKey = getKey();
    if (!apiKey) {
      setIsReady(false);
      setShowBanner(true);
      setMessages(prev => [...prev, { role: 'assistant', html: 'Please set your Anthropic API key using the banner above to activate the live tutor.' }]);
      return;
    }

    setBusy(true);
    const userHtml = fmt(text);
    setMessages(prev => [...prev, { role: 'user', html: userHtml }]);
    const newHistory = [...chatHistory, { role: 'user', content: text }];
    setChatHistory(newHistory);

    fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 512,
        system: SYSTEM_PROMPT,
        messages: newHistory,
      }),
    })
      .then(res => {
        if (!res.ok) return res.json().then(body => { const err = new Error(body?.error?.message || `API error ${res.status}`); err.status = res.status; throw err; });
        return res.json();
      })
      .then(data => {
        const reply = data?.content?.[0]?.text || '';
        if (!reply) throw new Error('Empty response from API');
        setChatHistory(prev => [...prev, { role: 'assistant', content: reply }]);
        setMessages(prev => [...prev, { role: 'assistant', html: fmt(reply) }]);
      })
      .catch(err => {
        const msg = err.message || 'Unknown error';
        const lc = msg.toLowerCase();
        if (err.status === 401 || lc.includes('invalid x-api-key') || lc.includes('authentication')) {
          clearKey(); setIsReady(false); setShowBanner(true);
          setMessages(prev => [...prev, { role: 'assistant', html: 'Your API key was rejected (401). Please set a valid key using the banner above.' }]);
        } else if (err.status === 429 || lc.includes('rate')) {
          setMessages(prev => [...prev, { role: 'assistant', html: 'Rate limit reached. Please wait a moment and try again.' }]);
        } else {
          setMessages(prev => [...prev, { role: 'assistant', html: `Connection issue: ${escHtml(msg)}. Please try again.` }]);
        }
      })
      .finally(() => setBusy(false));
  };

  return (
    <div className="tutor-card">
      {showBanner && (
        <div className="api-banner">
          <span>
            Enter your <a href="https://console.anthropic.com/settings/keys" target="_blank" rel="noopener noreferrer">Anthropic API key</a> to activate the live tutor. It is saved only in your browser and sent directly to Anthropic.
          </span>
          <div className="api-banner-btns">
            <button type="button" onClick={promptApiKey}>Set API key</button>
          </div>
        </div>
      )}

      <div className="tutor-head">
        <div className="tutor-status">
          <div className="pulse" style={!isReady ? { background: '#ccc', animation: 'none' } : {}} />
          <span>{isReady ? 'Confident RN Tutor — online now' : 'Confident RN Tutor — enter API key to activate'}</span>
        </div>
        <div className="pills">
          <button className="pill" type="button" disabled={busy} onClick={() => handleQuickAsk('Quiz me on vital signs')}>Quiz me</button>
          <button className="pill" type="button" disabled={busy} onClick={() => handleQuickAsk('Give me an NCLEX-style practice question')}>NCLEX question</button>
          <button className="pill" type="button" disabled={busy} onClick={() => handleQuickAsk('Explain ADPIE step by step')}>ADPIE</button>
          <button className="pill" type="button" disabled={busy} onClick={() => handleQuickAsk('What are the 5 rights of medication administration?')}>Med safety</button>
          <button className="pill" type="button" disabled={busy} onClick={() => handleQuickAsk('Explain fluid and electrolyte balance simply')}>Electrolytes</button>
        </div>
      </div>

      <div className="messages" ref={msgBoxRef} role="log" aria-live="polite" aria-label="Tutor conversation">
        {messages.map((m, i) => (
          <Message key={i} role={m.role} html={m.html} />
        ))}
        {busy && <TypingIndicator />}
      </div>

      <div className="tutor-input">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Ask any nursing question…"
          aria-label="Ask the tutor"
          disabled={busy}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMsg(); } }}
        />
        <button type="button" disabled={busy} onClick={sendMsg}>Send</button>
      </div>
    </div>
  );
}

export default function Features() {
  const { user, tier, openAuthModal } = useAuth();

  function handlePaidPlan(stripeUrl) {
    if (!user) {
      openAuthModal();
    } else {
      window.open(stripeUrl, '_blank', 'noopener noreferrer');
    }
  }

  return (
    <>
      {/* HERO */}
      <div className="hero-wrap">
        <div className="hero">
          <div>
            <h1>From anxious to ward-ready, with a tutor in your pocket</h1>
            <p className="hero-sub">Your personal AI nursing tutor &mdash; available 24/7 to explain concepts, quiz you on clinical topics, and prepare you for NCLEX from your very first shift.</p>
            <div className="hero-meta">
              <a href="#tutor" className="btn btn-primary">Try the AI tutor free</a>
              <a href="#pricing" className="btn btn-ghost">See pricing</a>
            </div>
          </div>
          <aside className="whats-new" aria-label="What's new">
            <h2><a href="#tutor">What&apos;s new</a></h2>
            <p>In May 2026 we added a new <a href="#tutor">live AI tutor demo</a>, plus updated NCLEX scenario packs covering pediatrics, OB, and mental health.</p>
          </aside>
        </div>
      </div>

      {/* STATS */}
      <div className="stats">
        <div className="stats-inner">
          <div className="stat"><div className="stat-num">8</div><div className="stat-label">Modules</div></div>
          <div className="stat"><div className="stat-num">31+</div><div className="stat-label">Lessons</div></div>
          <div className="stat"><div className="stat-num">4</div><div className="stat-label">Bonus resources</div></div>
          <div className="stat"><div className="stat-num">90</div><div className="stat-label">Day action plan</div></div>
        </div>
      </div>

      {/* FEATURES */}
      <section className="panel-grey" id="features">
        <div className="section">
          <div className="section-head">
            <div className="eyebrow">Why students love it</div>
            <h2 className="title">Everything you need to pass and excel</h2>
            <p className="lede">Built for student nurses and newly qualified RNs who want real confidence at the bedside &mdash; not just a passing score.</p>
          </div>
          <div className="card-grid">
            <article className="card">
              <h3><a href="#tutor">AI quizzes on demand</a></h3>
              <p>Ask to be quizzed on any topic &mdash; vital signs, pharmacology, ADPIE, electrolytes &mdash; and get instant feedback.</p>
            </article>
            <article className="card">
              <h3><a href="#tutor">NCLEX-style questions</a></h3>
              <p>Practice with realistic 4-option questions just like the real exam, complete with full answer explanations.</p>
            </article>
            <article className="card">
              <h3><a href="#tutor">Medication safety</a></h3>
              <p>Master the 5 rights of medication administration, drug classes, and dosage calculations with ease.</p>
            </article>
            <article className="card">
              <h3><a href="#tutor">Clinical scenarios</a></h3>
              <p>Learn through real patient cases that prepare you for what you will actually face on the ward.</p>
            </article>
            <article className="card">
              <h3><a href="#tutor">Available 24/7</a></h3>
              <p>Study at 2am before your shift. Your AI tutor never sleeps, never judges, and never gets tired.</p>
            </article>
            <article className="card">
              <h3><a href="#tutor">Self-paced learning</a></h3>
              <p>Go at your own speed. Revisit topics as many times as you need until they truly click.</p>
            </article>
          </div>
        </div>
      </section>

      {/* TUTOR */}
      <section className="tutor-panel" id="tutor">
        <div className="section">
          <div className="section-head">
            <div className="eyebrow">Live AI tutor &mdash; no sign-up needed</div>
            <h2 className="title">Ask your AI tutor anything</h2>
            <p className="lede">Type any nursing question or tap a quick topic &mdash; your tutor responds instantly.</p>
          </div>
          <AiTutor />
        </div>
      </section>

      {/* PRICING */}
      <section className="panel-grey" id="pricing">
        <div className="section">
          <div className="section-head">
            <div className="eyebrow">Simple pricing</div>
            <h2 className="title">Choose your study plan</h2>
            <p className="lede">Start free, upgrade when you are ready. Cancel anytime.</p>
          </div>

          <div className="pricing-grid">
            <div className="price-card">
              <div className="plan-name">Free</div>
              <div className="plan-price"><sup>$</sup>0</div>
              <div className="plan-period">forever</div>
              <ul className="plan-list">
                <li>10 AI messages per day</li>
                <li>Basic topic explanations</li>
                <li>NurseKit Pro access</li>
                <li>Community access</li>
              </ul>
              {user ? (
                tier === 'free'
                  ? <span className="plan-btn stroked" style={{ textAlign: 'center', cursor: 'default' }}>Current plan</span>
                  : <a href="#tutor" className="plan-btn stroked">Try the tutor</a>
              ) : (
                <button className="plan-btn stroked" onClick={openAuthModal}>Create free account</button>
              )}
            </div>

            <div className="price-card hot">
              <span className="hot-flag">Most popular</span>
              <div className="plan-name">Pro monthly</div>
              <div className="plan-price"><sup>£</sup>2.99</div>
              <div className="plan-period">per month &mdash; cancel anytime</div>
              <ul className="plan-list">
                <li>Unlimited AI messages</li>
                <li>Full NCLEX prep mode</li>
                <li>Clinical scenario cases</li>
                <li>Medication quizzes</li>
                <li>Progress tracking</li>
                <li>Priority support</li>
              </ul>
              {user && tier === 'pro' ? (
                <span className="plan-btn filled" style={{ textAlign: 'center', cursor: 'default' }}>Current plan</span>
              ) : (
                <button className="plan-btn filled" onClick={() => handlePaidPlan('https://buy.stripe.com/5kQ14g5v47et2462RAcfK03')}>
                  {user ? 'Upgrade to Pro' : 'Get started'}
                </button>
              )}
            </div>

            <div className="price-card">
              <div className="plan-name">Lifetime access</div>
              <div className="plan-price"><sup>£</sup>9.99</div>
              <div className="plan-period">one-time payment</div>
              <ul className="plan-list">
                <li>Everything in Pro</li>
                <li>Lifetime updates</li>
                <li>Downloadable resources</li>
                <li>90-day action plan</li>
                <li>Bonus: all 3 AI agents</li>
              </ul>
              {user && tier === 'lifetime' ? (
                <span className="plan-btn stroked" style={{ textAlign: 'center', cursor: 'default' }}>Current plan</span>
              ) : (
                <button className="plan-btn stroked" onClick={() => handlePaidPlan('https://buy.stripe.com/fZu8wIaPo9mBcIKcsacfK04')}>
                  {user ? 'Get lifetime access' : 'Get lifetime access'}
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="reviews">
        <div className="section">
          <div className="section-head">
            <div className="eyebrow">Student reviews</div>
            <h2 className="title">Nurses who passed and thrived</h2>
            <p className="lede">Real students, real results from around the world.</p>
          </div>
          <div className="testi-grid">
            <div className="testi-card">
              <div className="stars" aria-label="5 out of 5 stars">★★★★★</div>
              <blockquote>I failed my NCLEX twice before finding this. The AI quizzes and instant explanations finally made everything click. Passed on my third attempt!</blockquote>
              <div className="testi-name">Amara T.</div>
              <div className="testi-role">Newly qualified RN, Ghana</div>
            </div>
            <div className="testi-card">
              <div className="stars" aria-label="5 out of 5 stars">★★★★★</div>
              <blockquote>I use it before every night shift to refresh my knowledge. It is like having a consultant in my pocket &mdash; explains everything without making me feel stupid.</blockquote>
              <div className="testi-name">Jessica M.</div>
              <div className="testi-role">Student nurse, United Kingdom</div>
            </div>
            <div className="testi-card">
              <div className="stars" aria-label="5 out of 5 stars">★★★★★</div>
              <blockquote>The clinical scenario questions are brilliant. I went from dreading my placement to feeling genuinely prepared. Worth every penny.</blockquote>
              <div className="testi-name">Priya K.</div>
              <div className="testi-role">2nd year nursing student, India</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta">
        <div className="cta-inner">
          <div>
            <h2>Ready to become a Confident RN?</h2>
            <p>Join thousands of nursing students worldwide. Try the AI tutor free &mdash; no credit card required.</p>
          </div>
          <div className="cta-actions">
            <a href="#tutor" className="btn btn-primary">Try the tutor free</a>
            <Link to="/features#pricing" className="btn btn-ghost">See plans</Link>
          </div>
        </div>
      </section>
    </>
  );
}
