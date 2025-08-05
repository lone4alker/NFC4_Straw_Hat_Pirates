import React, { useState } from 'react';
import { Camera, Video, Edit3, Users, Zap, Star, Play, TrendingUp, Heart, MessageCircle, Share2, PenTool, FileImage, Music } from 'lucide-react';

const LandingPage = () => {
  const navigateToLogin = () => {
    console.log('Navigate to login.jsx');
    // window.location.href = '/login';
  };

  const navigateToSignup = () => {
    console.log('Navigate to signup.jsx');
    // window.location.href = '/signup';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-100 to-purple-100 text-gray-900 overflow-hidden">
      {/* Navigation */}
      <nav className="relative z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
              <PenTool className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-transparent bg-gradient-to-r from-blue-700 to-purple-700 bg-clip-text">
              CreatorHub
            </span>
          </div>

          {/* Buttons */}
          <div className="flex items-center space-x-4">
            <button 
              onClick={navigateToLogin}
              className="px-6 py-2 text-blue-700 border border-blue-500 rounded-full hover:bg-blue-100 transition"
            >
              Login
            </button>
            <button 
              onClick={navigateToSignup}
              className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg"
            >
              Sign Up
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 px-6 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left - Text */}
            <div className="space-y-8">
              <div className="space-y-6">
                <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    CREATE
                  </span>
                  <br />
                  <span className="bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
                    AMAZING
                  </span>
                  <br />
                  <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    CONTENT
                  </span>
                </h1>
                <p className="text-xl lg:text-2xl text-blue-800 leading-relaxed">
                  Unleash your creativity with our all-in-one content creation platform. 
                  From stunning visuals to engaging videos, we've got everything you need 
                  to bring your ideas to life.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={navigateToSignup}
                  className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-lg font-semibold rounded-full hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg"
                >
                  Start Creating Free
                </button>
                <button className="px-8 py-4 bg-white text-blue-700 text-lg font-semibold rounded-full border border-blue-300 hover:bg-blue-100 transition">
                  <Play className="w-5 h-5 inline mr-2" />
                  Watch Demo
                </button>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap gap-8 pt-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">500K+</div>
                  <div className="text-blue-900">Creators</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">10M+</div>
                  <div className="text-blue-900">Content Pieces</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-indigo-600">99%</div>
                  <div className="text-blue-900">Satisfaction</div>
                </div>
              </div>
            </div>

            {/* Right - Visual UI Mockup */}
            <div className="relative">
              <div className="relative z-10 bg-white/30 backdrop-blur-xl rounded-3xl p-8 border border-white/30 shadow-2xl">
                <div className="space-y-6">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-blue-900">Content Studio</h3>
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    </div>
                  </div>

                  {/* Toolbar */}
                  <div className="flex space-x-4 p-4 bg-white/10 rounded-xl">
                    <div className="p-3 bg-blue-500/20 rounded-lg hover:bg-blue-500/30 transition-colors cursor-pointer">
                      <FileImage className="w-5 h-5" />
                    </div>
                    <div className="p-3 bg-purple-500/20 rounded-lg hover:bg-purple-500/30 transition-colors cursor-pointer">
                      <Video className="w-5 h-5" />
                    </div>
                    <div className="p-3 bg-indigo-500/20 rounded-lg hover:bg-indigo-500/30 transition-colors cursor-pointer">
                      <Music className="w-5 h-5" />
                    </div>
                    <div className="p-3 bg-blue-300/20 rounded-lg hover:bg-blue-300/30 transition-colors cursor-pointer">
                      <Edit3 className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Canvas */}
                  <div className="h-48 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center border-2 border-dashed border-white/30">
                    <div className="text-center space-y-2 text-blue-800">
                      <Camera className="w-12 h-12 mx-auto" />
                      <p>Drag & Drop to Create</p>
                    </div>
                  </div>

                  {/* Social Preview */}
                  <div className="bg-white/10 rounded-xl p-4 space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></div>
                      <div>
                        <div className="text-sm font-medium text-blue-900">Your Content</div>
                        <div className="text-xs text-blue-700">2 hours ago</div>
                      </div>
                    </div>
                    <div className="h-24 bg-gradient-to-r from-blue-200 to-purple-200 rounded-lg"></div>
                    <div className="flex items-center justify-between text-sm text-blue-900">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <Heart className="w-4 h-4" />
                          <span>1.2K</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MessageCircle className="w-4 h-4" />
                          <span>89</span>
                        </div>
                      </div>
                      <Share2 className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-6 -right-6 w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg animate-bounce">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <div className="absolute -bottom-6 -left-6 w-16 h-16 bg-gradient-to-r from-purple-400 to-blue-400 rounded-2xl flex items-center justify-center shadow-lg animate-pulse">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <div className="absolute top-1/2 -right-8 w-12 h-12 bg-gradient-to-r from-indigo-400 to-blue-400 rounded-xl flex items-center justify-center shadow-lg animate-spin">
                <Star className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;
