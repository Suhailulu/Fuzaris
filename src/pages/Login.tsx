import { useState } from 'react';
import { useAuth } from '../lib/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Activity, Compass, Shield } from 'lucide-react';

export function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(email, password);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Unable to sign in. Please check your credentials and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-layout">
      {/* Sidebar / Branding */}
      <div className="auth-sidebar">
        <div className="flex items-center gap-3 mb-8">
          <Compass size={48} className="text-[#00A8E8]" />
          <span className="text-2xl font-bold tracking-widest text-white/90">SIH-26062</span>
        </div>
        
        <h1>POLAR-IMS</h1>
        <p className="mb-8">
          Integrated Polar Expedition Logistics and Asset Management System. Secure, real-time control over extreme environment operations.
        </p>

        <div className="flex flex-col gap-4 mt-8">
          <div className="flex items-center gap-3 text-white/80">
            <Activity className="text-[#20C997]" />
            <span>Real-time logistics & inventory tracking</span>
          </div>
          <div className="flex items-center gap-3 text-white/80">
            <Shield className="text-[#00A8E8]" />
            <span>Enterprise-grade Row Level Security</span>
          </div>
        </div>
      </div>

      {/* Login Form */}
      <div className="auth-form-container">
        <div className="auth-glass-box">
          <h2 className="auth-title">Welcome Back</h2>
          <p className="auth-subtitle">Sign in to Mission Control to continue.</p>
          
          {error && (
            <div className="mb-6 text-sm" style={{ padding: '1rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--color-critical)', borderRadius: '12px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="auth-input-group">
              <input 
                type="email" 
                className="auth-input" 
                placeholder="Email Address"
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Mail className="auth-input-icon" size={20} />
            </div>
            
            <div className="auth-input-group mb-8">
              <input 
                type="password" 
                className="auth-input" 
                placeholder="Password"
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Lock className="auth-input-icon" size={20} />
            </div>
            
            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? 'Authenticating...' : 'Sign In'}
              {!loading && <ArrowRight size={20} />}
            </button>
          </form>
          
          <div className="mt-8 text-center text-sm text-slate-500">
            Don't have an organization account? <br className="mb-2"/>
            <Link to="/register" className="auth-link">Register Organization</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
