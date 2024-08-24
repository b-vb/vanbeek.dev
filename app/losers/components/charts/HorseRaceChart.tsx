'use client';

import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
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
import { UserWithMeasurements } from '@/prisma/db';

type Props = {
  users: UserWithMeasurements[];
};

export function HorseRaceChart({ users }: Props) {
  const chartData = users.map((user) => {
    const startWeight = user.measurements[0].weight;
    const currentWeight = user.measurements[user.measurements.length - 1].weight;

    return {
      name: user.name,
      loss: (startWeight - currentWeight) / 1000,
      fill: `var(--color-${user.name})`,
    };
  });

  chartData.sort((a, b) => b.loss - a.loss);

  const dynamicConfig = chartData.reduce((acc, curr, index) => {
    acc[curr.name] = {
      label: curr.name,
      color: `hsl(var(--chart-${index + 1}))`,
    };

    return acc;
  }, { name: { label: 'Loss' } } as ChartConfig);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg md:text-2xl">Horse race!</CardTitle>
        <CardDescription>Who lost the most so far?!</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={dynamicConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{ left: 0 }}
          >
            <YAxis
              dataKey="name"
              type="category"
              tickLine={false}
              tickMargin={10}
              width={80}
              minTickGap={1}
              axisLine={false}
              // @ts-expect-error
              tickFormatter={(value) => dynamicConfig[value as keyof typeof dynamicConfig]?.label}
            />
            <XAxis
              dataKey="loss"
              type="number"
              label={{ value: 'Loss (kg)', position: 'insideBottom' }}
              domain={[0, 11]}
              ticks={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="loss" layout="vertical" radius={5} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
