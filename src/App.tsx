/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  MessageSquare, 
  Database, 
  Terminal, 
  Settings,
  HelpCircle,
  ExternalLink,
  Github,
  Home,
  Download,
  X
} from 'lucide-react';
import ExcelUploader from './components/ExcelUploader';
import MessageTemplate from './components/MessageTemplate';
import BulkStatusTable from './components/BulkStatusTable';
import SenderConsole from './components/SenderConsole';
import LandingPage from './components/LandingPage';
import LogConsole from './components/LogConsole';
import InstallationGuide from './components/InstallationGuide';
import { ContactData, SendResult, AppLog } from './types';
import { motion, AnimatePresence } from 'motion/react';

type ViewState = 'landing' | 'dashboard';

export default function App() {
  const [view, setView] = useState<ViewState>('landing');
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [contacts, setContacts] = useState<ContactData[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<ContactData[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [template, setTemplate] = useState('');
  const [results, setResults] = useState<Record<string, SendResult>>({});
  const [logs, setLogs] = useState<AppLog[]>([]);

  const handleDataLoaded = (data: ContactData[], cols: string[]) => {
    setContacts(data);
    setFilteredContacts(data);
    setColumns(cols);
    setResults({});
    addLog('info', `Database loaded: ${data.length} contacts identified.`);
  };

  const addLog = (type: AppLog['type'], message: string) => {
    const newLog: AppLog = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      message,
      timestamp: Date.now()
    };
    setLogs(prev => [...prev, newLog].slice(-50));
  };

  const handleStatusUpdate = (id: string, result: SendResult) => {
    setResults(prev => ({ ...prev, [id]: result }));
  };

  if (view === 'landing') {
    return <LandingPage onStart={() => setView('dashboard')} onShowGuide={() => setIsGuideOpen(true)} />;
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-gray-900 font-sans selection:bg-blue-100 selection:text-blue-900">
      <InstallationGuide isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />
      {/* Top Navigation */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setView('landing')}
            className="bg-gray-900 p-2 rounded-lg hover:bg-black transition-colors"
          >
            <MessageSquare className="w-5 h-5 text-white" />
          </button>
          <div>
            <h1 className="text-sm font-bold tracking-tight">WhatsApp Bulk Automator</h1>
            <p className="text-[10px] text-gray-500 font-medium uppercase tracking-widest">Enterprise Edition</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setView('landing')}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-all rounded-lg"
          >
            <Home className="w-4 h-4" /> Home
          </button>
          
          {/* Close Button for Modal Mode */}
          <div className="h-6 w-px bg-gray-200" />
          <button 
            onClick={() => window.parent.postMessage('close_wa_automator', '*')}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 transition-all rounded-lg border border-red-100"
          >
            <X className="w-4 h-4" /> Exit Setup
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column - Setup */}
          <div className="lg:col-span-4 space-y-8">
            <motion.section 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
                <Database className="w-3 h-3" /> Step 1: Manage Database
              </div>
              <ExcelUploader onDataLoaded={handleDataLoaded} />
            </motion.section>

            <AnimatePresence mode="wait">
              {contacts.length > 0 && (
                <motion.section 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
                    <Settings className="w-3 h-3" /> Step 2: Message Content
                  </div>
                  <MessageTemplate 
                    template={template} 
                    setTemplate={setTemplate} 
                    availableColumns={columns} 
                  />
                  
                  <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest pt-4 mb-2">
                    <Terminal className="w-3 h-3" /> Step 3: Sending Intervals
                  </div>
                  <SenderConsole 
                    contacts={contacts} 
                    filteredContacts={filteredContacts}
                    setFilteredContacts={setFilteredContacts}
                    template={template} 
                    onStatusUpdate={handleStatusUpdate}
                    onLog={addLog}
                    onFinish={() => addLog('success', 'Batch process finished.')}
                  />
                </motion.section>
              )}
            </AnimatePresence>
            
            {logs.length > 0 && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4 pt-4"
              >
                <LogConsole logs={logs} />
              </motion.section>
            )}
          </div>

          {/* Right Column - Monitoring */}
          <div className="lg:col-span-8 space-y-8">
            <motion.section 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest">
                  <Terminal className="w-3 h-3" /> Real-time Progress Monitor
                </div>
                {filteredContacts.length > 0 && (
                  <div className="flex gap-4 text-[10px] font-bold">
                    <span className="flex items-center gap-1 text-green-600 bg-green-50 px-2 py-0.5 rounded border border-green-100">
                      SENT: {Object.values(results).filter((r: SendResult) => r.status === 'sent').length}
                    </span>
                    <span className="flex items-center gap-1 text-gray-600 bg-gray-50 px-2 py-0.5 rounded border border-gray-100">
                      TARGET: {filteredContacts.length}
                    </span>
                  </div>
                )}
              </div>
              
              <BulkStatusTable contacts={filteredContacts} results={results} />
            </motion.section>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 mt-12 py-8 bg-white">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-400 text-[11px] font-medium uppercase tracking-widest">
            © 2026 WhatsApp Bulk Automator • Designed for Efficiency
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-[11px] font-bold text-gray-400 hover:text-blue-600 uppercase tracking-widest transition-colors">Terms of Service</a>
            <a href="#" className="text-[11px] font-bold text-gray-400 hover:text-blue-600 uppercase tracking-widest transition-colors">Privacy Policy</a>
            <a href="#" className="text-[11px] font-bold text-gray-400 hover:text-blue-600 uppercase tracking-widest transition-colors">Security Audit</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
