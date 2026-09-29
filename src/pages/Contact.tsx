import { Link } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, MapPin } from 'lucide-react';

export default function Contact() {
  return (
    <div style={{ padding: 'var(--space-3xl)', maxWidth: '1000px', margin: '0 auto' }}>
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-text-secondary)', textDecoration: 'none', marginBottom: 'var(--space-2xl)', fontWeight: 500 }}>
        <ArrowLeft size={18} /> Back to Home
      </Link>
      <h1 style={{ fontSize: 'var(--text-3xl)', fontFamily: 'var(--font-heading)', color: 'var(--color-navy)', marginBottom: 'var(--space-xl)' }}>Contact Us</h1>
      
      <div className="grid-2" style={{ gap: 'var(--space-2xl)' }}>
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 600 }}>Get in Touch</h2>
          <p style={{ color: 'var(--color-text-secondary)' }}>We're here to help and answer any question you might have. We look forward to hearing from you.</p>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ padding: '12px', background: 'rgba(37, 99, 235, 0.1)', color: 'var(--color-cobalt)', borderRadius: '50%' }}>
              <Mail size={24} />
            </div>
            <div>
              <div style={{ fontWeight: 600 }}>Email</div>
              <div style={{ color: 'var(--color-text-secondary)' }}>support@fuzaris.com</div>
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ padding: '12px', background: 'rgba(37, 99, 235, 0.1)', color: 'var(--color-cobalt)', borderRadius: '50%' }}>
              <Phone size={24} />
            </div>
            <div>
              <div style={{ fontWeight: 600 }}>Phone</div>
              <div style={{ color: 'var(--color-text-secondary)' }}>+1 (555) 123-4567</div>
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ padding: '12px', background: 'rgba(37, 99, 235, 0.1)', color: 'var(--color-cobalt)', borderRadius: '50%' }}>
              <MapPin size={24} />
            </div>
            <div>
              <div style={{ fontWeight: 600 }}>Office</div>
              <div style={{ color: 'var(--color-text-secondary)' }}>123 Logistics Way, Oslo, Norway</div>
            </div>
          </div>
        </div>
        
        <div className="card">
          <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 600, marginBottom: '24px' }}>Send us a Message</h2>
          <form style={{ display: 'flex', flexDirection: 'column', gap: '16px' }} onSubmit={e => e.preventDefault()}>
            <div className="form-group">
              <label className="form-label">Name</label>
              <input type="text" className="form-input" placeholder="Your name" />
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input type="email" className="form-input" placeholder="Your email" />
            </div>
            <div className="form-group">
              <label className="form-label">Message</label>
              <textarea className="form-input" rows={5} placeholder="How can we help you?"></textarea>
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>Send Message</button>
          </form>
        </div>
      </div>
    </div>
  );
}
