import { useMemo } from 'react';
import type { OnboardingCase } from '../types/case';
import type { OnboardingFeedback } from '../types/feedback';

export interface DashboardStats {
  total: number;
  openActive: number;
  completed: number;
  avgRating: number | null;
  avgNPS: number | null;
}

export function useDashboardStats(
  cases: OnboardingCase[] | undefined,
  feedback: OnboardingFeedback[] | undefined,
): DashboardStats {
  return useMemo(() => {
    if (!cases) {
      return { total: 0, openActive: 0, completed: 0, avgRating: null, avgNPS: null };
    }

    const total = cases.length;
    const openActive = cases.filter(
      (c) => c.OB_Status === 'Neu' || c.OB_Status === 'In_Bearbeitung',
    ).length;
    const completed = cases.filter(
      (c) => c.OB_Status === 'Abgeschlossen',
    ).length;

    let avgRating: number | null = null;
    let avgNPS: number | null = null;

    if (feedback && feedback.length > 0) {
      const ratings = feedback
        .map((f) => f.OB_FB_Gesamtzufriedenheit)
        .filter((r) => r != null && r > 0);
      if (ratings.length > 0) {
        avgRating = Math.round((ratings.reduce((a, b) => a + b, 0) / ratings.length) * 10) / 10;
      }

      const npsValues = feedback
        .map((f) => f.OB_FB_NPS)
        .filter((n) => n != null);
      if (npsValues.length > 0) {
        avgNPS = Math.round((npsValues.reduce((a, b) => a + b, 0) / npsValues.length) * 10) / 10;
      }
    }

    return { total, openActive, completed, avgRating, avgNPS };
  }, [cases, feedback]);
}
