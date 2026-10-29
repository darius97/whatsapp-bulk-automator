/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ContactData {
  id: string;
  phone: string;
  name: string;
  property?: string;
  price?: string | number;
  virtualAccount?: string;
  notes?: string;
  [key: string]: any; // Allow for extra custom columns
}

export interface SavedTemplate {
  id: string;
  name: string;
  content: string;
  createdAt: number;
}

export type MessageStatus = 'pending' | 'sending' | 'sent' | 'failed' | 'skipped';

export interface SendResult {
  contactId: string;
  status: MessageStatus;
  timestamp?: number;
  error?: string;
}

export interface AppLog {
  id: string;
  type: 'info' | 'success' | 'error' | 'warning';
  message: string;
  timestamp: number;
}

export interface TemplateVariable {
  key: string;
  label: string;
}
