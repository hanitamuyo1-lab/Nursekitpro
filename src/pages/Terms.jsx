import { Link } from 'react-router-dom';

export default function Terms() {
  return (
    <>
      <div className="hero-wrap">
        <div className="page-hero">
          <h1>Terms of Service</h1>
          <p>By using Confident RN, you agree to these terms. Please read them carefully &mdash; they&rsquo;re written in plain English.</p>
        </div>
      </div>

      <main>
        <div className="prose">
          <p className="updated">Last updated: 27 May 2026</p>

          <h2>1. Acceptance of terms</h2>
          <p>By accessing or using Confident RN (&ldquo;the platform,&rdquo; &ldquo;the service&rdquo;), you agree to be bound by these Terms of Service and our <Link to="/privacy">Privacy Policy</Link>. If you do not agree, do not use the platform. These terms form a binding agreement between you and Confident RN.</p>

          <h2>2. Description of service</h2>
          <p>Confident RN provides an AI-powered nursing study platform, including an AI tutor, NCLEX preparation tools, clinical scenario learning, and related educational content. The platform is provided for educational purposes only.</p>
          <p><strong>Important:</strong> Confident RN is not a clinical decision support tool. Information provided by the AI tutor is for educational purposes only and must never be used to make real patient care decisions. Always follow your institution&rsquo;s clinical protocols and consult qualified clinical staff.</p>

          <h2>3. Eligibility</h2>
          <p>You must be at least 16 years old to use Confident RN. By using the platform, you confirm that you meet this requirement. If you are under 18, you should review these terms with a parent or guardian.</p>

          <h2>4. Your account</h2>
          <ul>
            <li>You are responsible for maintaining the security of your account credentials.</li>
            <li>You must provide accurate information when creating an account.</li>
            <li>You are responsible for all activity that occurs under your account.</li>
            <li>You must notify us immediately if you suspect unauthorised access to your account.</li>
            <li>You may not create multiple accounts to circumvent free-tier limits.</li>
          </ul>

          <h2>5. Acceptable use</h2>
          <p>You agree not to:</p>
          <ul>
            <li>Use the platform to provide or seek real medical or clinical advice for actual patients.</li>
            <li>Share, resell, or sublicense access to the platform.</li>
            <li>Attempt to reverse-engineer, copy, or reproduce the platform or its AI systems.</li>
            <li>Use automated tools to scrape or extract content from the platform.</li>
            <li>Circumvent any access controls or usage limits.</li>
            <li>Use the platform in any way that violates applicable law or regulation.</li>
            <li>Submit abusive, offensive, or illegal content to the AI tutor.</li>
          </ul>

          <h2>6. Subscriptions and payment</h2>
          <h3>Free plan</h3>
          <p>The free plan is available without payment and provides limited daily usage as described on our pricing page.</p>
          <h3>Pro monthly subscription</h3>
          <p>The Pro monthly subscription is billed in advance each calendar month. Your subscription renews automatically unless cancelled before the renewal date. Payments are processed by Stripe.</p>
          <h3>Lifetime access</h3>
          <p>The lifetime access plan is a one-time purchase that provides Pro-level access for the lifetime of the Confident RN platform. &ldquo;Lifetime&rdquo; refers to the operational life of the platform, not your personal lifetime.</p>
          <h3>Refunds</h3>
          <p>If you are unsatisfied with your Pro subscription within the first 7 days, contact us for a full refund. After 7 days, we do not offer refunds for subscription payments already made. Lifetime access purchases are non-refundable after 14 days.</p>

          <h2>7. Intellectual property</h2>
          <p>All content, design, branding, and code on the Confident RN platform are owned by or licensed to Confident RN. You may not reproduce, distribute, or create derivative works from our content without written permission.</p>
          <p>Content you input into the AI tutor remains yours. By submitting it, you grant us a limited licence to process it for the purpose of providing the service.</p>

          <h2>8. AI-generated content</h2>
          <p>The AI tutor generates responses dynamically. While we have trained it carefully and review its system instructions, we cannot guarantee the accuracy or completeness of every response. You should:</p>
          <ul>
            <li>Cross-reference important information with authoritative nursing textbooks or your institution&rsquo;s materials.</li>
            <li>Not rely solely on AI-generated content for clinical practice.</li>
            <li>Report any responses that appear clinically inaccurate to <a href="mailto:FashionRN123@Gmail.com">FashionRN123@Gmail.com</a>.</li>
          </ul>

          <h2>9. Disclaimers and limitation of liability</h2>
          <p>Confident RN is provided &ldquo;as is&rdquo; without warranties of any kind, express or implied. We do not warrant that the platform will be error-free, uninterrupted, or suitable for any particular purpose.</p>
          <p>To the fullest extent permitted by law, Confident RN shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the platform, including any damages resulting from reliance on AI-generated content for clinical decisions.</p>
          <p>Our total liability for any claim arising from your use of the platform shall not exceed the amount you paid us in the 12 months prior to the claim.</p>

          <h2>10. Third-party services</h2>
          <p>The platform integrates with third-party services including Anthropic (AI processing) and Stripe (payment processing). Your use of these services is governed by their respective terms and privacy policies. We are not responsible for the actions of these third parties.</p>

          <h2>11. Termination</h2>
          <p>We may suspend or terminate your account if you violate these terms, without notice or liability. You may delete your account at any time from your account settings. Upon termination, your right to use the platform ceases immediately.</p>

          <h2>12. Changes to terms</h2>
          <p>We may update these terms from time to time. We will notify you of material changes by email or by posting a notice on the platform. Continued use of the platform after changes take effect constitutes acceptance of the new terms.</p>

          <h2>13. Governing law</h2>
          <p>These terms are governed by the laws of the jurisdiction in which Confident RN is incorporated. Any disputes shall be resolved in the courts of that jurisdiction, subject to any mandatory consumer rights that apply in your country.</p>

          <h2>14. Contact</h2>
          <p>For questions about these terms, contact us at <a href="mailto:FashionRN123@Gmail.com">FashionRN123@Gmail.com</a>.</p>
        </div>
      </main>
    </>
  );
}
