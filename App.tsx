import React, { useState, useEffect, useCallback } from 'react';
import { LanguageProvider, useLanguage } from './hooks/useLocalization';
import LanguageSwitcher from './components/LanguageSwitcher';
import FileUpload from './components/FileUpload';
import AnalysisResults from './components/AnalysisResults';
import Loader from './components/Loader';
import { analyzeResume } from './services/geminiService';
import type { AnalysisResult } from './types';
import { fileToBase64 } from './utils/fileReader';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import PdfViewer from './components/PdfViewer';

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

const AppContent: React.FC = () => {
    const { t, language } = useLanguage();
    const [file, setFile] = useState<File | null>(null);
    const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        document.documentElement.lang = language;
        document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    }, [language]);

    const handleFileSelect = (selectedFile: File) => {
        setError(null);
        setAnalysisResult(null);

        if (selectedFile.size > MAX_FILE_SIZE_BYTES) {
            setError(t('error_file_size'));
            setFile(null);
            return;
        }

        if (selectedFile.type !== 'application/pdf') {
            setError(t('error_file_type'));
            setFile(null);
            return;
        }
        
        setFile(selectedFile);
    };

    const handleAnalyzeClick = useCallback(async () => {
        if (!file) {
            setError(t('error_no_file'));
            return;
        }

        setIsLoading(true);
        setError(null);
        setAnalysisResult(null);

        try {
            const base64Data = await fileToBase64(file);
            const result = await analyzeResume(base64Data, file.type, language);
            setAnalysisResult(result);
        } catch (err) {
            console.error(err);
            if (err instanceof Error) {
                switch (err.message) {
                    case 'NETWORK_ERROR':
                        setError(t('error_network'));
                        break;
                    case 'API_ERROR':
                        setError(t('error_api'));
                        break;
                    case 'PARSING_ERROR':
                        setError(t('error_parsing'));
                        break;
                    default:
                        setError(t('error_analysis'));
                }
            } else {
                 setError(t('error_analysis'));
            }
        } finally {
            setIsLoading(false);
        }
    }, [file, language, t]);

    const resetState = () => {
        setFile(null);
        setAnalysisResult(null);
        setError(null);
        setIsLoading(false);
    };

    return (
        <div className="bg-slate-50 min-h-screen flex flex-col font-sans text-slate-800">
            <Header />
            <main className="flex-grow container mx-auto p-4 md:p-8 flex flex-col items-center">
                <div className="w-full max-w-7xl">
                    <LanguageSwitcher />
                    
                    { !analysisResult && (
                        <>
                             <h1 className="text-4xl md:text-5xl font-bold text-center text-slate-900 mt-4">
                                {t('title')}
                            </h1>
                            <p className="text-center text-lg text-slate-600 mt-4 mb-8">
                                {t('subtitle')}
                            </p>
                        </>
                    )}

                    {!analysisResult && (
                        <FileUpload 
                            onFileSelect={handleFileSelect} 
                            onAnalyze={handleAnalyzeClick}
                            isLoading={isLoading}
                            selectedFile={file}
                            reset={resetState}
                        />
                    )}

                    {isLoading && <Loader message={t('loader_message')} />}

                    {error && (
                        <div className="mt-8 w-full max-w-2xl mx-auto bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md shadow-md" role="alert">
                            <p className="font-bold">{t('error_title')}</p>
                            <p>{error}</p>
                        </div>
                    )}

                    {analysisResult && file && (
                        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 w-full">
                            <div className="lg:col-span-3">
                                <AnalysisResults result={analysisResult} onReset={resetState} />
                            </div>
                            <div className="lg:col-span-2">
                                <PdfViewer file={file} />
                            </div>
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
};

const App: React.FC = () => {
    return (
        <LanguageProvider>
            <AppContent />
        </LanguageProvider>
    );
};

export default App;