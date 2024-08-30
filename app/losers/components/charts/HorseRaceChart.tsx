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
} from '@/components/ui/chart';
import { UserWithMeasurements } from '@/prisma/db';
import { useState } from 'react';
import { Switch } from '@/components/ui/switch';

type Props = {
  users: UserWithMeasurements[];
};

const getChartData = (users: UserWithMeasurements[], relative: boolean) => {
  if (relative) {
    const data = users.map((user) => {
      const startWeight = user.measurements[0].weight;
      const currentWeight = user.measurements[user.measurements.length - 1].weight;
      const goalWeight = user.goal_weight;
      const goalLoss = startWeight - goalWeight;
      const currentLoss = startWeight - currentWeight;
      const lossPercentage = (currentLoss / goalLoss) * 100;

      return {
        name: user.name,
        loss: parseInt(lossPercentage.toFixed(1), 10),
        fill: `var(--color-${user.name})`,
      };
    });

    return data;
  }

  const data = users.map((user) => {
    const startWeight = user.measurements[0].weight;
    const currentWeight = user.measurements[user.measurements.length - 1].weight;

    return {
      name: user.name,
      loss: (startWeight - currentWeight) / 1000,
      fill: `var(--color-${user.name})`,
    };
  });

  return data;
};

export function HorseRaceChart({ users }: Props) {
  const [relative, setRelative] = useState(false);

  const chartData = getChartData(users, relative).sort((a, b) => b.loss - a.loss);

  const dynamicConfig = chartData.reduce((acc, user) => {
    acc[user.name] = {
      label: user.name,
      color: `hsl(var(--color-${user.name.toLowerCase()}))`,
    };

    return acc;
  }, { name: { label: 'Loss' } } as ChartConfig);

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg md:text-2xl">Horse race 🏇🏼</CardTitle>
          <div className="flex gap-2">
            <Switch
              id="relative-toggle"
              checked={relative}
              onCheckedChange={setRelative}
            />
            <label htmlFor="relative-toggle">
              {relative ? 'Relative' : 'Absolute'}
            </label>
          </div>
        </div>
        <CardDescription>Who lost the most so far?</CardDescription>

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
              unit={relative ? '%' : 'kg'}
            />
            <Bar
              dataKey="loss"
              layout="vertical"
              radius={5}
              label={{
                position: 'right',
                formatter: (value: number) => `${value}${relative ? '%' : 'kg'}`,
              }}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
