import React, { useState, useEffect } from 'react';
import { useLanguage } from '../hooks/useLocalization';

interface PdfViewerProps {
  file: File;
}

const PdfViewer: React.FC<PdfViewerProps> = ({ file }) => {
  const { t } = useLanguage();
  const [fileUrl, setFileUrl] = useState<string | null>(null);

  useEffect(() => {
    const url = URL.createObjectURL(file);
    setFileUrl(url);

    return () => {
      URL.revokeObjectURL(url);
      setFileUrl(null);
    };
  }, [file]);

  if (!fileUrl) {
    return (
        <div className="flex items-center justify-center h-full">
            <p>{t('loader_message')}</p>
        </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg border border-slate-200 h-full lg:sticky top-8">
       <h3 className="text-xl font-bold text-slate-800 mb-4 text-center">{t('resume_preview')}</h3>
      <iframe
        src={fileUrl}
        title={file.name}
        className="w-full h-[75vh] min-h-[600px] rounded-md border border-slate-300"
      />
    </div>
  );
};

export default PdfViewer;
