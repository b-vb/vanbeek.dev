import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from '@/components/ui/card';
import { UserWithMeasurements } from '@/prisma/db';
import { Person } from './Person';

type Props = {
  users: UserWithMeasurements[];
};

export function PeopleSection({ users }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Weight Loss Leaderboard</CardTitle>
        <CardDescription>See who&apos;s crushing their goals!</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {users.map((user) => <Person key={user.id} user={user} />)}
        </div>
      </CardContent>
    </Card>
  );
}
