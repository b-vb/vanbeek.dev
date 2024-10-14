'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent, DialogDescription, DialogHeader, DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import { UserWithMeasurements } from '@/prisma/db';
import { useState } from 'react';
import AddMeasurementForm from './AddMeasurementForm';

export default function AddMeasurementDialog({ users }: { users: UserWithMeasurements[] }) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
        <AddMeasurementForm users={users} closeDialog={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
