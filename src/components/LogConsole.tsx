/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef } from 'react';
import { AppLog } from '../types';
import { Terminal, Clock, ShieldCheck, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface LogConsoleProps {
  logs: AppLog[];
}

export default function LogConsole({ logs }: LogConsoleProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="bg-gray-950 rounded-xl overflow-hidden border border-gray-800 shadow-2xl flex flex-col h-[300px]">
      <div className="px-4 py-2 bg-gray-900 border-b border-gray-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Terminal className="w-3 h-3 text-gray-500" />
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">System Execution Logs</span>
        </div>
        <div className="flex gap-1">
          <div className="w-2 h-2 rounded-full bg-red-500/20" />
          <div className="w-2 h-2 rounded-full bg-yellow-500/20" />
          <div className="w-2 h-2 rounded-full bg-green-500/20" />
        </div>
      </div>
      
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-2 font-mono text-[11px] scrollbar-thin scrollbar-thumb-gray-800"
      >
        {logs.length === 0 && (
          <div className="h-full flex items-center justify-center text-gray-700 italic">
            Waiting for activity...
          </div>
        )}
        {logs.map((log) => (
          <div key={log.id} className="flex gap-3 leading-relaxed animate-in fade-in slide-in-from-left-1">
             <span className="text-gray-600 shrink-0">[{new Date(log.timestamp).toLocaleTimeString([], { hour12: false })}]</span>
             <span className={cn(
               "flex items-center gap-1.5",
               log.type === 'info' && "text-blue-400",
               log.type === 'success' && "text-green-400",
               log.type === 'error' && "text-red-400",
               log.type === 'warning' && "text-yellow-400",
             )}>
               {log.type === 'info' && <Clock className="w-3 h-3" />}
               {log.type === 'success' && <CheckCircle2 className="w-3 h-3" />}
               {log.type === 'error' && <AlertTriangle className="w-3 h-3" />}
               {log.type === 'warning' && <ShieldCheck className="w-3 h-3" />}
               {log.message}
             </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Helper to keep it clean
function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}
