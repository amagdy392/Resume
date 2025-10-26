import React, { useState, useEffect } from 'react';
import { useLanguage } from '../hooks/useLocalization';

interface FileViewerProps {
  file: File;
}

const FileViewer: React.FC<FileViewerProps> = ({ file }) => {
  const { t } = useLanguage();
  const [fileUrl, setFileUrl] = useState<string | null>(null);

  useEffect(() => {
    // Only create object URLs for PDFs
    if (file.type === 'application/pdf') {
      const url = URL.createObjectURL(file);
      setFileUrl(url);

      return () => {
        URL.revokeObjectURL(url);
        setFileUrl(null);
      };
    }
  }, [file]);

  const renderContent = () => {
    if (file.type === 'application/pdf') {
      if (!fileUrl) {
        return (
          <div className="flex items-center justify-center h-full">
            <p>{t('loader_message')}</p>
          </div>
        );
      }
      return (
        <iframe
          src={fileUrl}
          title={file.name}
          className="w-full h-[75vh] min-h-[600px] rounded-md border border-slate-300"
        />
      );
    } else {
      return (
        <div className="flex flex-col items-center justify-center h-[75vh] min-h-[600px] text-center bg-slate-100 rounded-md border border-slate-300 p-4">
          <i className="fas fa-file-word text-5xl text-blue-500 mb-4"></i>
          <h4 className="font-semibold text-slate-700">{file.name}</h4>
          <p className="text-slate-500 mt-2">{t('preview_not_available')}</p>
        </div>
      );
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg border border-slate-200 h-full lg:sticky top-8">
      <h3 className="text-xl font-bold text-slate-800 mb-4 text-center">{t('resume_preview')}</h3>
      {renderContent()}
    </div>
  );
};

export default FileViewer;