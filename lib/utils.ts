import { MeasurementWithAuthor, UserWithMeasurements } from '@/prisma/db';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatDate = (date: Date, locale = 'en-US') => date.toLocaleDateString(locale, {
  month: 'short',
  day: 'numeric',
});

const weeksBetween = (date1: Date, date2: Date) => {
  const diff = Math.abs(date1.getTime() - date2.getTime());
  return Math.ceil(diff / (1000 * 60 * 60 * 24 * 7));
};

export const targetWeightForDate = (user: UserWithMeasurements, date: Date) => {
  const [firstMeasurement] = user.measurements;
  const totalWeeks = weeksBetween(firstMeasurement.date, user.goal_date);
  const currentWeeks = weeksBetween(firstMeasurement.date, date);
  const weightLossGoal = firstMeasurement.weight - user.goal_weight;
  const weightLossPerWeek = weightLossGoal / totalWeeks;
  const targetLoss = weightLossPerWeek * currentWeeks;
  return firstMeasurement.weight - targetLoss;
};

export const percentageToGoal = (
  measurement: MeasurementWithAuthor,
  user: UserWithMeasurements,
) => {
  const [firstMeasurement] = user.measurements;
  const weightLossGoal = firstMeasurement.weight - user.goal_weight;
  const currentWeightLoss = firstMeasurement.weight - measurement.weight;
  const percentageLoss = (currentWeightLoss / weightLossGoal) * 100;
  return percentageLoss.toFixed(0);
};

export type MeasurementChartPoint = {
  date: Date;
} & Record<string, number | string>;
