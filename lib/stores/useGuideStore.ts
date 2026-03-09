import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface GuideAnswers {
  currentSituation: string;
  income: string;
  savings: string;
  debts: string[];
  shortTerm: string[];
  mediumTerm: string[];
  longTerm: string[];
}

export interface RecommendationItem {
  title: string;
  description: string;
  checklist: string[];
  links?: { text: string; href: string }[];
  timeline?: string;
}

export interface Recommendations {
  immediate: RecommendationItem[];
  shortTerm: RecommendationItem[];
  mediumTerm: RecommendationItem[];
  longTerm: RecommendationItem[];
}

interface GuideStore {
  step: number;
  answers: GuideAnswers;
  recommendations: Recommendations | null;

  // Actions
  setStep: (step: number) => void;
  setAnswer: (field: keyof GuideAnswers, value: any) => void;
  toggleMultiSelect: (field: keyof GuideAnswers, value: string) => void;
  setRecommendations: (recs: Recommendations) => void;
  reset: () => void;
}

const initialAnswers: GuideAnswers = {
  currentSituation: '',
  income: '',
  savings: '',
  debts: [],
  shortTerm: [],
  mediumTerm: [],
  longTerm: [],
};

export const useGuideStore = create<GuideStore>()(
  persist(
    (set) => ({
      step: 1,
      answers: initialAnswers,
      recommendations: null,

      setStep: (step) => set({ step }),

      setAnswer: (field, value) =>
        set((state) => ({
          answers: { ...state.answers, [field]: value },
        })),

      toggleMultiSelect: (field, value) =>
        set((state) => {
          const current = (state.answers[field] as string[]) || [];
          return {
            answers: {
              ...state.answers,
              [field]: current.includes(value)
                ? current.filter((v) => v !== value)
                : [...current, value],
            },
          };
        }),

      setRecommendations: (recs) => set({ recommendations: recs }),

      reset: () => set({ step: 1, answers: initialAnswers, recommendations: null }),
    }),
    {
      name: 'guide-store',
    }
  )
);
