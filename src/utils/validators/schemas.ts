import { z } from 'zod'

export const verifySchema = z.object({
  role: z.enum(['entrepreneur', 'parent', 'student', 'coach']),
  realName: z.string().min(2),
  idNumber: z.string().min(8),
  selfieToken: z.string().min(4),
})

export const projectRequirementSchema = z.object({
  projectType: z.string().min(1),
  techStack: z.array(z.string()).min(1),
  budgetMin: z.number().min(0),
  budgetMax: z.number().min(0),
  startDate: z.string().min(1),
  endDate: z.string().min(1),
  personalityTraits: z.array(z.string()).min(1),
  description: z.string().min(10),
})

export const tutorRequirementSchema = z.object({
  grade: z.string().min(1),
  subjects: z.array(z.string()).min(1),
  schedule: z.string().min(1),
  mode: z.enum(['online', 'offline']),
  location: z.string().min(1),
  budget: z.number().min(0).optional(),
  customNeeds: z.string().optional(),
})

export const sparringRequirementSchema = z.object({
  sportType: z.string().min(1),
  timeSlots: z.string().min(1),
  location: z.string().min(1),
  needGuidance: z.boolean(),
  currentLevel: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
  improvementGoals: z.string().optional(),
  budget: z.number().min(0).optional(),
})

export const talentProfileSchema = z.object({
  skills: z
    .array(
      z.object({
        name: z.string().min(1),
        level: z.enum(['beginner', 'intermediate', 'advanced']),
      }),
    )
    .min(1),
  availableTime: z.string().min(1),
  expectedPay: z.string().min(1),
  interests: z.array(z.string()).min(1),
  intro: z.string().optional(),
  personalityTags: z.array(z.string()).optional(),
  workStyle: z.string().optional(),
})

