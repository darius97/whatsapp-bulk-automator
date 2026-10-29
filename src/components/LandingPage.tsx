/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  MessageSquare, 
  ExternalLink, 
  Github, 
  Share2, 
  ArrowRight,
  ShieldCheck,
  Zap,
  Globe,
  Chrome
} from 'lucide-react';
import { motion } from 'motion/react';

interface LandingPageProps {
  onStart: () => void;
  onShowGuide: () => void;
}

export default function LandingPage({ onStart, onShowGuide }: LandingPageProps) {
  const shareApp = () => {
    if (navigator.share) {
      navigator.share({
        title: 'WhatsApp Bulk Automator',
        text: 'Automate your WhatsApp messages with ease!',
        url: window.location.href,
      });
    } else {
      alert('Sharing is not supported in this browser. Copy the URL to share!');
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 overflow-hidden relative">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-50 rounded-full blur-[120px] opacity-60" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-green-50 rounded-full blur-[120px] opacity-60" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl w-full text-center space-y-12"
      >
        {/* Branding */}
        <div className="space-y-6">
          <motion.div 
             initial={{ scale: 0.8 }}
             animate={{ scale: 1 }}
             className="inline-flex items-center justify-center w-20 h-20 bg-blue-600 rounded-3xl shadow-xl shadow-blue-200 mb-4"
          >
            <MessageSquare className="w-10 h-10 text-white" />
          </motion.div>
          <h1 className="text-5xl font-black text-gray-900 tracking-tight">
            WhatsApp Bulk <span className="text-blue-600">Automator</span>
          </h1>
          <p className="text-lg text-gray-500 max-w-lg mx-auto font-medium">
            A powerful, open-source tool for professional messaging automation. 
            Built for efficiency, designed for safety.
          </p>
        </div>

        {/* Feature Pills */}
        <div className="flex flex-wrap justify-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-full border border-gray-100 text-sm font-semibold text-gray-600">
            <ShieldCheck className="w-4 h-4 text-green-500" /> Open Source
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-full border border-gray-100 text-sm font-semibold text-gray-600">
            <Zap className="w-4 h-4 text-yellow-500" /> Randomized Delay
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-full border border-gray-100 text-sm font-semibold text-gray-600">
            <Globe className="w-4 h-4 text-blue-500" /> Web Integration
          </div>
        </div>

        {/* Primary Action */}
        <div className="pt-4">
          <button 
            onClick={onStart}
            className="group relative inline-flex items-center gap-3 bg-gray-900 text-white px-10 py-5 rounded-2xl font-bold text-xl hover:bg-black transition-all shadow-2xl hover:shadow-gray-200 active:scale-95"
          >
            Open Dashboard
            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Action Buttons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <a 
            href="https://web.whatsapp.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center p-6 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md hover:border-gray-200 transition-all group"
          >
            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <ExternalLink className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-sm font-bold text-gray-900">WhatsApp Web</span>
            <span className="text-[10px] text-gray-400 mt-1 uppercase tracking-widest font-bold">Open Portal</span>
          </a>

          <button 
            onClick={onShowGuide}
            className="flex flex-col items-center justify-center p-6 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md hover:border-gray-200 transition-all group"
          >
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Chrome className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-sm font-bold text-gray-900">Extension Setup</span>
            <span className="text-[10px] text-gray-400 mt-1 uppercase tracking-widest font-bold">Install Plugin</span>
          </button>

          <a 
            href="#" // Placeholder for actual GitHub repo
            className="flex flex-col items-center justify-center p-6 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md hover:border-gray-200 transition-all group"
          >
            <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Github className="w-6 h-6 text-gray-900" />
            </div>
            <span className="text-sm font-bold text-gray-900">GitHub Repo</span>
            <span className="text-[10px] text-gray-400 mt-1 uppercase tracking-widest font-bold">Free Access</span>
          </a>

          <button 
            onClick={shareApp}
            className="flex flex-col items-center justify-center p-6 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md hover:border-gray-200 transition-all group"
          >
            <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Share2 className="w-6 h-6 text-orange-600" />
            </div>
            <span className="text-sm font-bold text-gray-900">Share App</span>
            <span className="text-[10px] text-gray-400 mt-1 uppercase tracking-widest font-bold">With Friends</span>
          </button>
        </div>
      </motion.div>

      {/* Footer info */}
      <div className="mt-20 text-gray-300 text-[10px] font-bold uppercase tracking-[0.2em] flex items-center gap-4">
        <span>Trusted By Professionals</span>
        <div className="h-1 w-1 bg-gray-300 rounded-full" />
        <span>V1.0 Stable Build</span>
        <div className="h-1 w-1 bg-gray-300 rounded-full" />
        <span>Open Source Security</span>
      </div>
    </div>
  );
}
