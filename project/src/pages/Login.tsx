import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Brain, Mail, Lock, AlertCircle, ArrowLeft } from 'lucide-react';

interface LoginProps {
  onToggleMode: () => void;
  onBack: () => void;
}

export default function Login({ onToggleMode, onBack }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error } = await signIn(email, password);

    if (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-calm flex items-center justify-center p-4">
      {/* Floating Brain Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <Brain className="absolute top-20 left-20 w-40 h-40 text-primary-200/10 floating-brain" />
        <Brain className="absolute bottom-20 right-20 w-32 h-32 text-secondary-200/10 floating-brain-fast" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-800 hover:text-purple-600 mb-6 font-bold transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>
        <div className="glass rounded-3xl shadow-2xl p-8 space-y-6 backdrop-blur-md border border-white/30">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="relative">
                <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-4 rounded-full shadow-lg">
                  <Brain className="w-12 h-12 text-white" />
                </div>
                <div className="absolute -inset-1 bg-gradient-to-br from-purple-300 to-pink-300 rounded-full blur-lg opacity-50 -z-10"></div>
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-900">
              Welcome Back
            </h1>
            <p className="text-gray-700 text-lg font-medium">Sign in to continue your mental wellness journey</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border-2 border-red-300 rounded-xl p-4 flex items-start gap-3 shadow-lg">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-800 font-medium">{error}</p>
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-bold text-gray-800">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-500" />
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-400 transition-all outline-none bg-white font-medium text-gray-900 placeholder-gray-400"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-bold text-gray-800">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-500" />
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-400 transition-all outline-none bg-white font-medium text-gray-900 placeholder-gray-400"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-4 rounded-xl transition-all shadow-xl hover:shadow-2xl transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="text-center pt-4">
            <p className="text-gray-800 font-medium">
              Don't have an account?{' '}
              <button
                onClick={onToggleMode}
                className="text-purple-600 hover:text-purple-700 font-bold transition-colors underline decoration-2 underline-offset-2"
              >
                Sign up
              </button>
            </p>
          </div>
        </div>

        <p className="text-center text-sm text-gray-800 mt-6 font-semibold">
          Your mental health matters. We're here to support you.
        </p>
      </div>
    </div>
  );
}
