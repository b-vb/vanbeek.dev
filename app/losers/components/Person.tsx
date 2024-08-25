import {
  Card, CardContent, CardHeader, CardTitle,
} from '@/components/ui/card';
import {
  ArrowDownIcon, ArrowUpIcon, Target, Calendar, Scale,
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { UserWithMeasurements } from '@/prisma/db';
import { formatDate, targetWeightForDate } from '@/lib/utils';
import Image from 'next/image';

const getAvatarUrl = (name: string) => {
  switch (name.toLowerCase()) {
    case 'bjorn':
      return 'https://avatar.iran.liara.run/public/38';
    case 'bas':
      return 'https://avatar.iran.liara.run/public/1';
    case 'gerrit':
      return 'https://avatar.iran.liara.run/public/45';
    case 'marjolein':
      return 'https://avatar.iran.liara.run/public/82';
    case 'jacqueline':
      return 'https://avatar.iran.liara.run/public/90';
    case 'cordelia':
      return 'https://avatar.iran.liara.run/public/77';
    default:
      return '';
  }
};

const calculateBMI = (weightInKG: number, height: number) => weightInKG / (height / 100) ** 2;

type Props = {
  user: UserWithMeasurements;
};

export function Person({ user }: Props) {
  const { measurements } = user;
  const goalWeight = user.goal_weight;
  const currentWeight = measurements[measurements.length - 1].weight;
  const previousWeight = measurements[measurements.length - 2].weight;
  const startWeight = measurements[0].weight;
  const weekLoss = Math.abs(currentWeight - previousWeight);
  const currentLoss = Math.abs(currentWeight - startWeight);
  const goalLoss = Math.abs(startWeight - goalWeight);
  const bmi = calculateBMI(currentWeight / 1000, user.height);
  const progressPercentage = (currentLoss / goalLoss) * 100;
  const targetWeight = targetWeightForDate(user, measurements[measurements.length - 1].date) / 1000;
  const isOnTrack = currentWeight <= startWeight;
  const isOnTrackThisWeek = (currentWeight / 1000) <= targetWeight;
  const remainingWeight = Math.max(0, currentWeight - goalWeight);

  const avatarUrl = getAvatarUrl(user.name);
  return (
    <Card className="w-full max-w-md">
      <CardHeader className="flex flex-row items-center gap-4">
        <Image width={64} height={64} src={avatarUrl} alt="" className="rounded-full w-16 h-16" />
        <div>
          <CardTitle>{user.name}</CardTitle>
          <p className="text-sm text-muted-foreground">
            {`${user.height} cm | BMI ${bmi.toFixed(1)}`}
          </p>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Scale className="w-4 h-4 text-muted-foreground" />
            <span className="font-semibold">
              {`${currentWeight / 1000} kg`}
            </span>
          </div>
          <Badge variant={isOnTrackThisWeek ? 'default' : 'destructive'}>
            {isOnTrackThisWeek ? 'On Track' : 'Needs Push'}
          </Badge>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress to Goal</span>
            <span>
              {`${(remainingWeight / 1000).toFixed(1)} kg to go`}
            </span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>

        <div className="flex justify-between text-sm">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-muted-foreground" />
            <span>
              {`Goal: ${goalWeight / 1000} kg`}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span>
              {`By: ${formatDate(user.goal_date)}`}
            </span>
          </div>
        </div>

        <div className="flex justify-between text-sm">
          <div className="flex items-center gap-1">
            <span className="font-medium">Week:</span>
            <span className={isOnTrackThisWeek ? 'text-green-500' : 'text-red-500'}>
              {isOnTrackThisWeek ? <ArrowDownIcon className="inline w-4 h-4" /> : <ArrowUpIcon className="inline w-4 h-4" /> }
              {`${Math.abs(weekLoss / 1000)} kg`}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <span className="font-medium">Total:</span>
            <span className={isOnTrack ? 'text-green-500' : 'text-red-500'}>
              {isOnTrack ? <ArrowDownIcon className="inline w-4 h-4" /> : <ArrowUpIcon className="inline w-4 h-4" /> }
              {`${Math.abs(currentLoss / 1000)} kg`}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
