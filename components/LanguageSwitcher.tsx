
import React from 'react';
import { useLanguage } from '../hooks/useLocalization';
import type { Language } from '../types';

const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
  };

  return (
    <div className="flex justify-center p-2 rounded-lg mb-6">
      <button
        onClick={() => handleLanguageChange('en')}
        className={`px-4 py-2 text-sm font-semibold rounded-l-md transition-colors duration-200 ${
          language === 'en'
            ? 'bg-indigo-600 text-white'
            : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
        }`}
      >
        {t('lang_en')}
      </button>
      <button
        onClick={() => handleLanguageChange('ar')}
        className={`px-4 py-2 text-sm font-semibold rounded-r-md transition-colors duration-200 ${
          language === 'ar'
            ? 'bg-indigo-600 text-white'
            : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
        }`}
      >
        {t('lang_ar')}
      </button>
    </div>
  );
};

export default LanguageSwitcher;
