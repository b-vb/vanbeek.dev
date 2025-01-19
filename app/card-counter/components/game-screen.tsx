'use client';

import { useGame } from './game-provider';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, User, ChevronRight } from 'lucide-react';
import { ScoreEntryModal } from './score-entry-modal';
import { cn } from "@/lib/utils";

export function GameScreen() {
  const { useSelector, useActorRef } = useGame();
  const actor = useActorRef();

  const players = useSelector((state) => state.context.players);
  const currentRound = useSelector((state) => state.context.currentRound);
  const currentDealer = useSelector((state) => state.context.currentDealer);
  const blindMode = useSelector((state) => state.context.blindMode);
  const showScoreEntry = useSelector((state) => state.matches('scoreEntry'));

  return (
    <div className="container max-w-2xl mx-auto p-4 space-y-8">
      <div className="text-center space-y-2">
        <Trophy className="w-12 h-12 mx-auto text-primary" />
        <h1 className="text-3xl font-bold">Round {currentRound}</h1>
        <p className="text-muted-foreground">
          Current Dealer: {players[currentDealer]?.name}
        </p>
      </div>

      <Card className="p-6">
        <div className="space-y-4">
          <AnimatePresence>
            {players.map((player, index) => (
              <motion.div
                key={player.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`flex items-center gap-4 p-4 rounded-lg ${
                  index === currentDealer ? 'bg-primary/5' : 'bg-muted'
                }`}
              >
                <div className="flex items-center gap-3 flex-1">
                  <User
                    className={`w-5 h-5 ${
                      index === currentDealer
                        ? 'text-primary'
                        : 'text-muted-foreground'
                    }`}
                  />
                  <span className="font-medium">{player.name}</span>
                </div>

                <div className="relative">
                  <div className={cn({ 'blur-md': blindMode }, 'text-right')}>
                    <div className="text-2xl font-bold">{player.total}</div>
                    <div className="text-sm text-muted-foreground">
                      {player.scores.length > 0
                        ? `Last: ${player.scores[player.scores.length - 1]}`
                        : 'No scores'}
                    </div>
                  </div>
                  {blindMode && (                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-gray-800">Hidden</span>
                  </div>)}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        <Button
          className="flex-1"
          size="lg"
          onClick={() => actor.send({ type: 'ENTER_SCORES' })}
        >
          Enter Scores
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
        <Button
          variant="outline"
          size="lg"
          onClick={() => actor.send({ type: 'END_GAME' })}
        >
          End Game
        </Button>
      </div>

      <ScoreEntryModal 
        open={showScoreEntry}
         onClose={() => actor.send({ type: 'CANCEL_SCORE_ENTRY'})}
          />
    </div>
  );
}