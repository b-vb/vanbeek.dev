/* eslint-disable jsx-a11y/label-has-associated-control */

'use client';

import { useState, useEffect } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Plus, Minus, CalendarIcon, LoaderCircle,
} from 'lucide-react';
import { cn, formatDate } from '@/lib/utils';
import { addMeasurement, FormState } from '@/app/actions';
import { UserWithMeasurements } from '@/prisma/db';

type Props = {
  users: UserWithMeasurements[];
  closeDialog: () => void;
};

const getCurrentWeight = (userId: string, users: UserWithMeasurements[]): number | undefined => {
  const user = users.find(({ id }) => id === userId);
  return user && user.measurements.length > 0 ? user.measurements[user.measurements.length - 1].weight : undefined;
};

function Submit() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit">
      {pending && <LoaderCircle className="animate-spin h-5 w-5 mr-2" />}
      {`Sav${pending ? 'ing..' : 'e'}`}
    </Button>
  );
}

export default function AddMeasurement({ users, closeDialog }: Props) {
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [weight, setWeight] = useState<number>(0);
  const [lastWeight, setLastWeight] = useState<number>(0);
  const [measureDate, setMeasureDate] = useState<Date | undefined>(new Date());
  // @ts-ignore -- React 19 feature
  const [state, formAction] = useFormState<FormState>(addMeasurement, { error: null, status: 'initial' });

  useEffect(() => {
    if (selectedUserId) {
      const currentWeight = getCurrentWeight(selectedUserId, users);
      if (currentWeight) {
        setWeight(currentWeight);
        setLastWeight(currentWeight);
      }
    }
  }, [selectedUserId, users]);

  useEffect(() => {
    if (state.status === 'success') {
      closeDialog();
    }
  }, [state.status, closeDialog]);

  const adjustWeight = (amount: number) => {
    setWeight((prevWeight) => Math.max(0, prevWeight + amount));
  };

  const weightChange = weight - lastWeight;
  const weightChangeText = weightChange !== 0
    ? `(${weightChange > 0 ? '+' : ''}${weightChange}g)`
    : '';

  return (
    <>
      <form action={formAction}>
        <div className="space-y-6">
          <div>
            <label htmlFor="userId" className="block text-sm font-medium mb-2">Select a user</label>
            <Select name="userId" value={selectedUserId} onValueChange={setSelectedUserId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a user" />
              </SelectTrigger>
              <SelectContent>
                {users.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedUserId && (
            <>
              <div>
                <label htmlFor="weight" className="block text-sm font-medium mb-2">
                  Weight (grams)
                  {lastWeight !== 0 && (                  <span className={cn('ml-2', {
                    'text-green-500': weightChange < 0,
                    'text-red-500': weightChange > 0,
                  })}
                  >
                    {weightChangeText}
                  </span>)}
                </label>
                <div className="flex items-center space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    onClick={() => adjustWeight(-100)}
                    aria-label="Decrease weight"
                  >
                    <Minus className="h-5 w-5" />
                  </Button>
                  <Input
                    id="weight"
                    name="weight"
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(Number(e.target.value))}
                    className="text-center"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    onClick={() => adjustWeight(100)}
                    aria-label="Increase weight"
                  >
                    <Plus className="h-5 w-5" />
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground mt-2">The weight should be in grams.</p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Measure date</label>
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

              <div className="flex justify-between">
                <Button type="button" variant="outline" onClick={() => setSelectedUserId('')}>Back</Button>
                <Submit />
              </div>
            </>
          )}
        </div>
      </form>

      {state.status === 'error' && <p className="mt-4 text-red-600">{state.error}</p>}
    </>
  );
}
