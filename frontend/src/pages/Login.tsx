import { useState } from 'react';
import { Activity, Mail, Lock, Eye, EyeOff, ArrowLeft, ChevronRight, Github, Globe } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { API_BASE_URL } from '../config';
import './Login.css';

interface LoginProps {
  setIsAuthenticated: (val: boolean) => void;
}

export default function Login({ setIsAuthenticated }: LoginProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await axios.post(`${API_BASE_URL}/api/auth/${isLogin ? 'login' : 'register'}`, {
        email, 
        password, 
        role: 'admin' // In a real app, role would be selected or assigned
      });
      
      if (!isLogin && res.status === 201) {
        setIsLogin(true);
        toast.success('Account created! Welcome to FiscalTech.');
        setIsLoading(false);
        return;
      }
      
      const token = res.data.token;
      if (token) {
        localStorage.setItem('token', token);
        localStorage.setItem('apiKey', res.data.user.apiKey || '');
        setIsAuthenticated(true);
        toast.success('Successfully logged in');
        navigate('/dashboard');
      }
    } catch (err: any) {
      const msg = err.response?.data?.error || 'Authentication failed. Please check your credentials.';
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      {/* Visual Side (Left) */}
      <div className="auth-side-visual">
        <div className="visual-content">
          <div className="auth-logo-large">
            <Activity size={40} className="text-indigo-500" />
            <span>FISCALTECH</span>
          </div>
          <div className="visual-text">
            <h2>The Standard in Malawian Fiscal Oversight.</h2>
            <p>Join thousands of enterprises securing their revenue with AI-powered sentinel technology.</p>
          </div>
          <div className="visual-stats">
            <div className="v-stat">
              <span className="v-val">99.9%</span>
              <span className="v-label">Uptime</span>
            </div>
            <div className="v-stat">
              <span className="v-val">256-bit</span>
              <span className="v-label">Security</span>
            </div>
          </div>
        </div>
        <div className="visual-overlay"></div>
      </div>

      {/* Form Side (Right) */}
      <div className="auth-side-form">
        <div className="form-container animate-slide-up">
          <Link to="/" className="back-home-link">
            <ArrowLeft size={16} />
            Back to home
          </Link>

          <div className="form-header">
            <h1>{isLogin ? 'Welcome Back' : 'Create Account'}</h1>
            <p className="text-slate-500">
              {isLogin ? "Enter your credentials to access your sentinel dashboard." : "Start your 14-day free trial with FiscalTech today."}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="premium-form">
            <div className="premium-input-group">
              <label>Email Address</label>
              <div className="input-with-icon">
                <Mail size={18} className="input-icon" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.mw"
                  required 
                />
              </div>
            </div>
            
            <div className="premium-input-group">
              <div className="label-row">
                <label>Password</label>
                {isLogin && <a href="#" className="forgot-link">Forgot?</a>}
              </div>
              <div className="input-with-icon">
                <Lock size={18} className="input-icon" />
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required 
                />
                <button 
                  type="button" 
                  className="eye-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {isLogin && (
              <div className="form-options">
                <label className="checkbox-label">
                  <input type="checkbox" />
                  <span>Remember this device</span>
                </label>
              </div>
            )}

            <button type="submit" className="premium-auth-btn" disabled={isLoading}>
              {isLoading ? 'Processing...' : (isLogin ? 'Sign In to Sentinel' : 'Create My Account')}
              {!isLoading && <ChevronRight size={20} />}
            </button>
          </form>

          <div className="social-auth">
            <div className="divider">
              <span>Or continue with</span>
            </div>
            <div className="social-buttons">
              <button className="social-btn">
                <Github size={20} />
                GitHub
              </button>
              <button className="social-btn">
                <Globe size={20} />
                Google
              </button>
            </div>
          </div>

          <div className="auth-switcher">
            <p>
              {isLogin ? "New to FiscalTech?" : "Already have an account?"}
              <button 
                className="switcher-btn" 
                onClick={() => setIsLogin(!isLogin)}
              >
                {isLogin ? "Register now" : "Sign in here"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

