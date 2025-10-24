
import React, { useState, useCallback, useRef } from 'react';
import { useLanguage } from '../hooks/useLocalization';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  onAnalyze: () => void;
  isLoading: boolean;
  selectedFile: File | null;
  reset: () => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, onAnalyze, isLoading, selectedFile, reset }) => {
  const { t } = useLanguage();
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFileSelect(e.dataTransfer.files[0]);
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelect(e.target.files[0]);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  if (selectedFile) {
      return (
          <div className="w-full max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg border border-slate-200 text-center">
              <i className="fas fa-file-check text-5xl text-emerald-500 mb-4"></i>
              <p className="font-semibold text-slate-700">{t('file_selected')}</p>
              <p className="text-slate-600 mb-6">{selectedFile.name}</p>
              <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                <button
                    onClick={onAnalyze}
                    disabled={isLoading}
                    className="w-full sm:w-auto bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-indigo-700 transition-colors duration-300 disabled:bg-indigo-300 disabled:cursor-not-allowed flex items-center justify-center"
                >
                    {isLoading ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            {t('analyzing')}
                        </>
                    ) : (
                        t('analyze_button')
                    )}
                </button>
                <button onClick={reset} className="w-full sm:w-auto text-slate-600 hover:text-slate-900 font-semibold py-3 px-6 rounded-lg">
                    {t('change_file')}
                </button>
              </div>
          </div>
      );
  }

  return (
    <div
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className={`w-full max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg border-2 border-dashed ${isDragging ? 'border-indigo-500 bg-indigo-50' : 'border-slate-300'} transition-all duration-300`}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept=".pdf"
      />
      <div className="flex flex-col items-center text-center">
        <i className="fas fa-cloud-upload-alt text-5xl text-indigo-500 mb-4"></i>
        <button
            onClick={openFileDialog}
            className="font-bold text-indigo-600 hover:text-indigo-800"
        >
          {t('upload_cta')}
        </button>
        <p className="text-slate-500 my-2">{t('upload_prompt')}</p>
        <p className="text-sm text-slate-400">{t('supported_files')}</p>
      </div>
    </div>
  );
};

export default FileUpload;
