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
import { formatDate, MeasurementChartPoint } from '@/lib/utils';
import { MeasurementWithAuthor, UserWithMeasurements } from '@/prisma/db';

type Props = {
  users: UserWithMeasurements[];
  measurements: MeasurementWithAuthor[];
};

export function OverallChart({ users, measurements }: Props) {
  const chartData = measurements.reduce(
    (acc, measurement) => {
      const existing = acc.find((item) => formatDate(item.date) === formatDate(measurement.date));
      if (existing) {
        existing[measurement.author.name] = measurement.weight / 1000;
      } else {
        // @ts-expect-error
        acc.push({
          date: measurement.date,
          [measurement.author.name]: measurement.weight / 1000,
        });
      }

      return acc;
    },
    [] as MeasurementChartPoint[],
  );

  const chartConfig = chartData.reduce((acc, curr) => {
    Object.keys(curr).forEach((key, index) => {
      if (key !== 'date') {
        acc[key] = {
          label: key.slice(0, 2),
          color: `hsl(var(--chart-${index}))`,
        };
      }
    });

    return acc;
  }, {} as ChartConfig);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg md:text-2xl">Progress of everyone</CardTitle>
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
              tickMargin={20}
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
              />
            ))}
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
