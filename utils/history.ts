import type { AnalysisResult, HistoricAnalysisResult } from '../types';

const HISTORY_KEY = 'atsResumeHistory';
const MAX_HISTORY_ITEMS = 5;

export const getHistory = (): HistoricAnalysisResult[] => {
  try {
    const storedHistory = localStorage.getItem(HISTORY_KEY);
    if (storedHistory) {
      return JSON.parse(storedHistory) as HistoricAnalysisResult[];
    }
  } catch (error) {
    console.error("Failed to parse history from localStorage", error);
    localStorage.removeItem(HISTORY_KEY); // Clear corrupted data
  }
  return [];
};

export const saveResultToHistory = (result: AnalysisResult): void => {
  const newEntry: HistoricAnalysisResult = {
    ...result,
    date: Date.now(),
  };
  
  // Get current history, filter out potential duplicates from rapid re-scans if needed
  const history = getHistory();
  
  // Add new entry and limit the size
  const updatedHistory = [newEntry, ...history].slice(0, MAX_HISTORY_ITEMS);
  
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
  } catch (error) {
    console.error("Failed to save history to localStorage", error);
  }
};
