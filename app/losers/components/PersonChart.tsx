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

export function PersonChart({ user }: Props) {
  const chartData = user.measurements.map((measurement) => ({
    date: measurement.date,
    [user.name]: measurement.weight / 1000,
  }));

  chartData.unshift({
    date: new Date('2024-08-05'),
    [user.name]: user.start_weight,
  });

  const chartConfig: ChartConfig = {
    [user.name]: {
      label: user.name,
      color: 'hsl(var(--chart-1))',
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
              key={user.id}
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
