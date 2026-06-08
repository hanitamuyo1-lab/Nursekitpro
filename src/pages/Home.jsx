import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <>
      {/* HERO */}
      <div className="hero-wrap">
        <div className="hero">
          <div>
            <h1>The AI tutor that turns student nurses into confident RNs</h1>
            <p className="hero-sub">Study smarter with 24/7 AI-powered quizzes, NCLEX prep, clinical scenarios, and instant explanations &mdash; all in one place.</p>
            <div className="hero-meta">
              <Link to="/features#tutor" className="btn btn-primary">Try the AI tutor free</Link>
              <Link to="/features#pricing" className="btn btn-ghost">See pricing</Link>
            </div>
          </div>
          <aside className="whats-new" aria-label="What's new">
            <h2><Link to="/features#tutor">What&apos;s new</Link></h2>
            <p>May 2026 &mdash; new <Link to="/features#tutor">live AI tutor demo</Link> with updated NCLEX packs covering pediatrics, OB, and mental health. No sign-up required.</p>
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

      {/* BENEFITS */}
      <section className="panel-grey">
        <div className="section">
          <div className="section-head" style={{ textAlign: 'center', maxWidth: '100%' }}>
            <div className="eyebrow">Why Confident RN works</div>
            <h2 className="title" style={{ maxWidth: 640, margin: '0 auto 8px' }}>Everything a student nurse needs, in one pocket-sized tutor</h2>
            <p className="lede" style={{ maxWidth: 600, margin: '0 auto' }}>Built by nurses, for nurses &mdash; because passing NCLEX is just the beginning.</p>
          </div>
          <div style={{ marginTop: 48 }} className="benefit-grid">
            <div className="benefit">
              <div className="benefit-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18"/>
                </svg>
              </div>
              <h3>AI-powered quizzes</h3>
              <p>Get instant, personalised quiz questions on any nursing topic &mdash; generated fresh every time you ask.</p>
            </div>
            <div className="benefit">
              <div className="benefit-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                </svg>
              </div>
              <h3>Study anytime, anywhere</h3>
              <p>Your AI tutor is always on. 2am before a placement? Saturday afternoon? It never takes a day off.</p>
            </div>
            <div className="benefit">
              <div className="benefit-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
                </svg>
              </div>
              <h3>Real clinical scenarios</h3>
              <p>Learn from real patient cases, not just textbook theory. Walk the ward prepared and confident.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURE HIGHLIGHT */}
      <section>
        <div className="section">
          <div className="section-head">
            <div className="eyebrow">Full feature set</div>
            <h2 className="title">Everything you need to pass and excel</h2>
            <p className="lede">From NCLEX prep to medication safety &mdash; Confident RN covers it all.</p>
          </div>
          <div className="card-grid">
            <article className="card">
              <h3><Link to="/features#tutor">AI quizzes on demand</Link></h3>
              <p>Ask to be quizzed on vital signs, pharmacology, ADPIE, electrolytes &mdash; and get instant feedback.</p>
            </article>
            <article className="card">
              <h3><Link to="/features#tutor">NCLEX-style questions</Link></h3>
              <p>Realistic 4-option questions with full explanations, just like the real exam.</p>
            </article>
            <article className="card">
              <h3><Link to="/features#tutor">Medication safety</Link></h3>
              <p>Master the 5 rights, drug classes, and dosage calculations with ease.</p>
            </article>
          </div>
          <div style={{ marginTop: 28, textAlign: 'center' }}>
            <Link to="/features" className="btn btn-red">See all features &rarr;</Link>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="panel-grey">
        <div className="section">
          <div className="section-head">
            <div className="eyebrow">Student reviews</div>
            <h2 className="title">Nurses who passed and thrived</h2>
            <p className="lede">Real students, real results from around the world.</p>
          </div>
          <div className="testi-grid">
            <div className="testi-card">
              <div className="stars" aria-label="5 out of 5 stars">★★★★★</div>
              <blockquote>I failed my NCLEX twice before finding this. The AI quizzes finally made everything click. Passed on my third attempt!</blockquote>
              <div className="testi-name">Amara T.</div>
              <div className="testi-role">Newly qualified RN, Ghana</div>
            </div>
            <div className="testi-card">
              <div className="stars" aria-label="5 out of 5 stars">★★★★★</div>
              <blockquote>Like having a consultant in my pocket &mdash; explains everything without making me feel stupid.</blockquote>
              <div className="testi-name">Jessica M.</div>
              <div className="testi-role">Student nurse, United Kingdom</div>
            </div>
            <div className="testi-card">
              <div className="stars" aria-label="5 out of 5 stars">★★★★★</div>
              <blockquote>I went from dreading my placement to feeling genuinely prepared. Worth every penny.</blockquote>
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
            <Link to="/features#tutor" className="btn btn-primary">Try the tutor free</Link>
            <Link to="/features#pricing" className="btn btn-ghost">See plans</Link>
          </div>
        </div>
      </section>
    </>
  );
}
