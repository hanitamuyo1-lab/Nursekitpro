import { Link } from 'react-router-dom';

export default function Privacy() {
  return (
    <>
      <div className="hero-wrap">
        <div className="page-hero">
          <h1>Privacy Policy</h1>
          <p>We are committed to protecting your privacy. This policy explains what data we collect, how we use it, and your rights.</p>
        </div>
      </div>

      <main>
        <div className="prose">
          <p className="updated">Last updated: 27 May 2026</p>

          <h2>1. Who we are</h2>
          <p>Confident RN (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) operates the website at confidentrn.com and provides the Confident RN AI nurse tutoring platform. If you have questions about this policy, contact us at <a href="mailto:FashionRN123@Gmail.com">FashionRN123@Gmail.com</a>.</p>

          <h2>2. Information we collect</h2>
          <h3>Information you give us</h3>
          <ul>
            <li><strong>Account information:</strong> your email address and password when you create an account.</li>
            <li><strong>Payment information:</strong> billing details processed by Stripe on our behalf. We do not store your full card number.</li>
            <li><strong>Communications:</strong> if you email us or contact support, we keep a record of that correspondence.</li>
          </ul>
          <h3>Information collected automatically</h3>
          <ul>
            <li><strong>Usage data:</strong> pages visited, features used, session duration, and error logs.</li>
            <li><strong>Device information:</strong> browser type, operating system, and approximate location (country/region via IP).</li>
            <li><strong>Cookies:</strong> see Section 5 below.</li>
          </ul>
          <h3>What we do NOT collect</h3>
          <ul>
            <li>Your Anthropic API key is stored only in your own browser&rsquo;s <code>localStorage</code>. It is never transmitted to our servers.</li>
            <li>The content of your AI tutor conversations is processed by Anthropic under their privacy policy and is not stored by Confident RN.</li>
          </ul>

          <h2>3. How we use your information</h2>
          <ul>
            <li>To create and manage your account.</li>
            <li>To process payments and send receipts.</li>
            <li>To provide, maintain, and improve the platform.</li>
            <li>To send service-related communications (e.g., password resets, subscription confirmations).</li>
            <li>To send optional marketing emails if you opt in. You can unsubscribe at any time.</li>
            <li>To detect and prevent fraud or abuse.</li>
            <li>To comply with legal obligations.</li>
          </ul>

          <h2>4. Legal basis for processing (GDPR)</h2>
          <p>If you are in the European Economic Area, United Kingdom, or other jurisdictions with similar laws, we process your data under the following legal bases:</p>
          <ul>
            <li><strong>Contract:</strong> processing necessary to provide the service you signed up for.</li>
            <li><strong>Legitimate interests:</strong> improving the platform and preventing fraud.</li>
            <li><strong>Consent:</strong> marketing emails (you can withdraw consent at any time).</li>
            <li><strong>Legal obligation:</strong> complying with applicable laws.</li>
          </ul>

          <h2>5. Cookies</h2>
          <p>We use the following types of cookies:</p>
          <ul>
            <li><strong>Essential cookies:</strong> required for the platform to function (e.g., keeping you logged in). You cannot opt out of these.</li>
            <li><strong>Analytics cookies:</strong> help us understand how users interact with the platform (e.g., which features are most used). You can opt out via your browser settings.</li>
            <li><strong>Marketing cookies:</strong> used only if you consent. We do not use third-party advertising networks.</li>
          </ul>

          <h2>6. Data sharing</h2>
          <p>We do not sell your personal data. We share data only with:</p>
          <ul>
            <li><strong>Stripe:</strong> to process payments. Stripe&rsquo;s privacy policy applies to data they hold.</li>
            <li><strong>Anthropic:</strong> AI conversation content is sent to Anthropic&rsquo;s API. Their privacy policy governs this data.</li>
            <li><strong>Infrastructure providers:</strong> hosting and analytics services under appropriate data processing agreements.</li>
            <li><strong>Law enforcement:</strong> if required by valid legal process.</li>
          </ul>

          <h2>7. Data retention</h2>
          <p>We keep your account data for as long as your account is active, plus up to 2 years after you delete it (for legal and fraud-prevention purposes). Payment records are kept for 7 years as required by financial regulations. You can request earlier deletion by emailing us.</p>

          <h2>8. Your rights</h2>
          <p>Depending on your jurisdiction, you may have the right to:</p>
          <ul>
            <li>Access a copy of the personal data we hold about you.</li>
            <li>Correct inaccurate data.</li>
            <li>Delete your account and associated data.</li>
            <li>Restrict or object to certain processing.</li>
            <li>Data portability (receive your data in a machine-readable format).</li>
            <li>Lodge a complaint with your local data protection authority.</li>
          </ul>
          <p>To exercise any of these rights, email <a href="mailto:FashionRN123@Gmail.com">FashionRN123@Gmail.com</a>. We will respond within 30 days.</p>

          <h2>9. International transfers</h2>
          <p>Confident RN operates globally. Your data may be processed in countries outside your own, including the United States. Where required, we use standard contractual clauses approved by the European Commission to ensure appropriate protection.</p>

          <h2>10. Children</h2>
          <p>Confident RN is not directed at children under 16. If you believe a child has provided us with personal data, please contact us and we will delete it promptly.</p>

          <h2>11. Changes to this policy</h2>
          <p>We may update this policy from time to time. We will notify you of significant changes by email or by posting a prominent notice on the platform. The &ldquo;last updated&rdquo; date at the top of this page reflects the most recent revision.</p>

          <h2>12. Contact</h2>
          <p>Questions or concerns about your privacy? Contact us at <a href="mailto:FashionRN123@Gmail.com">FashionRN123@Gmail.com</a> or write to: Confident RN, Privacy Team, [Address].</p>
        </div>
      </main>
    </>
  );
}
