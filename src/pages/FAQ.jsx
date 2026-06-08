import { useState } from 'react';
import { Link } from 'react-router-dom';

function FaqItem({ question, answer }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`faq-item${open ? ' open' : ''}`}>
      <button className="faq-q" aria-expanded={open} onClick={() => setOpen(o => !o)}>
        {question}
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      <div className="faq-a" dangerouslySetInnerHTML={{ __html: answer }} />
    </div>
  );
}

const FAQ_DATA = [
  {
    section: 'General',
    items: [
      { q: 'What is Confident RN?', a: 'Confident RN is an AI-powered nursing study platform. It gives student nurses and newly qualified RNs access to a 24/7 AI tutor that can explain concepts, quiz them on clinical topics, generate NCLEX-style questions, and walk through real patient scenarios &mdash; all in plain, accessible language.' },
      { q: 'Who is Confident RN for?', a: 'Confident RN is designed for nursing students in their first few years of study and newly qualified RNs. It is particularly useful for anyone preparing for NCLEX, preparing for clinical placements, or wanting to build deeper knowledge of nursing theory and practice. Students from over 60 countries use the platform.' },
      { q: 'Is Confident RN created by real nurses?', a: 'Yes. Confident RN was founded by practising nurses and is overseen by a Head of Education with extensive nurse educator experience. All content and AI system prompts are reviewed by qualified nursing professionals to ensure clinical accuracy.' },
    ],
  },
  {
    section: 'AI Tutor',
    items: [
      { q: 'How does the AI tutor work?', a: 'The AI tutor is powered by Claude, Anthropic&rsquo;s large language model. It has been given detailed instructions to behave as a warm, encouraging nursing tutor. You can ask it to explain concepts, quiz you, give you NCLEX-style questions, or walk through clinical scenarios. It remembers what you&rsquo;ve discussed within the same session so the conversation stays coherent.' },
      { q: 'Can I use the AI tutor without creating an account?', a: 'Yes. You can try the live AI tutor on our Features page without signing up or entering payment details. You will need to provide your own Anthropic API key to power the tutor &mdash; you can get one free at console.anthropic.com. Free accounts have usage limits; a Pro subscription gives you unlimited access.' },
      { q: 'Is the AI tutor clinically accurate?', a: 'The AI tutor is highly accurate for educational purposes and is reviewed by qualified nurses. However, it is a study tool &mdash; not a clinical decision support system. Never use it to make real patient care decisions. For clinical practice, always follow your institution&rsquo;s protocols and consult your supervising nurse or doctor.' },
      { q: 'What topics can the AI tutor cover?', a: 'The tutor covers the full breadth of pre-registration nursing content including: anatomy &amp; physiology, pharmacology, vital signs, ADPIE, fluid &amp; electrolytes, medication safety, medical-surgical nursing, pediatric nursing, obstetric nursing, mental health nursing, NCLEX-style questions, clinical scenarios, and more.' },
    ],
  },
  {
    section: 'NCLEX Prep',
    items: [
      { q: 'Does Confident RN cover the NCLEX-RN and NCLEX-PN?', a: 'Yes. The AI tutor can generate practice questions aligned with both NCLEX-RN and NCLEX-PN formats. It covers all NCLEX client need categories including Safe and Effective Care Environment, Health Promotion and Maintenance, Psychosocial Integrity, and Physiological Integrity.' },
      { q: 'How is Confident RN different from other NCLEX prep tools?', a: 'Most NCLEX prep tools give you a bank of pre-written questions. Confident RN generates fresh questions in real time and, more importantly, explains the &ldquo;why&rdquo; behind every answer in a way that builds genuine understanding &mdash; not just test-taking strategies. It also adapts to your level in conversation.' },
    ],
  },
  {
    section: 'Pricing & Subscription',
    items: [
      { q: 'What does the free plan include?', a: 'The free plan gives you 10 questions per day, basic topic explanations, 2 NCLEX-style questions per day, and access to the community. It is genuinely useful &mdash; not a crippled demo. We want you to see real value before you pay.' },
      { q: 'Can I cancel my Pro subscription anytime?', a: 'Yes. Cancel anytime from your account settings. You keep full access until the end of the billing period you have paid for. There are no cancellation fees and no awkward hoops to jump through.' },
      { q: 'Is the lifetime plan really lifetime?', a: 'Yes. A single payment of $97 gets you full Pro access for as long as Confident RN exists, including all future updates, new content, and new AI features at no additional cost.' },
    ],
  },
  {
    section: 'Technical',
    items: [
      { q: 'Does the platform work on mobile?', a: 'Yes. The platform is fully responsive and works well on phones and tablets. Many students use it on their phone between lectures or before shifts.' },
      { q: 'Is my data safe?', a: 'Yes. We take data privacy seriously. Your API key is stored only in your own browser and never transmitted to our servers. Conversation data is processed by Anthropic under their privacy policy. We do not sell personal data. See our <a href="/privacy">Privacy Policy</a> for full details.' },
      { q: "I have a question that isn't answered here. How do I contact you?", a: 'Email us at <a href="mailto:FashionRN123@Gmail.com">FashionRN123@Gmail.com</a>. We typically respond within one business day. Pro subscribers get priority support.' },
    ],
  },
];

export default function FAQ() {
  return (
    <>
      <div className="hero-wrap">
        <div className="page-hero">
          <h1>Frequently asked questions</h1>
          <p>Everything you need to know about Confident RN &mdash; from how the AI tutor works to what happens when you subscribe.</p>
        </div>
      </div>

      <section>
        <div className="section">
          <div className="faq-list">
            {FAQ_DATA.map(group => (
              <div key={group.section}>
                <div className="eyebrow faq-section-title">{group.section}</div>
                {group.items.map(item => (
                  <FaqItem key={item.q} question={item.q} answer={item.a} />
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cta">
        <div className="cta-inner">
          <div>
            <h2>Still have questions?</h2>
            <p>Try the AI tutor for free &mdash; no credit card required, no sign-up needed.</p>
          </div>
          <div className="cta-actions">
            <Link to="/features#tutor" className="btn btn-primary">Try the tutor free</Link>
            <Link to="/features#pricing" className="btn btn-ghost">See plans</Link>
          </div>
        </div>
      </section>
    </>
  );
}
