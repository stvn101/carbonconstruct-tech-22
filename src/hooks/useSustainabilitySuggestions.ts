
// Temporary stub until sustainability features are rebuilt
export interface SuggestionMetadata {
  generatedTimestamp?: string;
  analysisVersion?: string;
  source?: 'api' | 'fallback' | 'cache';
  count?: number;
}

export const useSustainabilitySuggestions = () => {
  return {
    suggestions: [],
    prioritySuggestions: [],
    report: null,
    isLoading: false,
    error: null,
    refreshSuggestions: () => Promise.resolve()
  };
};
