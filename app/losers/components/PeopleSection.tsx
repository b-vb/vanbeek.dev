import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from '@/components/ui/card';
import { UserWithMeasurements } from '@/prisma/db';
import { ThemeToggle } from '@/components/ui/theme-toggler';
import { Person } from './Person';

type Props = {
  users: UserWithMeasurements[];
};

export function PeopleSection({ users }: Props) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Weight Loss Leaderboard</CardTitle>
          <ThemeToggle />
        </div>
        <CardDescription>See who&apos;s crushing their goals!</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {users.map((user) => <Person key={user.id} user={user} />)}
        </div>
      </CardContent>
    </Card>
  );
}
