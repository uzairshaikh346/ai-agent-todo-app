import React, { useState, useEffect } from 'react';
import { CheckCircle, Zap, Shield, Clock } from 'lucide-react';

const LandingPage = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      icon: <CheckCircle className="w-8 h-8" />,
      title: "Simple & Intuitive",
      description: "Clean interface designed for maximum productivity"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Lightning Fast",
      description: "Optimized performance for seamless task management"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Secure & Private",
      description: "Your data is encrypted and protected at all times"
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Real-time Sync",
      description: "Access your tasks anywhere, anytime, on any device"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-96 h-96 bg-blue-500/20 rounded-full blur-3xl -top-48 -left-48 animate-pulse"></div>
        <div className="absolute w-96 h-96 bg-purple-500/20 rounded-full blur-3xl top-1/2 -right-48 animate-pulse delay-700"></div>
        <div className="absolute w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl bottom-0 left-1/3 animate-pulse delay-1000"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-50 px-6 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            TaskFlow
          </div>
          <div className="flex gap-4">
            <a 
              href="/auth/login"
              className="px-6 py-2 rounded-lg font-medium transition-all duration-300 hover:bg-white/10"
            >
              Sign In
            </a>
            <a 
              href="/auth/signup"
              className="px-6 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg font-medium transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/50 hover:scale-105"
            >
              Get Started
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-32">
        <div className="text-center space-y-8 animate-fade-in">
          <div className="inline-block">
            <span className="px-4 py-2 bg-blue-500/20 backdrop-blur-sm rounded-full text-sm font-medium border border-blue-400/30 animate-slide-down">
              🚀 Your productivity companion
            </span>
          </div>
          
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold leading-tight animate-slide-up">
            Manage Tasks
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent animate-gradient">
              With Elegance
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto animate-fade-in-delay">
            Experience the perfect blend of simplicity and power. Organize your life, boost your productivity, and achieve your goals with our intuitive task management platform.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8 animate-slide-up-delay">
            <a 
              href="/auth/signup"
              className="group px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl font-semibold text-lg transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/50 hover:scale-105 flex items-center gap-2"
              >
              Start Free Today
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </a>
            <a 
              href="#features"
              className="px-8 py-4 bg-white/10 backdrop-blur-sm rounded-xl font-semibold text-lg border border-white/20 transition-all duration-300 hover:bg-white/20 hover:scale-105"
              >
              Explore Features
            </a>
          </div>
        </div>

        {/* Floating task cards animation */}
        <div className="relative mt-20 animate-float">
          <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-8 shadow-2xl">
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div 
                  key={i}
                  className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/10 hover:bg-white/20 transition-all duration-300 hover:scale-102 cursor-pointer"
                  style={{ animationDelay: `${i * 0.2}s` }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded border-2 border-cyan-400"></div>
                    <div className="flex-1 h-4 bg-white/20 rounded animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Why Choose TaskFlow?
          </h2>
          <p className="text-xl text-gray-300">
            Built for modern professionals who value efficiency
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
            key={index}
              className="group bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 hover:border-cyan-400/50 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-cyan-500/20"
              style={{ animationDelay: `${index * 0.1}s` }}
              >
              <div className="text-cyan-400 mb-4 group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 py-20 text-center">
        <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-lg rounded-3xl p-12 border border-white/20">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Transform Your Workflow?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of professionals who trust TaskFlow every day
          </p>
          <a 
            href="/auth/signup"
            className="inline-block px-10 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl font-semibold text-lg transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/50 hover:scale-105"
            >
            Get Started For Free
          </a>
        </div>
      </div>

      <style jsx>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          }
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
            }
            @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
          }
          @keyframes slide-up {
            from { 
            opacity: 0;
            transform: translateY(30px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slide-down {
          from { 
            opacity: 0;
            transform: translateY(-20px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 4s ease infinite;
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
        .animate-slide-up {
          animation: slide-up 0.8s ease-out;
        }
        .animate-slide-down {
          animation: slide-down 0.6s ease-out;
        }
        .animate-fade-in-delay {
          animation: fade-in 0.8s ease-out 0.3s backwards;
        }
        .animate-slide-up-delay {
          animation: slide-up 0.8s ease-out 0.5s backwards;
        }
        .delay-700 {
          animation-delay: 700ms;
        }
        .delay-1000 {
          animation-delay: 1000ms;
        }
        .hover\:scale-102:hover {
          transform: scale(1.02);
        }
      `}</style>
    </div>
  );
};

export default LandingPage;