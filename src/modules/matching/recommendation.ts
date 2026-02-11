import type { MatchCandidate } from '@/types/domain'
import { calculateMatchingScore } from '@/utils/scoring/matchingScore'

export interface CandidateFeatures {
  candidate: MatchCandidate
  skill: number
  time: number
  budget: number
  performance: number
}

export function rankCandidates(features: CandidateFeatures[]): MatchCandidate[] {
  return features
    .map((item) => ({
      ...item.candidate,
      matchScore: calculateMatchingScore({
        skill: item.skill,
        time: item.time,
        budget: item.budget,
        performance: item.performance,
      }),
    }))
    .sort((first, second) => second.matchScore - first.matchScore)
}

