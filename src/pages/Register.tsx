import { useState } from 'react';
import { useAuth } from '../lib/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Activity, Compass, Shield, User, Building } from 'lucide-react';

export function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [orgName, setOrgName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await register(email, password, fullName, orgName);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Unable to register. Please try again.');
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
          Join the Integrated Polar Expedition Logistics and Asset Management System network.
        </p>

        <div className="flex flex-col gap-4 mt-8">
          <div className="flex items-center gap-3 text-white/80">
            <Building className="text-[#20C997]" />
            <span>Create your Organization Profile</span>
          </div>
          <div className="flex items-center gap-3 text-white/80">
            <User className="text-[#00A8E8]" />
            <span>Become the default Administrator</span>
          </div>
        </div>
      </div>

      {/* Registration Form */}
      <div className="auth-form-container">
        <div className="auth-glass-box">
          <h2 className="auth-title">Create Organization</h2>
          <p className="auth-subtitle">Get started with your POLAR-IMS workspace.</p>
          
          {error && (
            <div className="mb-6 text-sm" style={{ padding: '1rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--color-critical)', borderRadius: '12px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="auth-input-group">
              <input 
                type="text" 
                className="auth-input" 
                placeholder="Full Name"
                required 
                value={fullName} 
                onChange={(e) => setFullName(e.target.value)}
              />
              <User className="auth-input-icon" size={20} />
            </div>

            <div className="auth-input-group">
              <input 
                type="text" 
                className="auth-input" 
                placeholder="Organization Name"
                required 
                value={orgName} 
                onChange={(e) => setOrgName(e.target.value)}
              />
              <Building className="auth-input-icon" size={20} />
            </div>

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
              {loading ? 'Creating workspace...' : 'Register'}
              {!loading && <ArrowRight size={20} />}
            </button>
          </form>
          
          <div className="mt-8 text-center text-sm text-slate-500">
            Already have an account? <br className="mb-2"/>
            <Link to="/login" className="auth-link">Sign In to Mission Control</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
