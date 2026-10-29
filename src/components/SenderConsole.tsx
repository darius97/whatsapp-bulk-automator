/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Play, Square, Settings2, Timer, AlertCircle, Filter, ArrowUpDown } from 'lucide-react';
import { ContactData, SendResult } from '../types';

declare const chrome: any;

interface SenderConsoleProps {
  contacts: ContactData[];
  template: string;
  onStatusUpdate: (contactId: string, result: SendResult) => void;
  onLog: (type: 'info' | 'success' | 'error' | 'warning', message: string) => void;
  onFinish: () => void;
  setFilteredContacts: (contacts: ContactData[]) => void;
  filteredContacts: ContactData[];
}

export default function SenderConsole({ 
  contacts, 
  template, 
  onStatusUpdate, 
  onLog, 
  onFinish,
  setFilteredContacts,
  filteredContacts
}: SenderConsoleProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [minDelay, setMinDelay] = useState(3);
  const [maxDelay, setMaxDelay] = useState(8);
  const [countdown, setCountdown] = useState(0);
  const [propertyFilter, setPropertyFilter] = useState('all');
  const [sortBy, setSortBy] = useState<'none' | 'name' | 'property'>('none');
  
  const properties = ['all', ...Array.from(new Set(contacts.map(c => c.property).filter(Boolean)))];

  useEffect(() => {
    let filtered = [...contacts];
    if (propertyFilter !== 'all') {
      filtered = filtered.filter(c => c.property === propertyFilter);
    }
    if (sortBy === 'name') {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'property') {
      filtered.sort((a, b) => (a.property || '').localeCompare(b.property || ''));
    }
    setFilteredContacts(filtered);
    setCurrentIndex(0);
  }, [propertyFilter, sortBy, contacts]);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleResult = (event: MessageEvent) => {
      if (event.data?.type === 'stealth_send_result') {
        const { success, phone } = event.data;
        if (success) {
          onLog('success', `Stealth Send confirmed for ${phone}`);
        } else {
          onLog('error', `Stealth Send failed for ${phone}. Contact might not exist or UI blocked.`);
        }
      }
      
      if (event.data?.type === 'automation_status') {
        const { logType, message } = event.data;
        onLog(logType, message);
      }
    };
    
    window.addEventListener('message', handleResult);
    return () => window.removeEventListener('message', handleResult);
  }, [onLog]);

  const getMessage = (contact: ContactData) => {
    let msg = template;
    const mappings: Record<string, any> = {
      'Name': contact.name,
      'Property': contact.property,
      'Price': contact.price,
      'VirtualAccount': contact.virtualAccount,
      'Notes': contact.notes,
      ...contact
    };
    
    Object.keys(mappings).forEach(key => {
      const value = mappings[key];
      msg = msg.split(`{{${key}}}`).join(value || '');
    });
    return encodeURIComponent(msg);
  };

  const processNext = async () => {
    if (currentIndex >= filteredContacts.length) {
      setIsProcessing(false);
      onLog('success', `Completed bulk sending to ${filteredContacts.length} contacts.`);
      onFinish();
      return;
    }

    const contact = filteredContacts[currentIndex];
    onLog('info', `[${currentIndex + 1}/${filteredContacts.length}] Preparing message for ${contact.name}...`);
    
    onStatusUpdate(contact.id, { contactId: contact.id, status: 'sending' });

    const fullMessage = getMessage(contact);
    
    try {
      // Send Stealth Send command to parent window (WhatsApp Content Script)
      window.parent.postMessage({ 
        type: 'stealth_send', 
        phone: contact.phone,
        message: decodeURIComponent(fullMessage)
      }, '*');
      
      onLog('info', `Stealth automation started for ${contact.name}...`);
      
      // We still update local UI. Real success feedback comes via the window message listener
      onStatusUpdate(contact.id, { contactId: contact.id, status: 'sent', timestamp: Date.now() });
    } catch (e) {
      onStatusUpdate(contact.id, { contactId: contact.id, status: 'failed', error: 'Automation Error' });
      onLog('error', `Failed stealth trigger for ${contact.name}.`);
    }

    const delay = Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay;
    setCurrentIndex(prev => prev + 1);
    
    if (currentIndex + 1 < filteredContacts.length) {
      onLog('warning', `Interval protection: ${delay}s wait...`);
      setCountdown(delay);
    } else {
      setCountdown(0);
      setIsProcessing(false);
      onFinish();
    }
  };

  useEffect(() => {
    if (isProcessing && countdown > 0) {
      const cd = setTimeout(() => setCountdown(prev => prev - 1), 1000);
      return () => clearTimeout(cd);
    } else if (isProcessing && countdown === 0) {
      processNext();
    }
  }, [isProcessing, countdown]);

  const startSending = () => {
    if (filteredContacts.length === 0) return;
    onLog('info', `Batch process started for ${propertyFilter === 'all' ? 'all contacts' : propertyFilter}.`);
    setIsProcessing(true);
    setCountdown(0); 
  };

  const stopSending = () => {
    onLog('warning', 'Process manually terminated.');
    setIsProcessing(false);
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
          <Settings2 className="w-4 h-4" /> Bulk Control
        </h3>
        {isProcessing && (
          <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold animate-pulse">
            <Timer className="w-3 h-3" /> {countdown}s
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-1">
            <Filter className="w-2.5 h-2.5" /> Filter Location
          </label>
          <select
            value={propertyFilter}
            onChange={(e) => setPropertyFilter(e.target.value)}
            disabled={isProcessing}
            className="w-full p-2 bg-gray-50 border border-gray-200 rounded text-xs focus:ring-2 focus:ring-blue-500 outline-none capitalize"
          >
            {properties.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-1">
            <ArrowUpDown className="w-2.5 h-2.5" /> Sort By
          </label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            disabled={isProcessing}
            className="w-full p-2 bg-gray-50 border border-gray-200 rounded text-xs focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="none">Default Order</option>
            <option value="name">Name (A-Z)</option>
            <option value="property">Location (A-Z)</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Min Delay (s)</label>
          <input
            type="number"
            value={minDelay}
            onChange={(e) => setMinDelay(Number(e.target.value))}
            className="w-full p-2 bg-gray-50 border border-gray-200 rounded text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            min={1}
            disabled={isProcessing}
          />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Max Delay (s)</label>
          <input
            type="number"
            value={maxDelay}
            onChange={(e) => setMaxDelay(Number(e.target.value))}
            className="w-full p-2 bg-gray-50 border border-gray-200 rounded text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            min={1}
            disabled={isProcessing}
          />
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        {!isProcessing ? (
          <button
            onClick={startSending}
            disabled={filteredContacts.length === 0}
            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95"
          >
            <Play className="w-4 h-4 fill-current" /> Send to {filteredContacts.length} Contacts
          </button>
        ) : (
          <button
            onClick={stopSending}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95"
          >
            <Square className="w-4 h-4 fill-current" /> Stop Automator
          </button>
        )}
      </div>

      <div className="pt-4 border-t border-gray-100">
        <div className="flex items-center gap-2 text-[10px] text-gray-500 mb-2 font-bold uppercase tracking-widest">
          <AlertCircle className="w-3 h-3" />
          Progress: {currentIndex} / {filteredContacts.length}
        </div>
        <div className="w-full bg-gray-100 h-1 rounded-full overflow-hidden">
          <div 
            className="bg-blue-600 h-full transition-all duration-500" 
            style={{ width: `${(currentIndex / filteredContacts.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
