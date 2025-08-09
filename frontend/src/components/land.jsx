import React, { useState, useEffect } from 'react';
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

  const navigateToLogin = () => {
    window.location.href = '/login';
  };

  const navigateToSignup = () => {
    window.location.href = '/sign';
  };
  
  const scrollToSection = (sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-100 via-neutral-50 to-stone-100 text-stone-800 overflow-hidden relative">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-green-700/20 to-green-800/20 rounded-full opacity-40 animate-pulse blur-xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-green-600/20 to-green-700/20 rounded-full opacity-40 animate-pulse blur-xl"></div>
        <div className="absolute top-1/3 right-1/4 w-32 h-32 bg-gradient-to-br from-green-500/15 to-green-600/15 rounded-full opacity-30 animate-bounce blur-lg"></div>
        <div className="absolute bottom-1/4 left-1/3 w-24 h-24 bg-gradient-to-br from-green-800/20 to-green-900/20 rounded-full opacity-35 animate-pulse blur-lg"></div>
        
        {/* Floating particles */}
        <div className="absolute top-20 left-20 w-2 h-2 bg-green-600/60 rounded-full animate-ping"></div>
        <div className="absolute top-40 right-32 w-1 h-1 bg-green-700/40 rounded-full animate-pulse"></div>
        <div className="absolute bottom-32 left-16 w-3 h-3 bg-green-500/50 rounded-full animate-bounce"></div>
        <div className="absolute bottom-60 right-20 w-2 h-2 bg-green-800/40 rounded-full animate-ping"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-50 px-6 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-stone-50/90 backdrop-blur-xl shadow-xl rounded-2xl border border-green-200/50 px-8 py-4">
            <div className="flex items-center justify-between">
              {/* Logo */}
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-green-700 to-green-800 rounded-xl flex items-center justify-center shadow-lg shadow-green-700/25">
                  <PenTool className="w-7 h-7 text-stone-100" />
                </div>
                <span className="text-3xl font-bold text-transparent bg-gradient-to-r from-green-700 to-green-800 bg-clip-text">
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
                  <span className="bg-gradient-to-r from-green-700 to-green-600 bg-clip-text text-transparent drop-shadow-lg">
                    CREATE
                  </span>
                  <br />
                  <span className="bg-gradient-to-r from-green-800 to-green-700 bg-clip-text text-transparent drop-shadow-lg">
                    AMAZING
                  </span>
                  <br />
                  <span className="bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent drop-shadow-lg">
                    CONTENT
                  </span>
                </h1>
                <p className="text-xl lg:text-2xl text-stone-600 leading-relaxed font-medium">
                  Unleash your creativity with nature's elegance. Our sophisticated platform 
                  transforms your ideas into refined content that stands out with timeless 
                  sophistication and captivates your audience with natural beauty.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-6">
                <button 
                  onClick={navigateToLogin}
                  className="px-10 py-4 bg-stone-50/90 backdrop-blur-sm text-green-700 text-lg font-semibold rounded-xl border-2 border-green-600/30 hover:bg-stone-100/90 hover:border-green-700/50 transition-all duration-300 shadow-sm hover:shadow-lg hover:shadow-green-600/20"
                >
                  Login
                </button>
                <button 
                  onClick={navigateToSignup}
                  className="px-10 py-4 bg-gradient-to-r from-green-700 via-green-800 to-green-700 text-stone-100 text-lg font-semibold rounded-xl hover:from-green-800 hover:via-green-900 hover:to-green-800 transition-all duration-300 shadow-lg shadow-green-700/25 hover:shadow-xl hover:shadow-green-700/40 transform hover:scale-105"
                >
                  <Sparkles className="w-5 h-5 inline mr-2" />
                  Sign Up
                </button>
              </div>

            </div>

            {/* Right - Features Grid */}
            <div className="relative" style={{ transform: `translateY(${scrollY * -0.05}px)` }}>
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-stone-50/70 backdrop-blur-xl rounded-2xl p-6 border border-green-200/50 hover:border-green-600/50 transition-all duration-300 shadow-lg hover:shadow-green-600/20">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-green-700 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-green-600/30">
                    <Sparkles className="w-6 h-6 text-stone-100" />
                  </div>
                  <h3 className="text-lg font-bold text-green-800 mb-2">AI Content Creation</h3>
                  <p className="text-stone-600 text-sm">Generate sophisticated content with AI-powered elegance.</p>
                </div>

                <div className="bg-stone-50/70 backdrop-blur-xl rounded-2xl p-6 border border-green-200/50 hover:border-green-700/50 transition-all duration-300 shadow-lg hover:shadow-green-700/20">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-700 to-green-800 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-green-700/30">
                    <TrendingUp className="w-6 h-6 text-stone-100" />
                  </div>
                  <h3 className="text-lg font-bold text-green-800 mb-2">Tone Analyzer</h3>
                  <p className="text-stone-600 text-sm">Refine your content's tone for sophisticated engagement.</p>
                </div>

                <div className="bg-stone-50/70 backdrop-blur-xl rounded-2xl p-6 border border-green-200/50 hover:border-green-500/50 transition-all duration-300 shadow-lg hover:shadow-green-500/20">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-green-500/30">
                    <Clock className="w-6 h-6 text-stone-100" />
                  </div>
                  <h3 className="text-lg font-bold text-green-800 mb-2">Smart Scheduler</h3>
                  <p className="text-stone-600 text-sm">Schedule content with natural timing across platforms.</p>
                </div>

                <div className="bg-stone-50/70 backdrop-blur-xl rounded-2xl p-6 border border-green-200/50 hover:border-green-800/50 transition-all duration-300 shadow-lg hover:shadow-green-800/20">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-800 to-green-900 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-green-800/30">
                    <Users className="w-6 h-6 text-stone-100" />
                  </div>
                  <h3 className="text-lg font-bold text-green-800 mb-2">Collaboration</h3>
                  <p className="text-stone-600 text-sm">Work harmoniously with your team in natural flow.</p>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-8 -right-8 w-20 h-20 bg-gradient-to-r from-green-600 to-green-700 rounded-3xl flex items-center justify-center shadow-xl shadow-green-600/40 animate-bounce">
                <TrendingUp className="w-10 h-10 text-stone-100" />
              </div>
              <div className="absolute -bottom-8 -left-8 w-20 h-20 bg-gradient-to-r from-green-700 to-green-800 rounded-3xl flex items-center justify-center shadow-xl shadow-green-700/40 animate-pulse">
                <Zap className="w-10 h-10 text-stone-100" />
              </div>
              <div className="absolute top-1/2 -right-10 w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-xl shadow-green-500/40 animate-spin">
                <Star className="w-8 h-8 text-stone-100" />
              </div>
              <div className="absolute top-1/4 -left-6 w-12 h-12 bg-gradient-to-r from-green-800 to-green-900 rounded-xl flex items-center justify-center shadow-lg shadow-green-800/30 animate-pulse">
                <Users className="w-6 h-6 text-stone-100" />
              </div>
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="flex justify-center mt-16 animate-bounce">
            <ChevronDown className="w-8 h-8 text-stone-400 hover:text-green-700 transition-colors duration-300" />
          </div>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;