import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import prisma from '@/prisma/db';
import { cn, formatDate, getAvatarUrl } from '@/lib/utils';
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from '@/components/ui/card';
import { MeasurementChartPoint, ProgressChart } from './components/progress-chart';
import AddMeasurementDialog from './components/AddMeasurementDialog';

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

  const startWeights: MeasurementChartPoint = {
    date: new Date('2024-08-05'),
    users: users.reduce((acc, user) => {
      acc[user.name] = user.start_weight;
      return acc;
    }, {} as Record<string, number>),
  };

  const chartData = measurements.reduce(
    (acc, measurement) => {
      const existing = acc.find((item) => formatDate(item.date) === formatDate(measurement.date));
      if (existing) {
        existing.users[measurement.author.name] = measurement.weight;
      } else {
        acc.push({
          date: measurement.date,
          users: {
            [measurement.author.name]: measurement.weight,
          },
        });
      }
      return acc;
    },
    [startWeights] as MeasurementChartPoint[],
  );

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex flex-col gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Weight Loss Leaderboard</CardTitle>
            <CardDescription>See who&apos;s crushing their goals!</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {users.map((user) => {
                const startWeight = user.start_weight;
                const currentWeight = user.measurements[0]?.weight ?? startWeight;
                const progress = Math.abs(currentWeight - startWeight).toFixed(2);

                return (
                  <div key={user.id} className="bg-muted rounded-lg p-4 flex flex-col items-center min-h-48">
                    <Avatar className="w-28 h-28 mb-2">
                      <AvatarImage src={getAvatarUrl(user.name)} alt="@username" />
                      <AvatarFallback>{user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="text-card-foreground font-medium">{user.name}</div>
                    <div className={cn('font-semibold text-sm', {
                      'text-green-500': startWeight > currentWeight,
                      'text-red-500': startWeight < currentWeight,
                      'text-yellow-500': startWeight === currentWeight,
                    })}
                    >
                      {startWeight > currentWeight ? '-' : '+'}
                      {progress}
                      kg
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
        <ProgressChart data={chartData} />
        <AddMeasurementDialog users={users} />
      </div>
    </div>
  );
}
