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

type FormState = {
  message: string;
};

export async function addMeasurement(prevState: FormState, formData: FormData) {
  const data = addMeasurementSchema.parse({
    user: formData.get('user'),
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
}
