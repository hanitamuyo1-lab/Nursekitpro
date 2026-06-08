import { Link } from 'react-router-dom';

export default function About() {
  return (
    <>
      <div className="hero-wrap">
        <div className="page-hero">
          <h1>About Confident RN</h1>
          <p>We build AI-powered tools that give every nursing student the personalised support they deserve &mdash; regardless of where they study or what they can afford.</p>
        </div>
      </div>

      {/* MISSION */}
      <section>
        <div className="section">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'center' }} className="about-split">
            <div>
              <div className="eyebrow">Our mission</div>
              <h2 className="title">Every nurse deserves a great tutor</h2>
              <p className="lede" style={{ marginBottom: 18 }}>Nursing school is brutal. The volume of material, the pace of placements, and the pressure of exams leave too many students feeling overwhelmed and underprepared.</p>
              <p style={{ fontSize: 16, lineHeight: 1.7, color: 'var(--ink-soft)' }}>We built Confident RN because we believe every student nurse &mdash; whether they study in London, Lagos, or Louisville &mdash; should have access to a knowledgeable, patient, always-available tutor. Not a chatbot that guesses, but a genuine learning partner trained on real nursing knowledge.</p>
            </div>
            <div style={{ background: 'var(--bg-grey)', padding: 36, borderLeft: '6px solid var(--red)' }}>
              <div style={{ fontSize: 48, fontWeight: 800, color: 'var(--red)', lineHeight: 1, marginBottom: 8 }}>72%</div>
              <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--ink)', marginBottom: 20 }}>of student nurses say they feel underprepared for their first clinical placement</div>
              <div style={{ fontSize: 48, fontWeight: 800, color: 'var(--red)', lineHeight: 1, marginBottom: 8 }}>1 in 4</div>
              <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--ink)' }}>NCLEX candidates fail on their first attempt &mdash; most could have passed with better support</div>
            </div>
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section className="panel-grey">
        <div className="section">
          <div className="section-head">
            <div className="eyebrow">What we believe</div>
            <h2 className="title">Our values</h2>
            <p className="lede">These principles shape every decision we make about the platform.</p>
          </div>
          <div className="values-grid">
            <div className="value-card">
              <h3>Clarity over complexity</h3>
              <p>Nursing knowledge is already dense. We make explanations simple, visual where possible, and always tied to real clinical contexts &mdash; not just textbook definitions.</p>
            </div>
            <div className="value-card">
              <h3>Encouragement, not judgement</h3>
              <p>Students learn better when they feel safe to be wrong. Our AI tutor never makes you feel stupid. Every question is a good question.</p>
            </div>
            <div className="value-card">
              <h3>Accessibility first</h3>
              <p>A free tier that&apos;s genuinely useful. Pricing that&apos;s fair. A platform that works on any device, at any time, anywhere in the world.</p>
            </div>
            <div className="value-card">
              <h3>Evidence-based learning</h3>
              <p>We use spaced repetition, active recall, and clinical scenario learning &mdash; methods with strong evidence behind them, not gimmicks.</p>
            </div>
          </div>
        </div>
      </section>

      {/* STORY */}
      <section>
        <div className="prose">
          <div className="eyebrow">Our story</div>
          <h2 style={{ fontSize: 32, fontWeight: 800, color: 'var(--ink)', margin: '12px 0 20px', border: 'none', padding: 0 }}>How Confident RN came to be</h2>
          <p>Confident RN was founded in 2024 by a team of nurses and educators who experienced first-hand how overwhelming nursing school can be. During clinical placements, there was no one to ask &ldquo;why do we do it this way?&rdquo; at 2am. During NCLEX prep, the sheer volume of material felt impossible to retain.</p>
          <p>We built the first version of Confident RN as a simple quiz tool. Within weeks, students from over 30 countries had signed up &mdash; not because it was fancy, but because having something that could patiently explain the same concept five different ways made an enormous difference.</p>
          <p>Today, Confident RN is used by thousands of nursing students worldwide, from first-year undergrads in the United Kingdom to internationally trained nurses preparing for the NCLEX in the United States. We are growing fast, but our mission hasn&rsquo;t changed: every nurse deserves a great tutor.</p>
        </div>
      </section>

      {/* TEAM */}
      <section className="panel-grey">
        <div className="section">
          <div className="section-head">
            <div className="eyebrow">The team</div>
            <h2 className="title">Built by nurses, for nurses</h2>
            <p className="lede">Every person on our team has worked in or alongside clinical nursing.</p>
          </div>
          <div className="team-grid">
            <div className="team-card">
              <div className="team-avatar">SR</div>
              <div className="team-name">Sarah R.</div>
              <div className="team-role">Co-founder &amp; CEO</div>
              <div className="team-bio">Former ICU nurse with 8 years of clinical experience. Completed her MSN before founding Confident RN.</div>
            </div>
            <div className="team-card">
              <div className="team-avatar">MK</div>
              <div className="team-name">Marcus K.</div>
              <div className="team-role">Co-founder &amp; CTO</div>
              <div className="team-bio">Healthcare technologist who spent 5 years building clinical decision support tools before pivoting to nursing education.</div>
            </div>
            <div className="team-card">
              <div className="team-avatar">AO</div>
              <div className="team-name">Adeola O.</div>
              <div className="team-role">Head of Education</div>
              <div className="team-bio">Nurse educator and NCLEX coach with experience training nursing students across three continents.</div>
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
            <Link to="/features#tutor" className="btn btn-primary">Try the tutor free</Link>
            <Link to="/features#pricing" className="btn btn-ghost">See plans</Link>
          </div>
        </div>
      </section>
    </>
  );
}
