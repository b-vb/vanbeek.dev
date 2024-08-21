import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { UserWithMeasurements } from '@/prisma/db';

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
  const currentWeight = measurements[measurements.length - 1].weight;
  const previousWeight = measurements[measurements.length - 2].weight;
  const startWeight = measurements[0].weight;
  const weekProgress = Math.abs(currentWeight - previousWeight);
  const overallProgress = Math.abs(currentWeight - startWeight);

  const bmi = calculateBMI(currentWeight / 1000, user.height);

  return (
    <div key={user.id} className="bg-muted rounded-lg p-4 flex flex-col items-center min-h-48 gap-3">
      <Avatar className="w-28 h-28">
        <AvatarImage src={getAvatarUrl(user.name)} alt="@username" />
        <AvatarFallback>{user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
      </Avatar>
      <div className="font-medium">{user.name}</div>
      <div className="flex gap-2 text-sm">
        <div>
          {user.height}
          cm
        </div>
        <div>
          |
        </div>
        <div>
          BMI
          {' '}
          {bmi.toFixed(1)}
        </div>
      </div>
      <div className="flex gap-2 text-sm">
        <div className={cn({
          'text-green-600': currentWeight < previousWeight,
          'text-red-600': currentWeight > previousWeight,
          'text-yellow-600': currentWeight === previousWeight,
        })}
        >
          {`week:  ${previousWeight > currentWeight ? '-' : '+'}${weekProgress / 1000}kg`}
        </div>
        <div className="text-slate-400">
          |
        </div>
        <div className={cn({
          'text-green-600': currentWeight < startWeight,
          'text-red-600': currentWeight > startWeight,
          'text-yellow-600': startWeight === currentWeight,
        })}
        >
          {`all:  ${startWeight > currentWeight ? '-' : '+'}${overallProgress / 1000}kg`}
        </div>
      </div>
    </div>
  );
}
