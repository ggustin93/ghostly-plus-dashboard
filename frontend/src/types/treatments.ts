import { z } from 'zod';

// Re-export TreatmentFormValues if it's the primary type for a treatment plan
// Or define a more specific TreatmentPlan type if needed for storage/display

// Schema for a stored treatment plan (can be similar to form values, but might include id, creation/update dates etc.)
export const treatmentPlanSchema = z.object({
  id: z.string(), // Unique ID for the stored treatment plan
  patientId: z.string(),
  name: z.string(),
  gameType: z.enum(['maze', 'space']),
  difficulty: z.number(),
  duration: z.number(),
  restInterval: z.number(),
  maxIntensity: z.number(),
  useBloodFlowRestriction: z.boolean(),
  bfrPressure: z.number().optional(),
  muscleTargets: z.array(z.string()),
  notes: z.string().optional(),
  createdAt: z.string().optional(), // ISO date string
  updatedAt: z.string().optional(), // ISO date string
});

export type TreatmentPlan = z.infer<typeof treatmentPlanSchema>;

// If TreatmentFormValues from the component is sufficient and already defined:
// export { type TreatmentFormValues as TreatmentPlan } from '@/components/treatments/TreatmentFormFields'; 