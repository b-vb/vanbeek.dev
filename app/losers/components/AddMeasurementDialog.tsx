'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent, DialogDescription, DialogHeader, DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import { UserWithMeasurements } from '@/prisma/db';
import AddMeasurementForm from './AddMeasurementForm';

export default function AddMeasurementDialog({ users }: { users: UserWithMeasurements[] }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="self-end">Add measurement</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add a measurement</DialogTitle>
          <DialogDescription>
            This will be stored when you click the save button
          </DialogDescription>
        </DialogHeader>
        <AddMeasurementForm users={users} />
      </DialogContent>
    </Dialog>
  );
}
