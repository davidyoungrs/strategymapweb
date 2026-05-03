import React from 'react';
import { 
  X, 
  Download, 
  Upload,
  FileText
} from 'lucide-react';
import { CanvasData } from '../../types';

interface ToolsModalProps {
  isOpen: boolean;
  onClose: () => void;
  handleExportPDF: () => void;
  handleExportReport: () => void;
  canvasData: CanvasData;
  setCanvasData: React.Dispatch<React.SetStateAction<CanvasData>>;
  logoUrlInput: string;
  setLogoUrlInput: (val: string) => void;
  handleLogoUrlSubmit: () => void;
  handleLogoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  onLogoDrop: (e: React.DragEvent) => void;
}

export const ToolsModal: React.FC<ToolsModalProps> = ({
  isOpen,
  onClose,
  handleExportPDF,
  handleExportReport,
  canvasData,
  setCanvasData,
  logoUrlInput,
  setLogoUrlInput,
  handleLogoUrlSubmit,
  handleLogoUpload,
  fileInputRef,
  onLogoDrop
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white dark:bg-zinc-950 w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 animate-in zoom-in-95 duration-200"
        onDragOver={(e) => e.preventDefault()}
        onDrop={onLogoDrop}
      >
        <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center">
          <h3 className="text-lg font-black tracking-tight text-zinc-900 dark:text-zinc-50 uppercase">Tools</h3>
          <button onClick={onClose} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-8 space-y-8">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-4">Export Options</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button 
                onClick={() => {
                  handleExportPDF();
                  onClose();
                }}
                className="w-full py-4 bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 rounded-xl font-bold flex flex-col items-center justify-center gap-2 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-all border border-zinc-200 dark:border-zinc-800"
              >
                <Download className="w-5 h-5 text-blue-600" />
                <span className="text-xs uppercase tracking-widest">Current View</span>
              </button>
              <button 
                onClick={() => {
                  handleExportReport();
                  onClose();
                }}
                className="w-full py-4 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-xl font-bold flex flex-col items-center justify-center gap-2 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all shadow-lg"
              >
                <FileText className="w-5 h-5 text-emerald-400 dark:text-emerald-600" />
                <span className="text-xs uppercase tracking-widest">Full Report</span>
              </button>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-zinc-100 dark:border-zinc-800"></div>
            </div>
            <div className="relative flex justify-center text-[10px] uppercase tracking-widest font-bold">
              <span className="bg-white dark:bg-zinc-950 px-4 text-zinc-400">Brand Assets</span>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-4">Company Logo</p>
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl p-10 flex flex-col items-center justify-center gap-4 hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-all cursor-pointer group"
            >
              <div className="w-12 h-12 bg-zinc-100 dark:bg-zinc-900 rounded-full flex items-center justify-center text-zinc-400 group-hover:text-blue-600 transition-colors">
                <Upload className="w-6 h-6" />
              </div>
              <div className="text-center">
                <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Click or drag to upload</p>
                <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1">PNG, JPG or SVG</p>
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleLogoUpload} 
                className="hidden" 
                accept="image/*"
              />
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-zinc-100 dark:border-zinc-800"></div>
              </div>
              <div className="relative flex justify-center text-[10px] uppercase tracking-widest font-bold">
                <span className="bg-white dark:bg-zinc-950 px-4 text-zinc-400">Or use URL</span>
              </div>
            </div>

            <div className="flex gap-2">
              <input 
                type="text"
                value={logoUrlInput}
                onChange={(e) => setLogoUrlInput(e.target.value)}
                placeholder="https://example.com/logo.png"
                className="flex-1 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
              />
              <button 
                onClick={handleLogoUrlSubmit}
                className="px-4 py-2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-lg text-sm font-bold hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all"
              >
                Add
              </button>
            </div>

            {canvasData.logoUrl && (
              <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800">
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-3">Current Logo</p>
                <div className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800">
                  <div className="w-12 h-12 bg-white rounded border border-zinc-200 overflow-hidden flex items-center justify-center p-1">
                    <img src={canvasData.logoUrl} alt="Preview" className="max-w-full max-h-full object-contain" referrerPolicy="no-referrer" />
                  </div>
                  <button 
                    onClick={() => setCanvasData(prev => ({ ...prev, logoUrl: '' }))}
                    className="text-xs font-bold text-red-500 hover:text-red-600 transition-colors uppercase tracking-tight"
                  >
                    Remove
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
