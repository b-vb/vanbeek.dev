'use client';

import {
  CartesianGrid, Line, LineChart, XAxis, YAxis,
} from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { formatDate } from '@/lib/utils';
import { UserWithMeasurements } from '@/prisma/db';

export type MeasurementChartPoint = {
  date: Date;
} & Record<string, number>;

type Props = {
  user: UserWithMeasurements;
};

const weeksBetween = (date1: Date, date2: Date) => {
  const diff = Math.abs(date1.getTime() - date2.getTime());
  return Math.ceil(diff / (1000 * 60 * 60 * 24 * 7));
};

const targetWeightForDate = (user: UserWithMeasurements, date: Date) => {
  const [firstMeasurement] = user.measurements;
  const totalWeeks = weeksBetween(firstMeasurement.date, user.goal_date);
  const currentWeeks = weeksBetween(firstMeasurement.date, date);
  const weightLossGoal = firstMeasurement.weight - user.goal_weight;
  const weightLossPerWeek = weightLossGoal / totalWeeks;
  const targetLoss = weightLossPerWeek * currentWeeks;
  return firstMeasurement.weight - targetLoss;
};

export function PersonChart({ user }: Props) {
  const chartData = user.measurements.map((measurement) => ({
    date: measurement.date,
    [user.name]: measurement.weight / 1000,
    target: (targetWeightForDate(user, measurement.date) / 1000).toFixed(1),
  }));

  targetWeightForDate(user, user.measurements[2].date);

  const chartConfig: ChartConfig = {
    [user.name]: {
      label: user.name,
      color: 'hsl(var(--chart-1))',
    },
    target: {
      label: 'Target',
      color: 'hsl(var(--chart-4))',
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg md:text-2xl">
          {`Progress of ${user.name}`}
        </CardTitle>
        <CardDescription>August - December 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              tickFormatter={(value: Date) => formatDate(value)}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tickMargin={10}
              domain={['dataMin', 'dataMax']}
              tickFormatter={(value: number) => `${value} kg`}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Line
              dataKey={user.name}
              type="monotone"
              stroke={`var(--color-${user.name})`}
              strokeWidth={2}
            />
            <Line
              dataKey="target"
              type="linear"
              stroke="var(--color-target)"
              strokeDasharray="5 5"
              dot={false}
              strokeWidth={2}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
