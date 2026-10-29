/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Type, Info, Save, Trash2, List } from 'lucide-react';
import { SavedTemplate } from '../types';

interface MessageTemplateProps {
  template: string;
  setTemplate: (val: string) => void;
  availableColumns: string[];
}

export default function MessageTemplate({ template, setTemplate, availableColumns }: MessageTemplateProps) {
  const [savedTemplates, setSavedTemplates] = useState<SavedTemplate[]>([]);
  const [templateName, setTemplateName] = useState('');
  const [showSavedList, setShowSavedList] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('whatsapp_templates');
    if (stored) {
      setSavedTemplates(JSON.parse(stored));
    }
  }, []);

  const saveTemplate = () => {
    if (!template.trim()) return;
    const name = templateName || `Template ${savedTemplates.length + 1}`;
    const newTemplate: SavedTemplate = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      content: template,
      createdAt: Date.now()
    };
    const updated = [newTemplate, ...savedTemplates];
    setSavedTemplates(updated);
    localStorage.setItem('whatsapp_templates', JSON.stringify(updated));
    setTemplateName('');
    alert('Template saved successfully!');
  };

  const deleteTemplate = (id: string) => {
    const updated = savedTemplates.filter(t => t.id !== id);
    setSavedTemplates(updated);
    localStorage.setItem('whatsapp_templates', JSON.stringify(updated));
  };

  const insertVariable = (col: string) => {
    setTemplate(template + ` {{${col}}}`);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-gray-900 flex items-center gap-2">
          <Type className="w-4 h-4" /> Message Content
        </label>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setShowSavedList(!showSavedList)}
            className="p-1.5 hover:bg-gray-100 rounded text-gray-500 transition-colors"
            title="Saved Templates"
          >
            <List className="w-4 h-4" />
          </button>
          <div className="group relative">
            <Info className="w-4 h-4 text-gray-400 cursor-help" />
            <div className="absolute right-0 bottom-full mb-2 w-64 p-2 bg-gray-900 text-white text-[10px] rounded shadow-xl hidden group-hover:block z-50">
              Personalize your messages using variables from your Excel sheet.
            </div>
          </div>
        </div>
      </div>

      {showSavedList && savedTemplates.length > 0 && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 space-y-2 mb-4 max-h-48 overflow-y-auto">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block pb-1 border-b border-gray-100">Saved Templates</span>
          {savedTemplates.map((t) => (
            <div key={t.id} className="flex items-center justify-between group">
              <button 
                onClick={() => {
                  setTemplate(t.content);
                  setShowSavedList(false);
                }}
                className="text-xs text-blue-600 hover:underline text-left truncate flex-1 pr-4"
              >
                {t.name}
              </button>
              <button 
                onClick={() => deleteTemplate(t.id)}
                className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all px-1"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      <textarea
        value={template}
        onChange={(e) => setTemplate(e.target.value)}
        className="w-full h-40 p-3 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none font-sans bg-white shadow-inner"
        placeholder="Example: Hello {{Name}}, your payment for {{Property}} is due. Your VA is {{VirtualAccount}}."
      />

      <div>
        <span className="text-[10px] font-medium text-gray-500 uppercase tracking-wider block mb-2">Insert Variables</span>
        <div className="flex flex-wrap gap-2">
          {availableColumns.map((col) => (
            <button
              key={col}
              onClick={() => insertVariable(col)}
              className="px-2 py-1 bg-white border border-gray-200 rounded text-xs text-gray-700 hover:bg-gray-50 transition-colors shadow-sm active:translate-y-px"
            >
              {`{{${col}}}`}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-2">
        <input 
          type="text" 
          value={templateName}
          onChange={(e) => setTemplateName(e.target.value)}
          placeholder="Template Name (optional)"
          className="flex-1 text-xs p-2 border border-gray-200 rounded outline-none focus:border-blue-300"
        />
        <button 
          onClick={saveTemplate}
          className="flex items-center gap-1.5 px-4 py-2 bg-gray-900 text-white rounded text-xs font-bold hover:bg-black transition-colors"
        >
          <Save className="w-3 h-3" /> Save Template
        </button>
      </div>
    </div>
  );
}
