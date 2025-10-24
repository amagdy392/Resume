import React from 'react';
import type { AnalysisResult, SectionFeedback, KeywordsResult, HistoricAnalysisResult } from '../types';
import { useLanguage } from '../hooks/useLocalization';
import Tooltip from './Tooltip';
import HistoryChart from './HistoryChart';

interface AnalysisResultsProps {
  result: AnalysisResult;
  onReset: () => void;
  history: HistoricAnalysisResult[];
}

const ScoreCircle: React.FC<{ score: number }> = ({ score }) => {
    const { t } = useLanguage();
    const getScoreColor = (s: number) => {
        if (s >= 85) return 'text-emerald-500';
        if (s >= 60) return 'text-amber-500';
        return 'text-red-500';
    };

    const color = getScoreColor(score);
    const circumference = 2 * Math.PI * 45;
    const offset = circumference - (score / 100) * circumference;

    return (
        <Tooltip text={t('tooltip_overall_score')}>
            <div className="relative w-32 h-32 md:w-40 md:h-40">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle
                        className="text-slate-200"
                        strokeWidth="10"
                        stroke="currentColor"
                        fill="transparent"
                        r="45"
                        cx="50"
                        cy="50"
                    />
                    <circle
                        className={`${color} transition-all duration-1000 ease-out`}
                        strokeWidth="10"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="transparent"
                        r="45"
                        cx="50"
                        cy="50"
                        transform="rotate(-90 50 50)"
                    />
                </svg>
                <span className={`absolute inset-0 flex items-center justify-center text-3xl md:text-4xl font-bold ${color}`}>
                    {score}
                </span>
            </div>
        </Tooltip>
    );
};

const SectionCard: React.FC<{ section: SectionFeedback }> = ({ section }) => {
    const { t } = useLanguage();

    const getScoreBorderColor = (s: number) => {
        if (s >= 85) return 'border-l-4 border-emerald-500';
        if (s >= 60) return 'border-l-4 border-amber-500';
        return 'border-l-4 border-red-500';
    };
    
    return (
        <div className={`bg-white p-6 rounded-lg border border-slate-200 shadow-sm transition-shadow hover:shadow-md ${getScoreBorderColor(section.score)}`}>
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-slate-800">{section.sectionName}</h3>
                <Tooltip text={t('tooltip_overall_score')}>
                    <span className="text-lg font-semibold bg-slate-100 text-slate-700 px-3 py-1 rounded-full">{section.score}/100</span>
                </Tooltip>
            </div>
            
            <div className="mb-4">
                <Tooltip text={t('tooltip_findings')}>
                     <h4 className="font-semibold text-slate-700 mb-2 flex items-center w-fit"><i className="fas fa-search text-sky-500 ltr:mr-2 rtl:ml-2"></i>{t('findings')}</h4>
                </Tooltip>
                <ul className="list-disc ltr:pl-5 rtl:pr-5 space-y-1 text-slate-600">
                    {section.findings.map((item, index) => <li key={index}>{item}</li>)}
                </ul>
            </div>

            <div>
                 <Tooltip text={t('tooltip_suggestions')}>
                    <h4 className="font-semibold text-slate-700 mb-2 flex items-center w-fit"><i className="fas fa-lightbulb text-amber-500 ltr:mr-2 rtl:ml-2"></i>{t('suggestions')}</h4>
                </Tooltip>
                <ul className="space-y-2 text-slate-600">
                    {section.suggestions.map((item, index) => (
                        <li key={index} className="flex items-start">
                             <i className="fas fa-arrow-circle-right text-amber-500 ltr:mr-2 rtl:ml-2 mt-1 flex-shrink-0"></i>
                             <span>{item}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

const KeywordsCard: React.FC<{ keywords: KeywordsResult }> = ({ keywords }) => {
    const { t } = useLanguage();

    return (
        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm transition-shadow hover:shadow-md">
            <h3 className="text-xl font-bold text-slate-800 mb-4">{t('keywords_analysis')}</h3>
            
            <div className="mb-6">
                <h4 className="font-semibold text-slate-700 mb-3 flex items-center"><i className="fas fa-tags text-indigo-500 ltr:mr-2 rtl:ml-2"></i>{t('identified_keywords')}</h4>
                {keywords.identified.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                        {keywords.identified.map((keyword, index) => (
                            <span key={index} className="bg-indigo-100 text-indigo-800 text-sm font-medium px-3 py-1 rounded-full">{keyword}</span>
                        ))}
                    </div>
                ) : (
                     <p className="text-slate-500 italic">No specific keywords were identified.</p>
                )}
            </div>

            <div>
                <h4 className="font-semibold text-slate-700 mb-2 flex items-center"><i className="fas fa-plus-circle text-emerald-500 ltr:mr-2 rtl:ml-2"></i>{t('suggested_keywords')}</h4>
                 <p className="text-slate-600 mb-3 text-sm">{t('keywords_suggestion_intro')}</p>
                <ul className="space-y-2 text-slate-600">
                    {keywords.suggestions.map((item, index) => (
                         <li key={index} className="flex items-start">
                             <i className="fas fa-plus-circle text-emerald-500 ltr:mr-2 rtl:ml-2 mt-1 flex-shrink-0"></i>
                             <span>{item}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};


const AnalysisResults: React.FC<AnalysisResultsProps> = ({ result, onReset, history }) => {
    const { t } = useLanguage();

    return (
        <div className="mt-8 animate-fade-in w-full">
            <h2 className="text-3xl font-bold text-center text-slate-900 mb-8">{t('analysis_report')}</h2>

            <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg border border-slate-200 mb-8">
                <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
                    <div className="flex-shrink-0">
                        <ScoreCircle score={result.overallScore} />
                        <p className="text-center font-bold text-slate-700 mt-2 text-lg">{t('overall_score')}</p>
                    </div>
                    <div className="flex-1">
                        <h3 className="text-2xl font-bold text-slate-800 mb-2">{t('summary')}</h3>
                        <p className="text-slate-600 leading-relaxed">{result.summary}</p>
                    </div>
                </div>
            </div>

            {history && history.length > 1 && (
                <div className="mb-8">
                    <h3 className="text-2xl font-bold text-slate-900 mb-4">{t('score_history')}</h3>
                    <HistoryChart history={history} />
                </div>
            )}

            <div className="space-y-6">
                <h3 className="text-2xl font-bold text-slate-900 mb-2">{t('sections_feedback')}</h3>
                {result.sections.map((section, index) => (
                    <SectionCard key={index} section={section} />
                ))}
                
                {result.keywords && (
                    <div className="pt-4">
                        <KeywordsCard keywords={result.keywords} />
                    </div>
                )}
            </div>

            <div className="text-center mt-12">
                <button
                    onClick={onReset}
                    className="bg-indigo-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-indigo-700 transition-colors duration-300"
                >
                    {t('reset_button')}
                </button>
            </div>
        </div>
    );
};

export default AnalysisResults;