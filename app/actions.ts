'use server';

import prisma from '@/prisma/db';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const addMeasurementSchema = z.object({
  user: z
    .string({
      required_error: 'Please use an existing id.',
    })
    .uuid(),
  weight: z
    .string({
      required_error: 'Please enter a weight.',
    }),
  date:
    z.string({
      required_error: 'Please enter a date.',
    }).pipe(z.coerce.date()),
});

export type FormState = {
  status: 'success' | 'error' | 'initial';
  error: string | null;
};

export async function addMeasurement(prevState: FormState, formData: FormData) {
  try {
    const data = addMeasurementSchema.parse({
      user: formData.get('userId'),
      weight: formData.get('weight'),
      date: formData.get('date'),
    });

    const { user, weight, date } = data;

    await prisma.user.update({
      where: {
        id: user,
      },
      data: {
        measurements: {
          create: {
            weight: parseInt(weight, 10),
            date,
          },
        },
      },
    });

    revalidatePath('/losers');

    return {
      status: 'success',
      error: null,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        status: 'error',
        error: error.errors[0].message,
      };
    }

    // eslint-disable-next-line no-console
    console.error(formData, error);

    return {
      status: 'error',
      error: 'An unknown error occurred, please contact support.',
    };
  }
}
