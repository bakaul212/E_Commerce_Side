import { useState } from 'react';
import { Mail, Lock, User, Eye, EyeOff, LogIn, UserPlus, AlertCircle, CheckCircle2 } from 'lucide-react';

interface AuthPagesProps {
  onAuthSuccess: (user: { name: string; email: string }) => void;
}

export function AuthPages({ onAuthSuccess }: AuthPagesProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  
  // Form States
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Validation, Loading & Message States
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // 1. Validation Logic
  const validateForm = () => {
    setError('');
    if (!isLogin && name.trim().length < 3) {
      setError('Name must be at least 3 characters long.');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return false;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return false;
    }
    return true;
  };

  // 2. Submit Handler (Real MongoDB Backend Integration)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setError('');
    setSuccess('');

    // আপনার ব্যাকএন্ডের রিয়েল ইউআরএল (প্রয়োজন হলে পোর্ট ৩০০০ বা ৫০০০ এ চেঞ্জ করুন)
    const backendUrl = `${import.meta.env.VITE_API_BASE_URL}/auth`;
    const endpoint = isLogin ? `${backendUrl}/login` : `${backendUrl}/register`;
    const payload = isLogin ? { email, password } : { name, email, password };

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong!');
      }

      // সাকসেস হলে টোকেন লোকাল স্টোরেজে সেভ হবে
      if (data.token) {
        localStorage.setItem('token', data.token);
      }

      setSuccess(isLogin ? 'Logging in successfully...' : 'Registration successful! Redirecting...');
      
      setTimeout(() => {
        onAuthSuccess({
          name: data.user?.name || name,
          email: data.user?.email || email,
        });
      }, 1200);

    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to connect to the server.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // 3. Demo Login Button Helper (Auto-fill)
  const handleDemoLogin = () => {
    setIsLogin(true);
    setEmail('demo@example.com');
    setPassword('password123');
    setError('');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12">
      <div className="bg-white max-w-md w-full rounded-3xl border border-slate-200 p-8 shadow-xs space-y-6">
        
        {/* Header Section */}
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm">
            {isLogin ? 'Enter your details to access your account' : 'Join us today to get started'}
          </p>
        </div>

        {/* Error & Success Alert Boxes */}
        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3 rounded-xl flex items-center gap-2 text-xs font-semibold">
            <AlertCircle className="w-4 h-4 shrink-0" /> <span>{error}</span>
          </div>
        )}
        {success && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 p-3 rounded-xl flex items-center gap-2 text-xs font-semibold">
            <CheckCircle2 className="w-4 h-4 shrink-0" /> <span>{success}</span>
          </div>
        )}

        {/* Main Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Name Field (Only for Signup) */}
          {!isLogin && (
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Full Name</label>
              <div className="relative flex items-center">
                <User className="absolute left-3.5 w-4 h-4 text-slate-400" />
                <input 
                  type="text" value={name} onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:border-indigo-500 transition-colors"
                  required
                />
              </div>
            </div>
          )}

          {/* Email Field */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email Address</label>
            <div className="relative flex items-center">
              <Mail className="absolute left-3.5 w-4 h-4 text-slate-400" />
              <input 
                type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:border-indigo-500 transition-colors"
                required
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Password</label>
            <div className="relative flex items-center">
              <Lock className="absolute left-3.5 w-4 h-4 text-slate-400" />
              <input 
                type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-10 py-2.5 text-sm text-slate-700 focus:outline-none focus:border-indigo-500 transition-colors"
                required
              />
              <button 
                type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 text-slate-400 hover:text-slate-600 focus:outline-none"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full mt-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-xl text-sm transition-all flex items-center justify-center gap-2 shadow-xs disabled:bg-indigo-400 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span>Processing...</span>
            ) : isLogin ? (
              <>Sign In <LogIn className="w-4 h-4" /></>
            ) : (
              <>Create Account <UserPlus className="w-4 h-4" /></>
            )}
          </button>
        </form>

        {/* Demo Credentials Auto-Fill Button */}
        {isLogin && (
          <button 
            type="button" onClick={handleDemoLogin}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-2 rounded-xl text-xs transition-colors tracking-wide"
          >
            ⚡ Quick Demo Login (Auto-fill)
          </button>
        )}

        {/* Divider */}
        <div className="relative flex py-2 items-center">
          <div className="flex-grow border-t border-slate-200"></div>
          <span className="flex-shrink mx-4 text-slate-400 text-xs font-medium">Or continue with</span>
          <div className="flex-grow border-t border-slate-200"></div>
        </div>

        {/* Social Logins */}
        <div className="grid grid-cols-2 gap-4">
          <button 
            type="button" onClick={() => alert('Google authentication coming soon via backend!')}
            className="flex items-center justify-center gap-2 border border-slate-200 rounded-xl py-2 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 transition-colors"
          >
            <span className="text-rose-500 text-sm font-black">G</span> Google
          </button>
          <button 
            type="button" onClick={() => alert('Facebook authentication coming soon via backend!')}
            className="flex items-center justify-center gap-2 border border-slate-200 rounded-xl py-2 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 transition-colors"
          >
            <span className="text-blue-600 text-sm font-black">F</span> Facebook
          </button>
        </div>

        {/* Toggle between Login and Register */}
        <div className="text-center pt-2">
          <p className="text-xs font-medium text-slate-500">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button 
              type="button" onClick={() => { setIsLogin(!isLogin); setError(''); setSuccess(''); }}
              className="text-indigo-600 hover:text-indigo-800 font-bold ml-1 focus:outline-none"
            >
              {isLogin ? 'Sign Up' : 'Log In'}
            </button>
          </p>
        </div>

      </div>
    </div>
  );
}