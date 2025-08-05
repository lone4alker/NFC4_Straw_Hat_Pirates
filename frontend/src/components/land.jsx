import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // ✅ add this import
import {
  Camera, Video, Edit3, Users, Zap, Star, Play,
  TrendingUp, Heart, MessageCircle, Share2, PenTool,
  FileImage, Music, ChevronDown, Sparkles, Rocket,
  Globe, Shield, Clock
} from 'lucide-react';


const LandingPage = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

 


  const navigate = useNavigate(); // ← Add this line

  const navigateToLogin = () => {
    navigate('/login'); // ← Programmatic navigation
  };

  const navigateToSignup = () => {
    navigate('/sign'); // ← Programmatic navigation
  };


  const scrollToSection = (sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden relative">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full opacity-20 animate-pulse blur-xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-purple-400 to-pink-600 rounded-full opacity-20 animate-pulse blur-xl"></div>
        <div className="absolute top-1/3 right-1/4 w-32 h-32 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full opacity-15 animate-bounce blur-lg"></div>
        <div className="absolute bottom-1/4 left-1/3 w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full opacity-20 animate-pulse blur-lg"></div>
        
        {/* Floating particles */}
        <div className="absolute top-20 left-20 w-2 h-2 bg-cyan-400 rounded-full animate-ping opacity-60"></div>
        <div className="absolute top-40 right-32 w-1 h-1 bg-purple-400 rounded-full animate-pulse opacity-40"></div>
        <div className="absolute bottom-32 left-16 w-3 h-3 bg-emerald-400 rounded-full animate-bounce opacity-50"></div>
        <div className="absolute bottom-60 right-20 w-2 h-2 bg-pink-400 rounded-full animate-ping opacity-30"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-50 px-6 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-slate-800/60 backdrop-blur-xl shadow-2xl rounded-2xl border border-slate-700/50 px-8 py-4">
            <div className="flex items-center justify-between">
              {/* Logo */}
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/25">
                  <PenTool className="w-7 h-7 text-white" />
                </div>
                <span className="text-3xl font-bold text-transparent bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text">
                  CloutCraft
                </span>
              </div>

              {/* Navigation Links */}
             
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 px-6 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left - Text */}
            <div className="space-y-10" style={{ transform: `translateY(${scrollY * 0.1}px)` }}>
              <div className="space-y-8">
                <h1 className="text-6xl lg:text-8xl font-bold leading-tight">
                  <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent drop-shadow-lg">
                    CREATE
                  </span>
                  <br />
                  <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent drop-shadow-lg">
                    AMAZING
                  </span>
                  <br />
                  <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent drop-shadow-lg">
                    CONTENT
                  </span>
                </h1>
                <p className="text-xl lg:text-2xl text-gray-300 leading-relaxed font-medium">
                  Unleash your creativity in the digital nightfall. Our cutting-edge platform 
                  transforms your wildest ideas into stunning content that glows in the dark 
                  and captivates your audience like never before.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-6">
                <button 
                  onClick={navigateToLogin}
                  className="px-10 py-4 bg-slate-800/60 backdrop-blur-sm text-cyan-400 text-lg font-semibold rounded-xl border-2 border-cyan-500/30 hover:bg-slate-700/60 hover:border-cyan-400/50 transition-all duration-300 shadow-sm hover:shadow-lg hover:shadow-cyan-500/20"
                >
                  Login
                </button>
                <button 
                  onClick={navigateToSignup}
                  className="px-10 py-4 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 text-white text-lg font-semibold rounded-xl hover:from-cyan-600 hover:via-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/40 transform hover:scale-105"
                >
                  <Sparkles className="w-5 h-5 inline mr-2" />
                  Sign Up
                </button>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap gap-12 pt-8">
                <div className="text-center">
                  <div className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">500K+</div>
                  <div className="text-gray-400 font-medium">Night Creators</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">10M+</div>
                  <div className="text-gray-400 font-medium">Glowing Content</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">99%</div>
                  <div className="text-gray-400 font-medium">Satisfaction</div>
                </div>
              </div>
            </div>

            {/* Right - Features Grid */}
            <div className="relative" style={{ transform: `translateY(${scrollY * -0.05}px)` }}>
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-slate-800/40 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 hover:border-cyan-500/50 transition-all duration-300 shadow-lg hover:shadow-cyan-500/20">
                  <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-cyan-500/30">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-cyan-300 mb-2">AI Content Creation</h3>
                  <p className="text-gray-400 text-sm">Generate stunning content with AI-powered tools.</p>
                </div>

                <div className="bg-slate-800/40 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 hover:border-purple-500/50 transition-all duration-300 shadow-lg hover:shadow-purple-500/20">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-purple-500/30">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-purple-300 mb-2">Tone Analyzer</h3>
                  <p className="text-gray-400 text-sm">Optimize your content's tone for maximum engagement.</p>
                </div>

                <div className="bg-slate-800/40 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 hover:border-emerald-500/50 transition-all duration-300 shadow-lg hover:shadow-emerald-500/20">
                  <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-emerald-500/30">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-emerald-300 mb-2">Smart Scheduler</h3>
                  <p className="text-gray-400 text-sm">Schedule content at optimal times across platforms.</p>
                </div>

                <div className="bg-slate-800/40 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 hover:border-yellow-500/50 transition-all duration-300 shadow-lg hover:shadow-yellow-500/20">
                  <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-yellow-500/30">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-yellow-300 mb-2">Collaboration</h3>
                  <p className="text-gray-400 text-sm">Work seamlessly with your team in real-time.</p>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-8 -right-8 w-20 h-20 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-3xl flex items-center justify-center shadow-xl shadow-cyan-500/40 animate-bounce">
                <TrendingUp className="w-10 h-10 text-white" />
              </div>
              <div className="absolute -bottom-8 -left-8 w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-600 rounded-3xl flex items-center justify-center shadow-xl shadow-purple-500/40 animate-pulse">
                <Zap className="w-10 h-10 text-white" />
              </div>
              <div className="absolute top-1/2 -right-10 w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-xl shadow-emerald-500/40 animate-spin">
                <Star className="w-8 h-8 text-white" />
              </div>
              <div className="absolute top-1/4 -left-6 w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-yellow-500/30 animate-pulse">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="flex justify-center mt-16 animate-bounce">
            <ChevronDown className="w-8 h-8 text-gray-400 hover:text-cyan-400 transition-colors duration-300" />
          </div>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;