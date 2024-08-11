/* eslint-disable jsx-a11y/label-has-associated-control */
import { addMeasurement } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { DialogClose, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { cn, formatDate } from '@/lib/utils';
import { UserWithMeasurements } from '@/prisma/db';
import { CalendarIcon } from 'lucide-react';
import { useState } from 'react';
import { useFormState } from 'react-dom';

const initialState = {
  message: '',
};

type Props = {
  users: UserWithMeasurements[];
};

export default function AddMeasurementForm({ users }: Props) {
  // @ts-expect-error -- TODO: Fix this
  const [, formAction] = useFormState(addMeasurement, initialState);
  const [measureDate, setMeasureDate] = useState<Date | undefined>(undefined);

  return (
    <form action={formAction} className="space-y-6">
      <div className="flex flex-col">
        <label htmlFor="measure-date">Measure date</label>
        <Select name="user">
          <SelectTrigger>
            <SelectValue placeholder="Select a user" />
          </SelectTrigger>
          <SelectContent>
            {users.map((user) => (
              <SelectItem key={user.id} value={user.id}>{user.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <label htmlFor="weight">New weight</label>
        <Input name="weight" type="number" placeholder="82.5" step="0.1" />
        <div>
          The weight should be in kilograms (kg).
        </div>
      </div>
      <div className="flex flex-col">
        <label>Measure date</label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn('w-[240px] pl-3 text-left font-normal')}
            >
              {measureDate ? (
                formatDate(measureDate)
              ) : (
                <span>Pick a date</span>
              )}
              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
              selected={measureDate}
              onSelect={(date) => setMeasureDate(date)}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        <input type="hidden" name="date" value={measureDate?.toISOString()} />
      </div>

      <DialogFooter className="sm:justify-between">
        <DialogClose asChild>
          <Button type="button" variant="secondary">
            Close
          </Button>
        </DialogClose>
        <DialogClose asChild>
          <Button type="submit" variant="default">
            Save
          </Button>
        </DialogClose>
      </DialogFooter>
    </form>
  );
}
