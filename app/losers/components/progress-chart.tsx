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

export type MeasurementChartPoint = {
  date: Date;
} & Record<string, number>;

type Props = {
  data: MeasurementChartPoint[];
};

export function ProgressChart({ data }: Props) {
  const chartConfig = data.reduce((acc, curr) => {
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

  const users = Object.keys(data[0]).filter((key) => key !== 'date');

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
            data={data}
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
                key={user}
                dataKey={user}
                type="monotone"
                stroke={`var(--color-${user})`}
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
