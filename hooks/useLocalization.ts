import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';
import type { Language } from '../types';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    title: 'ATS Resume Scanner',
    subtitle: 'Get instant feedback on your resume and optimize it for Applicant Tracking Systems.',
    upload_cta: 'Upload your Resume',
    upload_prompt: 'or drag and drop',
    supported_files: 'Supported formats: PDF & DOCX',
    analyze_button: 'Analyze Resume',
    analyzing: 'Analyzing...',
    analysis_report: 'Analysis Report',
    overall_score: 'Overall Score',
    summary: 'Summary',
    sections_feedback: 'Sections Feedback',
    findings: 'Findings',
    suggestions: 'Suggestions',
    loader_message: 'Our AI is scanning your resume... this might take a moment.',
    error_title: 'An Error Occurred',
    error_no_file: 'Please select a file before analyzing.',
    error_file_type: 'Unsupported file type. Please upload a PDF or DOCX file.',
    error_file_size: 'File is too large. Please upload a file under 5MB.',
    error_network: 'A network error occurred. Please check your connection and try again.',
    error_api: 'The analysis service failed to respond. Please try again later.',
    error_parsing: 'Failed to read the analysis results. The response may be malformed.',
    error_analysis: 'An unexpected error occurred during analysis. Please try again.',
    reset_button: 'Scan Another Resume',
    file_selected: 'File selected:',
    change_file: 'Change File',
    lang_en: 'English',
    lang_ar: 'العربية',
    keywords_analysis: 'Keywords Analysis',
    identified_keywords: 'Identified Keywords',
    suggested_keywords: 'Keyword Suggestions',
    keywords_suggestion_intro: 'Consider adding these keywords to better match job descriptions:',
    resume_preview: 'Resume Preview',
    preview_not_available: 'Live preview is not available for DOCX files.',
    tooltip_overall_score: 'Scores are color-coded: Green (85+) is great, Yellow (60-84) has room for improvement, and Red (<60) needs significant attention.',
    tooltip_findings: 'Observations about the current state of this section, highlighting both strengths and weaknesses.',
    tooltip_suggestions: 'Actionable recommendations to improve this section for better ATS performance.',
    score_history: 'Score History',
    score: 'Score',
  },
  ar: {
    title: 'فاحص السيرة الذاتية لـ ATS',
    subtitle: 'احصل على تقييم فوري لسيرتك الذاتية وقم بتحسينها لتتوافق مع أنظمة تتبع المتقدمين.',
    upload_cta: 'ارفع سيرتك الذاتية',
    upload_prompt: 'أو قم بالسحب والإفلات',
    supported_files: 'الصيغ المدعومة: PDF و DOCX',
    analyze_button: 'تحليل السيرة الذاتية',
    analyzing: 'جاري التحليل...',
    analysis_report: 'تقرير التحليل',
    overall_score: 'التقييم العام',
    summary: 'الملخص',
    sections_feedback: 'تقييم الأقسام',
    findings: 'النتائج',
    suggestions: 'الاقتراحات',
    loader_message: 'يقوم الذكاء الاصطناعي بفحص سيرتك الذاتية... قد يستغرق هذا بعض الوقت.',
    error_title: 'حدث خطأ',
    error_no_file: 'يرجى اختيار ملف قبل التحليل.',
    error_file_type: 'نوع الملف غير مدعوم. يرجى رفع ملف PDF أو DOCX.',
    error_file_size: 'حجم الملف كبير جدًا. يرجى رفع ملف أصغر من 5 ميجابايت.',
    error_network: 'حدث خطأ في الشبكة. يرجى التحقق من اتصالك بالإنترنت والمحاولة مرة أخرى.',
    error_api: 'فشلت خدمة التحليل في الاستجابة. يرجى المحاولة مرة أخرى لاحقًا.',
    error_parsing: 'فشل في قراءة نتائج التحليل. قد تكون الاستجابة غير صالحة.',
    error_analysis: 'حدث خطأ غير متوقع أثناء التحليل. يرجى المحاولة مرة أخرى.',
    reset_button: 'فحص سيرة ذاتية أخرى',
    file_selected: 'الملف المختار:',
    change_file: 'تغيير الملف',
    lang_en: 'English',
    lang_ar: 'العربية',
    keywords_analysis: 'تحليل الكلمات المفتاحية',
    identified_keywords: 'الكلمات المفتاحية المكتشفة',
    suggested_keywords: 'اقتراحات الكلمات المفتاحية',
    keywords_suggestion_intro: 'فكر في إضافة هذه الكلمات المفتاحية لتتناسب بشكل أفضل مع الأوصاف الوظيفية:',
    resume_preview: 'معاينة السيرة الذاتية',
    preview_not_available: 'المعاينة المباشرة غير متاحة لملفات DOCX.',
    tooltip_overall_score: 'الدرجات مرمزة بالألوان: الأخضر (85+) ممتاز، الأصفر (60-84) يحتاج لبعض التحسين، والأحمر (<60) يتطلب اهتمامًا كبيرًا.',
    tooltip_findings: 'ملاحظات حول الحالة الحالية لهذا القسم، تسلط الضوء على نقاط القوة والضعف.',
    tooltip_suggestions: 'توصيات عملية لتحسين هذا القسم للحصول على أداء أفضل في أنظمة تتبع المتقدمين.',
    score_history: 'سجل التقييمات',
    score: 'التقييم',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = useCallback((key: string): string => {
    return translations[language][key] || key;
  }, [language]);

  // Fix: The file uses a .ts extension which does not support JSX syntax.
  // Replaced JSX with React.createElement to resolve parsing errors.
  return React.createElement(LanguageContext.Provider, { value: { language, setLanguage, t } }, children);
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};