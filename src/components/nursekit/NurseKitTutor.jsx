import { useState, useRef, useEffect, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const FREE_LIMIT = 10;
const LIMIT_KEY = 'crn_daily_msgs';

function getDailyCount() {
  try {
    const s = JSON.parse(localStorage.getItem(LIMIT_KEY) || '{}');
    return s.date === new Date().toISOString().slice(0, 10) ? (s.count || 0) : 0;
  } catch { return 0; }
}

function incrementDailyCount() {
  const today = new Date().toISOString().slice(0, 10);
  const count = getDailyCount() + 1;
  localStorage.setItem(LIMIT_KEY, JSON.stringify({ date: today, count }));
  return count;
}

const DEFAULT_KEY = import.meta.env.VITE_ANTHROPIC_KEY || '';

const SYSTEM_PROMPT = [
  'You are a knowledgeable AI nurse tutor embedded in NurseKit Pro, a clinical reference tool for nurses.',
  'Help student nurses and qualified RNs with pharmacology, drug mechanisms, clinical scenarios, and NCLEX prep.',
  '',
  'Your role:',
  '- Explain drug mechanisms, interactions, contraindications, and nursing considerations clearly',
  '- Interpret lab values and explain their clinical significance',
  '- Give NCLEX-style 4-option questions (A-D); wait for the user\'s answer before revealing it',
  '- Use real clinical scenarios to make learning relatable',
  '- Cover: pharmacology, med-surg, cardiology, maternity, paediatrics, mental health, ADPIE, fluid & electrolytes',
  '- Keep responses under 200 words unless a detailed explanation is needed',
  '- Use short bullet points or numbered steps where helpful',
  '- End every reply with an encouraging note or a follow-up question',
].join('\n');

const QUICK_PROMPTS = [
  { label: 'NCLEX Question', text: 'Give me an NCLEX-style pharmacology question' },
  { label: 'Cardio Drugs', text: 'Quiz me on cardiovascular drugs and their nursing considerations' },
  { label: '5 Rights of Meds', text: 'Explain the 5 rights of medication administration' },
  { label: 'Clinical Scenario', text: 'Give me a clinical scenario about a patient with hypokalaemia' },
  { label: 'Insulin Types', text: 'Explain insulin types and their onset, peak, duration' },
  { label: 'Anticoagulants', text: 'What are the nursing considerations for anticoagulants?' },
];

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
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\n\n/g, '<br><br>')
    .replace(/\n/g, '<br>');
}

const getKey = () => localStorage.getItem('crn_api_key') || DEFAULT_KEY;
const saveKey = (k) => localStorage.setItem('crn_api_key', k);
const clearKey = () => localStorage.removeItem('crn_api_key');

export default function NurseKitTutor({ initialPrompt, onPromptConsumed }) {
  const { isPro, openAuthModal } = useAuth();
  const [messages, setMessages] = useState([
    { role: 'assistant', html: "Hi! I'm your <strong>NurseKit AI Tutor</strong> — ready to help you master pharmacology, clinical scenarios, and NCLEX prep.<br><br>Ask me to explain a drug, quiz you on a topic, or interpret a lab value. What shall we study today?" }
  ]);
  const [chatHistory, setChatHistory] = useState([]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [isReady, setIsReady] = useState(true);
  const [showBanner, setShowBanner] = useState(false);
  const messagesRef = useRef(null);
  const textareaRef = useRef(null);
  const initialFired = useRef(false);

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages]);

  const promptApiKey = () => {
    const key = window.prompt(
      'Paste your Anthropic API key (starts with sk-ant-).\n\nIt is saved only in this browser\'s localStorage and sent directly to api.anthropic.com.\n\nGet a key at: console.anthropic.com/settings/keys'
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
    setMessages(prev => [...prev, { role: 'assistant', html: 'API key saved! Ask me anything — I\'m ready to help you study.' }]);
  };

  const sendMessage = useCallback(async (overrideText) => {
    if (busy) return;
    const text = (overrideText ?? input).trim();
    if (!text) return;

    if (!isPro) {
      const count = getDailyCount();
      if (count >= FREE_LIMIT) {
        setMessages(prev => [...prev, {
          role: 'assistant',
          html: `You&apos;ve used your <strong>${FREE_LIMIT} free messages</strong> for today. <a href="/features#pricing">Upgrade to Pro ($9/mo)</a> for unlimited access, or sign in via the header if you already have a Pro account.`
        }]);
        return;
      }
      incrementDailyCount();
    }

    const apiKey = getKey();
    if (!apiKey) {
      setIsReady(false);
      setShowBanner(true);
      setMessages(prev => [...prev, { role: 'assistant', html: 'Please set your Anthropic API key using the banner above to activate the live tutor.' }]);
      return;
    }

    setInput('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
    setBusy(true);

    const newHistory = [...chatHistory, { role: 'user', content: text }];
    setChatHistory(newHistory);
    setMessages(prev => [...prev, { role: 'user', html: fmt(text) }]);

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
        const err = new Error((body?.error?.message) || `API error ${res.status}`);
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

  useEffect(() => {
    if (initialPrompt && !initialFired.current) {
      initialFired.current = true;
      sendMessage(initialPrompt);
      onPromptConsumed?.();
    }
  }, [initialPrompt, sendMessage, onPromptConsumed]);

  function handleKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  function handleInput(e) {
    setInput(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
  }

  return (
    <div className="nk-panel">
      {showBanner && (
        <div className="nk-api-banner">
          <span>
            Enter your <a href="https://console.anthropic.com/settings/keys" target="_blank" rel="noopener noreferrer">Anthropic API key</a> to activate the live tutor. Saved only in your browser, sent directly to Anthropic.
          </span>
          <button type="button" onClick={promptApiKey}>Set API key</button>
        </div>
      )}

      <div className="nk-section-title">AI Nurse <span>Tutor</span></div>
      <div className="nk-tutor-status">
        <div className="nk-tutor-pulse" style={!isReady ? { background: '#ccc', animation: 'none' } : {}} />
        <span>{isReady ? 'NurseKit Tutor — online' : 'NurseKit Tutor — enter API key to activate'}</span>
        {!isPro && (
          <span className="nk-tutor-limit">
            {Math.max(0, FREE_LIMIT - getDailyCount())} free messages left today
          </span>
        )}
      </div>

      <div className="nk-quick-prompts">
        {QUICK_PROMPTS.map(q => (
          <button key={q.label} className="nk-qp" disabled={busy} onClick={() => sendMessage(q.text)}>{q.label}</button>
        ))}
      </div>

      <div className="nk-chat-wrap">
        <div className="nk-chat-messages" ref={messagesRef}>
          {messages.map((m, i) => (
            <div key={i} className={`nk-chat-msg ${m.role}`} dangerouslySetInnerHTML={{ __html: m.html }} />
          ))}
          {busy && (
            <div className="nk-chat-msg assistant">
              <div className="nk-typing">
                <span className="nk-typing-dot" /><span className="nk-typing-dot" /><span className="nk-typing-dot" />
              </div>
            </div>
          )}
        </div>
        <div className="nk-chat-input-wrap">
          <textarea
            ref={textareaRef}
            className="nk-chat-input"
            placeholder="Ask a nursing question…"
            rows={1}
            value={input}
            onChange={handleInput}
            onKeyDown={handleKey}
            disabled={busy}
          />
          <button className="nk-chat-send" onClick={() => sendMessage()} disabled={busy}>
            {busy ? '…' : 'Send'}
          </button>
        </div>
      </div>
    </div>
  );
}
