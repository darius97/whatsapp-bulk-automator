/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState } from 'react';
import * as XLSX from 'xlsx';
import { Upload, FileSpreadsheet, X, Check } from 'lucide-react';
import { ContactData } from '../types';
import { cn } from '../lib/utils';

interface ExcelUploaderProps {
  onDataLoaded: (data: ContactData[], columns: string[]) => void;
}

export default function ExcelUploader({ onDataLoaded }: ExcelUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: 'array' });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const json = XLSX.utils.sheet_to_json(worksheet) as any[];

      if (json.length === 0) return;

      const columns = Object.keys(json[0]);
      
      // Map to ContactData structure
      const formattedData: ContactData[] = json.map((row, index) => {
        // Try to find specific field names based on user request or column order
        const phoneKey = columns.find(c => /phone|tel|number|wa|hp/i.test(c)) || columns[0];
        const nameKey = columns.find(c => /name|nama/i.test(c)) || columns[1];
        const propKey = columns.find(c => /property|location|place|lokasi|unit/i.test(c)) || columns[2];
        const priceKey = columns.find(c => /price|harga|amount/i.test(c)) || columns[3];
        const vaKey = columns.find(c => /va|virtual|account/i.test(c)) || columns[4];
        const noteKey = columns.find(c => /note|catatan|extra/i.test(c)) || columns[5];

        return {
          id: `contact-${index}`,
          phone: String(row[phoneKey] || '').replace(/\D/g, ''),
          name: String(row[nameKey] || 'Customer'),
          property: row[propKey] ? String(row[propKey]) : undefined,
          price: row[priceKey] ? String(row[priceKey]) : undefined,
          virtualAccount: row[vaKey] ? String(row[vaKey]) : undefined,
          notes: row[noteKey] ? String(row[noteKey]) : undefined,
          ...row
        };
      });

      onDataLoaded(formattedData, columns);
    };
    reader.readAsArrayBuffer(file);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="w-full">
      <div
        className={cn(
          "relative border-2 border-dashed rounded-xl p-8 transition-all duration-200 flex flex-col items-center justify-center cursor-pointer group",
          isDragging 
            ? "border-blue-500 bg-blue-50" 
            : "border-gray-200 hover:border-gray-300 bg-gray-50"
        )}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept=".xlsx, .xls, .csv"
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        />

        {fileName ? (
          <div className="flex flex-col items-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-2">
              <Check className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-sm font-medium text-gray-900">{fileName}</span>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setFileName(null);
                onDataLoaded([], []);
              }}
              className="text-xs text-red-500 hover:underline flex items-center gap-1"
            >
              <X className="w-3 h-3" /> Remove
            </button>
          </div>
        ) : (
          <>
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Upload className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-sm font-semibold text-gray-900">Upload Contact Database</h3>
            <p className="text-xs text-gray-500 mt-1">Excel (.xlsx) or CSV files supported</p>
            <div className="mt-4 flex gap-2">
              <span className="inline-flex items-center px-2 py-1 rounded text-[10px] font-medium bg-gray-100 text-gray-600">
                <FileSpreadsheet className="w-3 h-3 mr-1" /> .xlsx
              </span>
              <span className="inline-flex items-center px-2 py-1 rounded text-[10px] font-medium bg-gray-100 text-gray-600">
                <FileSpreadsheet className="w-3 h-3 mr-1" /> .csv
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
