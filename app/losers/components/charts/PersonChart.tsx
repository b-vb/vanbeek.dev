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
import { formatDate, targetWeightForDate } from '@/lib/utils';
import { UserWithMeasurements } from '@/prisma/db';

type Props = {
  user: UserWithMeasurements;
};

export function PersonChart({ user }: Props) {
  const chartData = user.measurements.map((measurement) => ({
    date: measurement.date,
    [user.name]: measurement.weight / 1000,
    target: (targetWeightForDate(user, measurement.date) / 1000).toFixed(1),
  }));

  const chartConfig: ChartConfig = {
    target: {
      label: 'Target',
      color: 'hsl(var(--muted-foreground))',
    },
    [user.name]: {
      label: 'Actual',
      color: `hsl(var(--color-${user.name.toLowerCase()}))`,
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
              tickFormatter={(value: Date) => formatDate(value, navigator.language)}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tickMargin={10}
              domain={['dataMin', 'dataMax']}
              tickCount={10}
              unit="kg"
            />
            <ChartTooltip
              cursor={false}
              content={(
                <ChartTooltipContent hideLabel />)}
            />
            <Line
              dataKey="target"
              type="linear"
              stroke="var(--color-target)"
              strokeDasharray="5 5"
              dot={false}
              strokeWidth={2}
            />
            <Line
              dataKey={user.name}
              type="monotone"
              stroke={`var(--color-${user.name})`}
              strokeWidth={2}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
