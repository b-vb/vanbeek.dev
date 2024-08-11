'use client';

import {
  CartesianGrid, Line, LineChart, XAxis,
} from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  // CardFooter,
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

export type MeasurementChartPoint = {
  date: Date;
  users: Record<string, number>;
};

type Props = {
  data: MeasurementChartPoint[];
};

export function ProgressChart({ data }: Props) {
  const chartConfig = data.reduce((acc, { users }) => {
    Object.keys(users).forEach((user, index) => {
      if (!acc[user]) {
        acc[user] = {
          label: user.charAt(0).toUpperCase() + user.slice(1),
          color: `hsl(var(--chart-${index + 1}))`,
        };
      }
    });

    return acc;
  }, {} as ChartConfig);

  const lines = Object.keys(data[0].users);

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
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            {lines.map((line) => (
              <Line
                key={line}
                dataKey={`users.${line}`}
                type="monotone"
                stroke={`var(--color-${line})`}
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
