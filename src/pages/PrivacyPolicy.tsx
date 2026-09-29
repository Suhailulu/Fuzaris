import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPolicy() {
  return (
    <div style={{ padding: 'var(--space-3xl)', maxWidth: '800px', margin: '0 auto' }}>
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-text-secondary)', textDecoration: 'none', marginBottom: 'var(--space-2xl)', fontWeight: 500 }}>
        <ArrowLeft size={18} /> Back to Home
      </Link>
      <h1 style={{ fontSize: 'var(--text-3xl)', fontFamily: 'var(--font-heading)', color: 'var(--color-navy)', marginBottom: 'var(--space-xl)' }}>Privacy Policy</h1>
      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <p style={{ color: 'var(--color-text-secondary)' }}>Last updated: September 29, 2026</p>
        <p>At Fuzaris, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our application.</p>
        <h2 style={{ fontSize: 'var(--text-xl)', marginTop: 'var(--space-lg)' }}>Information We Collect</h2>
        <p>We collect personal information that you voluntarily provide to us when you register on the application, express an interest in obtaining information about us or our products and services.</p>
        <h2 style={{ fontSize: 'var(--text-xl)', marginTop: 'var(--space-lg)' }}>How We Use Your Information</h2>
        <p>We use personal information collected via our application for a variety of business purposes described below. We process your personal information for these purposes in reliance on our legitimate business interests.</p>
        <ul style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <li>To facilitate account creation and logon process.</li>
          <li>To send administrative information to you.</li>
          <li>To fulfill and manage your orders and requests.</li>
        </ul>
        <h2 style={{ fontSize: 'var(--text-xl)', marginTop: 'var(--space-lg)' }}>Contact Us</h2>
        <p>If you have questions or comments about this notice, you may email us at privacy@fuzaris.com.</p>
      </div>
    </div>
  );
}
