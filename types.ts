export type Language = 'en' | 'ar';

export interface SectionFeedback {
  sectionName: string;
  score: number;
  findings: string[];
  suggestions: string[];
}

export interface KeywordsResult {
  identified: string[];
  suggestions: string[];
}

export interface AnalysisResult {
  overallScore: number;
  summary: string;
  sections: SectionFeedback[];
  keywords: KeywordsResult;
}