'use client';

import { useGame } from './game-provider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { Card } from '@/components/ui/card';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GripVertical, X, Plus, Trophy } from 'lucide-react';
import { DndContext, DragEndEvent, KeyboardSensor, MouseSensor, TouchSensor, closestCenter, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Player } from "../gameMachine";

function SortableItem({ player, index, actor }: { player: Player; index: number; actor: any }) {
  const { attributes, 
    listeners, 
    setNodeRef, 
    transform, 
    transition 
  } = useSortable({ id: player.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex items-center gap-2 bg-muted p-2 rounded-md"
    >
      <GripVertical 
      {...attributes}
      {...listeners} 
      className="w-4 h-4 text-muted-foreground cursor-move" 
      />
      <span className="flex-1">{player.name}</span>
      {index === 0 && <span className="text-xs text-muted-foreground">First dealer</span>}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => actor.send({ type: 'REMOVE_PLAYER', id: player.id })}
      >
        <X className="w-4 h-4" />
      </Button>
    </motion.div>
  );
}

export function SetupScreen() {
  const { useSelector, useActorRef } = useGame();
  const actor = useActorRef();
  const [newPlayerName, setNewPlayerName] = useState('');

  const mouseSensor = useSensor(MouseSensor);
  const touchSensor = useSensor(TouchSensor);
  const keyboardSensor = useSensor(KeyboardSensor);
  
  const sensors = useSensors(
    mouseSensor,
    touchSensor,
    keyboardSensor,
  );

  const players = useSelector((state) => state.context.players);
  const highestScoreWins = useSelector((state) => state.context.highestScoreWins);
  const blindMode = useSelector((state) => state.context.blindMode);

  const handleAddPlayer = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPlayerName.trim()) {
      actor.send({ type: 'ADD_PLAYER', name: newPlayerName.trim() });
      setNewPlayerName('');
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if(!over) return;

    if (active.id !== over.id) {
      const oldIndex = players.findIndex((player) => player.id === active.id);
      const newIndex = players.findIndex((player) => player.id === over.id);

      const newPlayers = arrayMove(players, oldIndex, newIndex);
      actor.send({ type: 'REORDER_PLAYERS', players: newPlayers });
    }
  };

  return (
    <div className="container max-w-2xl mx-auto p-4 space-y-8">
      <div className="text-center space-y-2">
        <Trophy className="w-12 h-12 mx-auto text-primary" />
        <h1 className="text-3xl font-bold">Card Game Scorer</h1>
        <p className="text-muted-foreground">Set up your game</p>
      </div>

      <Card className="p-6 space-y-6">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Players</h2>

          <form onSubmit={handleAddPlayer} className="flex gap-2">
            <Input
              placeholder="Enter player name"
              value={newPlayerName}
              onChange={(e) => setNewPlayerName(e.target.value)}
            />
            <Button type="submit">
              <Plus className="w-4 h-4 mr-2" />
              Add
            </Button>
          </form>

          {players.length > 0 && (<p className="text-muted-foreground">Player order determines dealing order</p>)}

          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={players}>
              <AnimatePresence>
                {players.map((player, index) => (
                  <SortableItem key={player.id} index={index} player={player} actor={actor} />
                ))}
              </AnimatePresence>
            </SortableContext>
          </DndContext>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Game Settings</h2>

          <div className="space-y-4">
            <div className="space-y-2">
              <label>Scoring Mode</label>
              <RadioGroup
                value={highestScoreWins ? 'highest' : 'lowest'}
                onValueChange={(value) =>
                  actor.send({
                    type: 'SET_GAME_MODE',
                    highestScoreWins: value === 'highest',
                  })
                }
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="highest" id="highest" />
                  <label htmlFor="highest">Highest Score Wins</label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="lowest" id="lowest" />
                  <label htmlFor="lowest">Lowest Score Wins</label>
                </div>
              </RadioGroup>
            </div>

            <div className="flex items-center justify-between">
              <label htmlFor="blind-mode">Blind Mode</label>
              <Switch
                id="blind-mode"
                checked={blindMode}
                onCheckedChange={(checked) =>
                  actor.send({ type: 'SET_BLIND_MODE', blindMode: checked })
                }
              />
            </div>
          </div>
        </div>

        <Button
          className="w-full"
          size="lg"
          disabled={players.length < 2}
          onClick={() => actor.send({ type: 'START_GAME' })}
        >
          Start Game
        </Button>
      </Card>
    </div>
  );
}
