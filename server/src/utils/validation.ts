import { z } from 'zod';

export const PhotographSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  photoUrl: z.string().url('Invalid photo URL'),
  description: z.string().optional(),
  author: z.string().min(1, 'Author is required').max(100, 'Author name too long'),
  position: z.object({
    type: z.literal('Point'),
    coordinates: z.tuple([
      z.number().min(-180).max(180),
      z.number().min(-90).max(90)
    ])
  }),
  website: z.string().optional()
});

export function validateRequest<T>(schema: z.ZodSchema<T>, data: unknown): {
  success: boolean;
  data?: T;
  errors?: { field: string; message: string }[];
} {
  try {
    const validData = schema.parse(data);
    return { success: true, data: validData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message
      }));
      return { success: false, errors };
    }
    return { success: false, errors: [{ field: 'unknown', message: 'Validation failed' }] };
  }
}