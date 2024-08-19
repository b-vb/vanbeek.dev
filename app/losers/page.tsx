import prisma from '@/prisma/db';
import {
  Tabs, TabsContent, TabsList, TabsTrigger,
} from '@/components/ui/tabs';
import { OverallChart } from './components/OverallChart';
import AddMeasurementDialog from './components/AddMeasurementDialog';
import { PeopleSection } from './components/PeopleSection';
import { PersonChart } from './components/PersonChart';

export default async function Page() {
  const users = await prisma.user.findMany({
    include: {
      measurements: {
        orderBy: {
          date: 'asc',
        },
      },
    },
    orderBy: {
      name: 'asc',
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

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex flex-col gap-6">
        <PeopleSection users={users} />

        <Tabs defaultValue="overall">
          <TabsList className="flex flex-col h-auto">
            <TabsTrigger value="overall">Overall</TabsTrigger>
            <div>
              {users.map((user) => (
                <TabsTrigger key={user.id} value={user.name}>
                  {user.name.slice(0, 2)}
                </TabsTrigger>
              ))}
            </div>
          </TabsList>
          <TabsContent value="overall">
            <OverallChart users={users} measurements={measurements} />
          </TabsContent>
          {users.map((user) => (
            <TabsContent key={user.id} value={user.name}>
              <PersonChart user={user} />
            </TabsContent>
          ))}
        </Tabs>

        <AddMeasurementDialog users={users} />
      </div>
    </div>
  );
}
