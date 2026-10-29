/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ContactData, SendResult } from '../types';
import { CheckCircle2, Clock, XCircle, Send } from 'lucide-react';
import { cn } from '../lib/utils';

interface BulkStatusTableProps {
  contacts: ContactData[];
  results: Record<string, SendResult>;
}

export default function BulkStatusTable({ contacts, results }: BulkStatusTableProps) {
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
      <div className="overflow-x-auto max-h-[400px]">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-bottom border-gray-200">
              <th className="px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Contact</th>
              <th className="px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Property/Location</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {contacts.map((contact) => {
              const result = results[contact.id];
              const status = result?.status || 'pending';

              return (
                <tr key={contact.id} className="hover:bg-gray-50 transition-colors group">
                  <td className="px-4 py-3">
                    {status === 'pending' && <Clock className="w-4 h-4 text-gray-300" />}
                    {status === 'sent' && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                    {status === 'sending' && <Send className="w-4 h-4 text-blue-500 animate-pulse" />}
                    {status === 'failed' && <XCircle className="w-4 h-4 text-red-500" />}
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{contact.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{contact.property || '-'}</td>
                </tr>
              );
            })}
            {contacts.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-12 text-center text-sm text-gray-400">
                  No data uploaded yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
