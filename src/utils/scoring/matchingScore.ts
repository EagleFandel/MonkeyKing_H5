export interface MatchingScoreInput {
  skill: number
  time: number
  budget: number
  performance: number
}

export const defaultMatchingWeights = {
  skill: 0.4,
  time: 0.25,
  budget: 0.2,
  performance: 0.15,
}

export function calculateMatchingScore(input: MatchingScoreInput): number {
  const score =
    input.skill * defaultMatchingWeights.skill +
    input.time * defaultMatchingWeights.time +
    input.budget * defaultMatchingWeights.budget +
    input.performance * defaultMatchingWeights.performance

  return Math.round(score)
}

