import prisma from '@/prisma/db';
import { formatDate } from '@/lib/utils';
import { MeasurementChartPoint, ProgressChart } from './components/progress-chart';
import AddMeasurementDialog from './components/AddMeasurementDialog';
import { PeopleSection } from './components/PeopleSection';

export default async function Page() {
  const users = await prisma.user.findMany({
    include: {
      measurements: {
        orderBy: {
          date: 'desc',
        },
      },
    },
  });

  const measurements = await prisma.measurement.findMany({
    include: {
      author: true,
    },
    orderBy: {
      date: 'asc',
    },
  });

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

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex flex-col gap-6">
        <PeopleSection users={users} />
        <ProgressChart data={chartData} />
        <AddMeasurementDialog users={users} />
      </div>
    </div>
  );
}
