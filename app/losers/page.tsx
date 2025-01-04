import prisma from '@/prisma/db';
import {
  Tabs, TabsContent, TabsList, TabsTrigger,
} from '@/components/ui/tabs';
import AddMeasurementDialog from './components/AddMeasurementDialog';
import { PeopleSection } from './components/PeopleSection';
import { OverallChart } from './components/charts/OverallChart';
import { PersonChart } from './components/charts/PersonChart';
import { GoalsChart } from './components/charts/GoalsChart';
import { HorseRaceChart } from './components/charts/HorseRaceChart';

export const revalidate = 3600; // revalidate at most every hour

export default async function Page() {
  const usersWithMeasurements = await prisma.user.findMany({
    where: {
      measurements: {
        some: {}
      }
    },
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
  
  const allUsers = await prisma.user.findMany({
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
        <PeopleSection users={usersWithMeasurements} />

        <Tabs defaultValue="overall">
          <TabsList className="flex flex-col h-auto">
            <div>
              <TabsTrigger value="overall">Overall</TabsTrigger>
              <TabsTrigger value="horserace">Horserace</TabsTrigger>
              <TabsTrigger value="goals">Goals</TabsTrigger>
            </div>
            <div>
              {usersWithMeasurements.map((user) => (
                <TabsTrigger key={user.id} value={user.name}>
                  {user.name.slice(0, 2)}
                </TabsTrigger>
              ))}
            </div>
          </TabsList>
          <TabsContent value="overall">
            <OverallChart users={usersWithMeasurements} measurements={measurements} />
          </TabsContent>
          <TabsContent value="horserace">
            <HorseRaceChart users={usersWithMeasurements} />
          </TabsContent>
          <TabsContent value="goals">
            <GoalsChart users={usersWithMeasurements} measurements={measurements} />
          </TabsContent>
          {usersWithMeasurements.map((user) => (
            <TabsContent key={user.id} value={user.name}>
              <PersonChart user={user} />
            </TabsContent>
          ))}
        </Tabs>

        <AddMeasurementDialog users={allUsers} />
      </div>
    </div>
  );
}
