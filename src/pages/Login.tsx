import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Map, ArrowRight, ArrowLeft, AlertCircle, ShieldCheck, Globe, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../lib/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      await login(email, password);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Invalid email or password');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: 'white' }}>
      
      {/* Left Side: Enterprise Branding */}
      <div style={{ 
        flex: 1, 
        background: 'var(--color-navy)', 
        position: 'relative', 
        overflow: 'hidden',
      }} className="hide-on-mobile">
        {/* Abstract Background Elements */}
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'radial-gradient(circle at 20% 30%, rgba(37,99,235,0.15) 0%, rgba(11,20,38,1) 70%)' }} />
        <div style={{ position: 'absolute', bottom: '-10%', right: '-10%', width: '60%', height: '60%', background: 'radial-gradient(circle at center, rgba(96,165,250,0.1) 0%, rgba(11,20,38,0) 70%)', transform: 'rotate(15deg)' }} />
        
        {/* Decorative Grid */}
        <div style={{ 
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, 
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
          backgroundSize: '40px 40px', zIndex: 0 
        }} />

        <div style={{ position: 'relative', zIndex: 1, padding: 'var(--space-3xl)', display: 'flex', flexDirection: 'column', height: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
            <div style={{
              width: 48, height: 48, background: 'linear-gradient(135deg, var(--color-cobalt), #60A5FA)',
              borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white'
            }}>
              <Map size={28} />
            </div>
            <span style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, fontFamily: 'var(--font-heading)', color: 'white' }}>
              Fuzaris
            </span>
          </div>

          <div style={{ margin: 'auto 0' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', background: 'rgba(255,255,255,0.1)', borderRadius: 'var(--radius-full)', marginBottom: 'var(--space-xl)', fontSize: 'var(--text-sm)', color: 'white', backdropFilter: 'blur(4px)' }}>
              <ShieldCheck size={16} color="#60A5FA" /> Secure Access Portal
            </div>
            <h1 style={{ fontSize: '3rem', fontFamily: 'var(--font-heading)', color: 'white', lineHeight: 1.1, marginBottom: 'var(--space-lg)' }}>
              Logistics & Asset<br/>
              <span style={{ color: '#60A5FA' }}>Management System</span>
            </h1>
            <p style={{ fontSize: 'var(--text-lg)', color: 'rgba(255,255,255,0.6)', maxWidth: '480px', lineHeight: 1.6 }}>
              Centralized command center for managing critical extreme-environment operations, personnel tracking, and emergency response.
            </p>
          </div>

          <div style={{ display: 'flex', gap: 'var(--space-xl)', color: 'rgba(255,255,255,0.5)', fontSize: 'var(--text-sm)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle2 size={16} color="#10B981"/> SOC2 Compliant</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Globe size={16} color="#60A5FA"/> Offline Sync</span>
          </div>
        </div>
      </div>

      {/* Right Side: Form */}
      <div style={{ flex: '1 1 50%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--space-2xl)', position: 'relative' }}>
        
        {/* Back Button */}
        <Link to="/" style={{ 
          position: 'absolute', top: 'var(--space-2xl)', left: 'var(--space-2xl)', 
          display: 'flex', alignItems: 'center', gap: '8px', 
          color: 'var(--color-text-secondary)', textDecoration: 'none', 
          fontWeight: 500, fontSize: 'var(--text-sm)',
          transition: 'color 0.2s'
        }}
        onMouseEnter={e => e.currentTarget.style.color = 'var(--color-navy)'}
        onMouseLeave={e => e.currentTarget.style.color = 'var(--color-text-secondary)'}
        >
          <ArrowLeft size={18} /> Back to Home
        </Link>

        <div style={{ maxWidth: '440px', width: '100%' }} className="animate-fade-in">
          
          <div style={{ marginBottom: 'var(--space-2xl)' }}>
            <h2 style={{ fontSize: 'var(--text-3xl)', fontWeight: 700, fontFamily: 'var(--font-heading)', color: 'var(--color-navy)', marginBottom: '8px' }}>
              Welcome back
            </h2>
            <p style={{ fontSize: 'var(--text-md)', color: 'var(--color-text-secondary)' }}>
              Please enter your details to sign in.
            </p>
          </div>

          {error && (
            <div style={{ 
              background: 'var(--color-danger-bg)', color: 'var(--color-danger)', 
              padding: 'var(--space-md)', borderRadius: 'var(--radius-md)', 
              fontSize: 'var(--text-sm)', marginBottom: 'var(--space-xl)',
              display: 'flex', alignItems: 'center', gap: '8px',
              border: '1px solid rgba(239, 68, 68, 0.2)'
            }}>
              <AlertCircle size={18} /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xl)' }}>
            <div>
              <label style={{ display: 'block', fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-navy)', marginBottom: '8px' }}>Email</label>
              <input 
                type="email" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                style={{ 
                  width: '100%', padding: '14px 16px', borderRadius: 'var(--radius-md)', 
                  border: '1px solid var(--color-border)', outline: 'none', fontSize: 'var(--text-md)',
                  transition: 'all 0.2s',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                }}
                onFocus={e => e.target.style.borderColor = 'var(--color-cobalt)'}
                onBlur={e => e.target.style.borderColor = 'var(--color-border)'}
                placeholder="Enter your email"
              />
            </div>
            
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <label style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-navy)' }}>Password</label>
                <a href="#" style={{ fontSize: 'var(--text-sm)', color: 'var(--color-cobalt)', fontWeight: 500, textDecoration: 'none' }}>Forgot password?</a>
              </div>
              <input 
                type="password" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                style={{ 
                  width: '100%', padding: '14px 16px', borderRadius: 'var(--radius-md)', 
                  border: '1px solid var(--color-border)', outline: 'none', fontSize: 'var(--text-md)',
                  transition: 'all 0.2s',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                }}
                onFocus={e => e.target.style.borderColor = 'var(--color-cobalt)'}
                onBlur={e => e.target.style.borderColor = 'var(--color-border)'}
                placeholder="••••••••"
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '14px', justifyContent: 'center', fontSize: 'var(--text-md)', marginTop: '8px', borderRadius: 'var(--radius-md)' }}>
              Sign in <ArrowRight size={18} />
            </button>
          </form>

          <div style={{ marginTop: 'var(--space-2xl)', textAlign: 'center', fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
            Don't have an account? <Link to="/register" style={{ color: 'var(--color-cobalt)', fontWeight: 600, textDecoration: 'none' }}>Sign up</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
