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
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { formatDate } from '@/lib/utils';
import { MeasurementWithAuthor, UserWithMeasurements } from '@/prisma/db';

export type MeasurementChartPoint = {
  date: Date;
} & Record<string, number>;

type Props = {
  users: UserWithMeasurements[];
  measurements: MeasurementWithAuthor[];
};

export function OverallChart({ users, measurements }: Props) {
  const startWeights: MeasurementChartPoint = users.reduce((acc, user) => {
    acc[user.name] = user.start_weight;
    return acc;
  }, { date: new Date('2024-08-05') } as MeasurementChartPoint);

  const chartData = measurements.reduce(
    (acc, measurement) => {
      const existing = acc.find((item) => formatDate(item.date) === formatDate(measurement.date));
      if (existing) {
        existing[measurement.author.name] = measurement.weight;
      } else {
        // @ts-expect-error
        acc.push({
          date: measurement.date,
          [measurement.author.name]: measurement.weight,
        });
      }

      return acc;
    },
    [startWeights] as MeasurementChartPoint[],
  );

  const chartConfig = chartData.reduce((acc, curr) => {
    Object.keys(curr).forEach((key, index) => {
      if (key !== 'date') {
        acc[key] = {
          label: key,
          color: `hsl(var(--chart-${index}))`,
        };
      }
    });

    return acc;
  }, {} as ChartConfig);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Progress so far</CardTitle>
        <CardDescription>August - December 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 18,
              right: 18,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value: Date) => formatDate(value)}
            />
            <YAxis
              type="number"
              axisLine={false}
              tickLine={false}
              tickMargin={8}
              domain={['dataMin', 'dataMax']}
              tickFormatter={(value: number) => `${value} kg`}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <ChartLegend content={<ChartLegendContent />} />
            {users.map((user) => (
              <Line
                key={user.id}
                dataKey={user.name}
                type="monotone"
                stroke={`var(--color-${user.name})`}
                strokeWidth={2}
                dot
              />
            ))}
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
