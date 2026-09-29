import { Link } from 'react-router-dom';
import { Compass, Truck, Warehouse, Users, ShieldAlert, ArrowRight, Map, Globe, CheckCircle2 } from 'lucide-react';

export default function Landing() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--color-bg)' }}>
      {/* Header */}
      <header style={{ 
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
        padding: 'var(--space-lg) var(--space-3xl)', background: 'var(--color-surface)',
        borderBottom: '1px solid var(--color-border)', position: 'sticky', top: 0, zIndex: 10 
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
          <div style={{
            width: 40, height: 40, background: 'linear-gradient(135deg, var(--color-cobalt), #60A5FA)',
            borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white'
          }}>
            <Map size={24} />
          </div>
          <span style={{ fontSize: 'var(--text-lg)', fontWeight: 700, fontFamily: 'var(--font-heading)', color: 'var(--color-navy)' }}>
            Fuzaris
          </span>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-md)' }}>
          <Link to="/login" className="btn btn-ghost" style={{ textDecoration: 'none' }}>Log in</Link>
          <Link to="/register" className="btn btn-primary" style={{ textDecoration: 'none' }}>Register</Link>
        </div>
      </header>

      {/* Hero Section */}
      <section style={{ 
        padding: 'var(--space-3xl) var(--space-3xl)', 
        background: 'var(--color-navy)', color: 'white', 
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Abstract background elements */}
        <div style={{ position: 'absolute', top: '-20%', left: '-10%', width: '50%', height: '150%', background: 'radial-gradient(ellipse at center, rgba(37,99,235,0.15) 0%, rgba(11,20,38,0) 70%)', transform: 'rotate(-15deg)' }} />
        <div style={{ position: 'absolute', bottom: '-20%', right: '-10%', width: '50%', height: '150%', background: 'radial-gradient(ellipse at center, rgba(96,165,250,0.1) 0%, rgba(11,20,38,0) 70%)', transform: 'rotate(15deg)' }} />
        
        <div style={{ maxWidth: '800px', margin: '0 auto', position: 'relative', zIndex: 1 }}>

          <h1 style={{ fontSize: 'var(--text-3xl)', fontFamily: 'var(--font-heading)', marginBottom: 'var(--space-lg)', color: 'white', lineHeight: 1.2 }}>
            Integrated Fuzaris Expedition <br/>
            <span style={{ color: '#60A5FA' }}>Logistics & Asset Management</span>
          </h1>
          <p style={{ fontSize: 'var(--text-lg)', color: 'rgba(255,255,255,0.7)', margin: '0 auto var(--space-2xl)', lineHeight: 1.6 }}>
            A unified operations platform for coordinating extreme environment missions. 
            Connect your personnel, cargo, inventory, assets, and emergency response into one cohesive command center.
          </p>
          <div style={{ display: 'flex', gap: 'var(--space-md)', justifyContent: 'center' }}>
            <Link to="/login" className="btn btn-primary btn-lg" style={{ textDecoration: 'none' }}>
              Access Mission Control <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ padding: 'var(--space-3xl)', flex: 1, background: 'var(--color-bg)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-3xl)' }}>
            <h2 style={{ fontSize: 'var(--text-2xl)', fontFamily: 'var(--font-heading)', marginBottom: 'var(--space-md)' }}>Five Connected Modules</h2>
            <p style={{ color: 'var(--color-text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
              Built as one unified system, our modules share a common data layer ensuring real-time visibility across your entire operation.
            </p>
          </div>

          <div className="grid-3 animate-stagger">
            <div className="card">
              <div className="card-body">
                <div style={{ width: 48, height: 48, borderRadius: 'var(--radius-md)', background: 'var(--color-cobalt-bg)', color: 'var(--color-cobalt)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 'var(--space-lg)' }}>
                  <Compass size={24} />
                </div>
                <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 600, marginBottom: 'var(--space-sm)' }}>Expedition Management</h3>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)', lineHeight: 1.6 }}>
                  Plan and track missions, define objectives, and monitor overall progress with interconnected access to all expedition resources.
                </p>
              </div>
            </div>
            
            <div className="card">
              <div className="card-body">
                <div style={{ width: 48, height: 48, borderRadius: 'var(--radius-md)', background: 'var(--color-warning-bg)', color: 'var(--color-warning)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 'var(--space-lg)' }}>
                  <Truck size={24} />
                </div>
                <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 600, marginBottom: 'var(--space-sm)' }}>Cargo & Logistics</h3>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)', lineHeight: 1.6 }}>
                  End-to-end supply chain visibility. Track crucial cargo shipments from origin to basecamp with detailed timeline mapping.
                </p>
              </div>
            </div>

            <div className="card">
              <div className="card-body">
                <div style={{ width: 48, height: 48, borderRadius: 'var(--radius-md)', background: 'var(--color-success-bg)', color: 'var(--color-success)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 'var(--space-lg)' }}>
                  <Warehouse size={24} />
                </div>
                <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 600, marginBottom: 'var(--space-sm)' }}>Inventory & Assets</h3>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)', lineHeight: 1.6 }}>
                  Monitor critical supplies, manage high-value equipment, and schedule preventative maintenance before deployment.
                </p>
              </div>
            </div>

            <div className="card">
              <div className="card-body">
                <div style={{ width: 48, height: 48, borderRadius: 'var(--radius-md)', background: '#F5F3FF', color: '#8B5CF6', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 'var(--space-lg)' }}>
                  <Users size={24} />
                </div>
                <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 600, marginBottom: 'var(--space-sm)' }}>Personnel Tracking</h3>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)', lineHeight: 1.6 }}>
                  Manage team assignments, monitor live field locations, and log checkpoints to ensure crew safety in harsh environments.
                </p>
              </div>
            </div>

            <div className="card">
              <div className="card-body">
                <div style={{ width: 48, height: 48, borderRadius: 'var(--radius-md)', background: 'var(--color-danger-bg)', color: 'var(--color-danger)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 'var(--space-lg)' }}>
                  <ShieldAlert size={24} />
                </div>
                <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 600, marginBottom: 'var(--space-sm)' }}>Emergency Response</h3>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)', lineHeight: 1.6 }}>
                  Rapidly coordinate crisis response with instant access to nearby personnel, medical inventory, and rescue assets.
                </p>
              </div>
            </div>
            
            <div className="card" style={{ background: 'var(--color-navy)', color: 'white' }}>
              <div className="card-body" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 600, marginBottom: 'var(--space-md)' }}>Command Dashboard</h3>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <li style={{ display: 'flex', gap: '8px', alignItems: 'center', fontSize: 'var(--text-sm)', color: 'rgba(255,255,255,0.8)' }}><CheckCircle2 size={16} color="#10B981"/> Aggregated live data</li>
                  <li style={{ display: 'flex', gap: '8px', alignItems: 'center', fontSize: 'var(--text-sm)', color: 'rgba(255,255,255,0.8)' }}><CheckCircle2 size={16} color="#10B981"/> Interactive polar map</li>
                  <li style={{ display: 'flex', gap: '8px', alignItems: 'center', fontSize: 'var(--text-sm)', color: 'rgba(255,255,255,0.8)' }}><CheckCircle2 size={16} color="#10B981"/> Real-time critical alerts</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: 'var(--color-surface)', borderTop: '1px solid var(--color-border)', padding: 'var(--space-2xl) var(--space-3xl)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-lg)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
            <Map size={20} color="var(--color-cobalt)" />
            <span style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>Fuzaris Systems</span>
          </div>
          <div style={{ display: 'flex', gap: 'var(--space-xl)', fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
            <Link to="/privacy" style={{ color: 'inherit', textDecoration: 'none' }}>Privacy Policy</Link>
            <Link to="/contact" style={{ color: 'inherit', textDecoration: 'none' }}>Contact Support</Link>
          </div>
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>
            &copy; 2026 Fuzaris Ltd. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
