/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, Download, Chrome, Terminal, ShieldCheck, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface InstallationGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function InstallationGuide({ isOpen, onClose }: InstallationGuideProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-gray-50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Chrome className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 leading-tight">Extension Installation Guide</h3>
                  <p className="text-xs text-gray-500 font-medium tracking-tight">Manual side-loading instructions</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-gray-200 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-8 space-y-8">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-widest">
                  <Terminal className="w-4 h-4" /> Step 1: Export Source
                </div>
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 space-y-3">
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Click the <span className="font-bold text-gray-900 italic">Settings icon (gear)</span> in the AI Studio top bar and select <span className="font-bold text-gray-900">"Export as ZIP"</span>. This contains all the files needed for the extension.
                  </p>
                  <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg text-xs font-semibold">
                    <ShieldCheck className="w-4 h-4" /> 
                    Security: Manually check manifest.json for permissions.
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-widest">
                  <Settings className="w-4 h-4" /> Step 2: Chrome Setup
                </div>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="w-6 h-6 rounded-full bg-gray-900 text-white flex items-center justify-center shrink-0 text-xs font-bold">1</div>
                    <p className="text-sm text-gray-600 mt-0.5">Open Chrome and navigate to <code className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-900 font-mono">chrome://extensions</code></p>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-6 h-6 rounded-full bg-gray-900 text-white flex items-center justify-center shrink-0 text-xs font-bold">2</div>
                    <p className="text-sm text-gray-600 mt-0.5">Toggle <span className="font-bold text-gray-900">Developer Mode</span> in the top right corner.</p>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-6 h-6 rounded-full bg-gray-900 text-white flex items-center justify-center shrink-0 text-xs font-bold">3</div>
                    <p className="text-sm text-gray-600 mt-0.5">
                      Click <span className="font-bold text-gray-900 underline">"Load unpacked"</span> and select the <code className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-900 font-bold">dist</code> folder.
                    </p>
                  </div>
                </div>
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl space-y-3">
                  <h4 className="text-xs font-bold text-red-900 uppercase tracking-tight flex items-center gap-2">
                    <Terminal className="w-3 h-3" /> Critical Step: Run Build First
                  </h4>
                  <p className="text-[11px] text-red-800 leading-relaxed">
                    The extension <span className="font-bold">will not load</span> if you select the main project folder. You must first generate the production build by running these commands in your project directory:
                  </p>
                  <div className="bg-gray-900 rounded p-2 font-mono text-[10px] text-gray-300">
                    npm install && npm run build
                  </div>
                  <p className="text-[11px] text-red-800 font-bold">
                    Windows CMD users: I have updated the build scripts to be compatible with Command Prompt.
                  </p>
                </div>
                
                <div className="mt-2 p-3 bg-red-100 border border-red-200 rounded-lg space-y-2">
                  <h5 className="text-[11px] font-bold text-red-900 flex items-center gap-2">
                    <Terminal className="w-3 h-3" /> Still Missing Manifest?
                  </h5>
                  <p className="text-[10px] text-red-800 leading-relaxed font-medium">
                    The real manifest is hidden in the <code className="bg-red-50 px-1 rounded">public</code> folder and gets moved to the <code className="bg-red-50 px-1 rounded">dist</code> folder during Step 1. If you load the wrong folder, Chrome won't find it.
                  </p>
                  <p className="text-[10px] text-red-800 font-bold underline">
                    Solution: Ensure you select the 'dist' folder generated by the build.
                  </p>
                </div>
                
                <div className="mt-4 p-3 bg-green-50 border border-green-100 rounded-lg">
                  <p className="text-[11px] text-green-700 leading-relaxed font-medium">
                    <span className="font-bold text-green-800">New High-Reliability Hub:</span> Look for the green <span className="font-bold underline italic">⚡ BULK AUTOMATOR</span> tab on the left edge of your WhatsApp Web. Clicking it now opens a high-performance **Floating Dashboard Window**.
                  </p>
                </div>
                
                <div className="mt-2 p-3 bg-blue-50 border border-blue-100 rounded-lg space-y-2">
                  <p className="text-[11px] text-blue-700 leading-relaxed font-medium">
                    <span className="font-bold">Security Fix:</span> This new window method bypasses all Chrome "Blocked" errors and WhatsApp security restrictions. It provides a dedicated workspace for your bulk messages.
                  </p>
                </div>
              </div>

              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                 <h4 className="text-sm font-bold text-yellow-900 mb-1 flex items-center gap-2 underline decoration-yellow-300">Important Warning</h4>
                 <p className="text-xs text-yellow-800 leading-relaxed">
                   Browsers like Chrome, Brave, and Edge all support this method. Ensure you allow the extension to access WhatsApp Web URLs when prompted.
                 </p>
              </div>
            </div>

            {/* Footer */}
            <div className="px-8 py-6 bg-gray-50 border-t border-gray-100 flex justify-end">
              <button 
                onClick={onClose}
                className="px-6 py-2.5 bg-gray-900 text-white rounded-lg text-sm font-bold hover:bg-black transition-all shadow-lg shadow-gray-200"
              >
                Got it!
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
