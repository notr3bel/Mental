import { Brain, Users, Shield, Sparkles } from 'lucide-react';

interface HomeProps {
  onNavigateToLogin: () => void;
}

export default function Home({ onNavigateToLogin }: HomeProps) {
  const scrollToAbout = () => {
    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Animated Gradient Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-200/30 via-pink-200/30 to-blue-200/30 animate-gradient"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,rgba(147,51,234,0.15),transparent_50%)]"></div>
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_80%,rgba(236,72,153,0.15),transparent_50%)]"></div>
      </div>
      
      {/* Floating Brain Background Animations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <Brain className="absolute top-20 left-10 w-40 h-40 text-purple-300/20 floating-brain" />
        <Brain className="absolute top-40 right-20 w-32 h-32 text-pink-300/20 floating-brain-fast" style={{ animationDelay: '1s' }} />
        <Brain className="absolute bottom-32 left-1/4 w-36 h-36 text-blue-300/20 floating-brain" style={{ animationDelay: '2s' }} />
        <Brain className="absolute bottom-20 right-1/3 w-28 h-28 text-purple-400/15 floating-brain-fast" style={{ animationDelay: '3s' }} />
        <Brain className="absolute top-1/2 left-1/2 w-24 h-24 text-pink-400/15 floating-brain" style={{ animationDelay: '4s' }} />
        <Brain className="absolute top-1/3 right-1/3 w-20 h-20 text-blue-400/15 floating-brain-fast" style={{ animationDelay: '5s' }} />
      </div>
      
      {/* Floating Particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-gradient-to-r from-purple-400/20 to-pink-400/20"
            style={{
              width: `${Math.random() * 8 + 4}px`,
              height: `${Math.random() * 8 + 4}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${Math.random() * 10 + 10}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      <header className="bg-white/90 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 p-2.5 rounded-xl shadow-lg">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
                Mindful Log
              </h1>
            </div>
            <nav className="flex items-center gap-6">
              <button
                onClick={scrollToAbout}
                className="text-gray-700 hover:text-purple-600 font-bold text-lg transition-colors relative group"
              >
                About
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 group-hover:w-full transition-all duration-300"></span>
              </button>
              <button
                onClick={onNavigateToLogin}
                className="px-8 py-3 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 hover:from-purple-600 hover:via-pink-600 hover:to-blue-600 text-white rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-2xl transform hover:scale-105"
              >
                Login
              </button>
            </nav>
          </div>
        </div>
      </header>

      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center space-y-8 max-w-5xl mx-auto">
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 p-10 rounded-full shadow-2xl animate-pulse-glow">
                <Brain className="w-24 h-24 text-white" />
              </div>
              <div className="absolute -inset-4 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full blur-2xl opacity-40 animate-pulse"></div>
              <div className="absolute -inset-8 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full blur-3xl opacity-20"></div>
            </div>
          </div>
          <h2 className="text-6xl md:text-7xl font-extrabold text-gray-900 leading-tight">
            Your Mental Wellness Journey Starts Here
          </h2>
          <p className="text-2xl text-gray-700 leading-relaxed font-medium max-w-3xl mx-auto">
            Mindful Log is your AI-powered companion for mental health assessment and personalized wellness guidance. Take control of your mental well-being with evidence-based assessments and supportive recommendations.
          </p>
          <div className="flex justify-center gap-6 pt-8">
            <button
              onClick={onNavigateToLogin}
              className="px-10 py-5 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 hover:from-purple-600 hover:via-pink-600 hover:to-blue-600 text-white rounded-2xl font-bold text-xl transition-all shadow-2xl hover:shadow-purple-500/50 transform hover:scale-110"
            >
              Get Started
            </button>
            <button
              onClick={scrollToAbout}
              className="px-10 py-5 bg-white/90 backdrop-blur-sm text-gray-800 border-3 border-purple-300 rounded-2xl font-bold text-xl transition-all hover:border-purple-500 hover:bg-white hover:shadow-xl transform hover:scale-110"
            >
              Learn More
            </button>
          </div>
        </div>
      </section>

      <section className="relative z-10 bg-white/70 backdrop-blur-lg py-20 border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
              Why Choose Mindful Log?
            </h2>
            <p className="text-xl text-gray-700 font-medium">Everything you need for your mental wellness journey</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-5 p-8 rounded-3xl bg-gradient-to-br from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 transition-all shadow-xl hover:shadow-2xl transform hover:scale-105 border border-purple-200/50">
              <div className="flex justify-center">
                <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-5 rounded-full shadow-lg transform hover:rotate-6 transition-transform">
                  <Shield className="w-12 h-12 text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Confidential & Secure</h3>
              <p className="text-gray-700 leading-relaxed text-lg">
                Your mental health data is private and protected. We use industry-leading security measures to keep your information safe.
              </p>
            </div>
            <div className="text-center space-y-5 p-8 rounded-3xl bg-gradient-to-br from-pink-50 to-blue-50 hover:from-pink-100 hover:to-blue-100 transition-all shadow-xl hover:shadow-2xl transform hover:scale-105 border border-pink-200/50">
              <div className="flex justify-center">
                <div className="bg-gradient-to-br from-pink-500 to-blue-500 p-5 rounded-full shadow-lg transform hover:rotate-6 transition-transform">
                  <Brain className="w-12 h-12 text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Evidence-Based</h3>
              <p className="text-gray-700 leading-relaxed text-lg">
                Our assessments are based on standardized clinical tools used by mental health professionals worldwide.
              </p>
            </div>
            <div className="text-center space-y-5 p-8 rounded-3xl bg-gradient-to-br from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 transition-all shadow-xl hover:shadow-2xl transform hover:scale-105 border border-blue-200/50">
              <div className="flex justify-center">
                <div className="bg-gradient-to-br from-blue-500 to-purple-500 p-5 rounded-full shadow-lg transform hover:rotate-6 transition-transform">
                  <Sparkles className="w-12 h-12 text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">AI-Powered Insights</h3>
              <p className="text-gray-700 leading-relaxed text-lg">
                Get personalized recommendations tailored to your unique mental health profile and needs.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="about" className="relative z-10 py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-12">
            <div className="flex justify-center">
              <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-4 rounded-full shadow-lg">
                <Users className="w-12 h-12 text-white" />
              </div>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900">About Us</h2>
            <p className="text-xl text-gray-700 max-w-2xl mx-auto leading-relaxed">
              Meet the team dedicated to making mental health support accessible and personalized for everyone.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center space-y-4">
              <div className="flex justify-center">
                <div className="w-32 h-32 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                  <img src="data:image/png;base64,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"
                    alt="Akshita"
                    className="w-32 h-32 rounded-full object-cover"
                  />
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">S Akshita Sai</h3>
                <p className="text-blue-600 font-medium">Co-Founder</p>
                <p className="text-gray-600 mt-2">
                  Passionate about leveraging technology to improve mental health accessibility and support for students.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8 text-center space-y-4">
              <div className="flex justify-center">
                <div className="w-32 h-32 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
                  <img
                    src="data:image/png;base64,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"
                    alt="Thejashwini"
                    className="w-32 h-32 rounded-full object-cover"
                  />
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Thejashwini R</h3>
                <p className="text-green-600 font-medium">Co-Founder</p>
                <p className="text-gray-600 mt-2">
                  Dedicated to creating supportive digital tools that empower individuals to take charge of their mental wellness.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="relative z-10 bg-gray-900 text-white py-10 shadow-2xl border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-2 rounded-lg">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <p className="text-xl font-bold">Mindful Log</p>
          </div>
          <p className="text-gray-300 text-lg font-medium">
            Your mental health matters. We're here to support you.
          </p>
        </div>
      </footer>
    </div>
  );
}
