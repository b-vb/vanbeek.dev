'use client';

import { useState } from 'react';
import { useGame } from './game-provider';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ScoreEntryModalProps {
  open: boolean;
  onClose: (open: boolean) => void;
}

export function ScoreEntryModal({ open, onClose }: ScoreEntryModalProps) {
  const { useSelector, useActorRef } = useGame();
  const actor = useActorRef();
  const players = useSelector((state) => state.context.players);
  const [scores, setScores] = useState<number[]>(
    new Array(players.length).fill(0)
  );

  const handleScoreChange = (index: number, value: string) => {
    const newScores = [...scores];
    newScores[index] = value === '' ? 0 : parseInt(value, 10);
    setScores(newScores);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('scores:', scores)
    actor.send({ type: 'CONFIRM_SCORES', scores });
    onClose(false);
    setScores(new Array(players.length).fill(0));
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Enter Round Scores</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {players.map((player, index) => (
            <div key={player.id} className="space-y-2">
              <label htmlFor={`score-${player.id}`}>{player.name}</label>
              <Input
                id={`score-${player.id}`}
                type="number"
                value={scores[index] || ''}
                onChange={(e) => handleScoreChange(index, e.target.value)}
                placeholder="0"
                autoFocus={index === 0}
              />
            </div>
          ))}
          <div className="flex gap-2 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => onClose(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Confirm Scores</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}