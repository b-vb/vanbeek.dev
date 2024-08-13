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

const calculateBMI = (weight: number, height: number) => weight / (height / 100) ** 2;

type Props = {
  user: UserWithMeasurements;
};

export function Person({ user }: Props) {
  const startWeight = user.start_weight;
  const currentWeight = user.measurements[0]?.weight ?? startWeight;
  const progress = Math.abs(currentWeight - startWeight).toFixed(2);
  const bmi = calculateBMI(currentWeight, user.height);

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
        <div className={cn('font-semibold', {
          'text-green-500': startWeight > currentWeight,
          'text-red-500': startWeight < currentWeight,
          'text-yellow-500': startWeight === currentWeight,
        })}
        >
          {startWeight > currentWeight ? '-' : '+'}
          {progress}
          kg
        </div>
        <div>
          |
        </div>
        <div>
          BMI:
          {' '}
          {bmi.toFixed(2)}
        </div>
      </div>
    </div>
  );
}
