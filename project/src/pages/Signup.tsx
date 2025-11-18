import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Brain, Mail, Lock, User, AlertCircle, CheckCircle } from 'lucide-react';

interface SignupProps {
  onToggleMode: () => void;
}

export default function Signup({ onToggleMode }: SignupProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (username.length < 3) {
      setError('Username must be at least 3 characters long');
      return;
    }

    setLoading(true);

    const { error } = await signUp(email, password, username);

    if (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-warm flex items-center justify-center p-4">
      {/* Floating Brain Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <Brain className="absolute top-32 right-20 w-36 h-36 text-accent-200/10 floating-brain" />
        <Brain className="absolute bottom-32 left-20 w-28 h-28 text-primary-200/10 floating-brain-fast" style={{ animationDelay: '1.5s' }} />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="glass rounded-3xl shadow-2xl p-8 space-y-6 backdrop-blur-md border border-white/20">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="relative">
                <div className="bg-gradient-to-br from-accent-500 to-primary-500 p-4 rounded-full shadow-lg animate-pulse-glow">
                  <Brain className="w-12 h-12 text-white" />
                </div>
                <div className="absolute -inset-1 bg-gradient-to-br from-accent-300 to-primary-300 rounded-full blur-lg opacity-50 -z-10"></div>
              </div>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-accent-600 to-primary-600 bg-clip-text text-transparent text-shadow-lg">
              Create Account
            </h1>
            <p className="text-gray-700 text-lg font-medium">Start your journey to better mental wellness</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border-2 border-red-300 rounded-xl p-4 flex items-start gap-3 shadow-lg">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-800 font-medium">{error}</p>
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="username" className="block text-sm font-semibold text-gray-800">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-accent-400" />
                <input
                  id="username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-accent-500 focus:border-accent-400 transition-all outline-none bg-white/80 font-medium"
                  placeholder="Choose a username"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-semibold text-gray-800">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-accent-400" />
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-accent-500 focus:border-accent-400 transition-all outline-none bg-white/80 font-medium"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-semibold text-gray-800">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-accent-400" />
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-accent-500 focus:border-accent-400 transition-all outline-none bg-white/80 font-medium"
                  placeholder="At least 6 characters"
                />
              </div>
            </div>

            <div className="bg-accent-50 border-2 border-accent-200 rounded-xl p-4 flex items-start gap-3 shadow-md">
              <CheckCircle className="w-5 h-5 text-accent-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-accent-800 font-medium">
                Your information is secure and will only be used to provide personalized mental health support.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-accent-500 to-primary-500 hover:from-accent-600 hover:to-primary-600 text-white font-bold py-4 rounded-xl transition-all shadow-xl hover:shadow-2xl transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <div className="text-center pt-4">
            <p className="text-gray-700 font-medium">
              Already have an account?{' '}
              <button
                onClick={onToggleMode}
                className="text-accent-600 hover:text-accent-700 font-bold transition-colors underline decoration-2 underline-offset-2"
              >
                Sign in
              </button>
            </p>
          </div>
        </div>

        <p className="text-center text-sm text-gray-700 mt-6 font-medium text-shadow">
          Join thousands taking control of their mental wellness
        </p>
      </div>
    </div>
  );
}
