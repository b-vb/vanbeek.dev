'use client';

import { useGame } from './game-provider';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Trophy, Medal, Award } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useEffect } from 'react';

export function ResultsScreen() {
  const { useSelector, useActorRef } = useGame();
  const actor = useActorRef();
  const players = useSelector((state) => state.context.players);
  const highestScoreWins = useSelector(
    (state) => state.context.highestScoreWins
  );

  const sortedPlayers = [...players].sort((a, b) => {
    return highestScoreWins ? b.total - a.total : a.total - b.total;
  });

  useEffect(() => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  }, []);

  const getPositionIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Trophy className="w-8 h-8 text-yellow-500" />;
      case 1:
        return <Medal className="w-8 h-8 text-gray-400" />;
      case 2:
        return <Award className="w-8 h-8 text-amber-700" />;
      default:
        return null;
    }
  };

  return (
    <div className="container max-w-2xl mx-auto p-4 space-y-8">
      <div className="text-center space-y-2">
        <Trophy className="w-16 h-16 mx-auto text-yellow-500" />
        <h1 className="text-3xl font-bold">Game Over!</h1>
        <p className="text-muted-foreground">
          {highestScoreWins ? 'Highest' : 'Lowest'} score wins
        </p>
      </div>

      <div className="space-y-4">
        {sortedPlayers.map((player, index) => (
          <motion.div
            key={player.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 }}
          >
            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-8">{getPositionIcon(index)}</div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{player.name}</h3>
                  <div className="text-sm text-muted-foreground">
                    {player.scores.join(' → ')}
                  </div>
                </div>
                <div className="text-2xl font-bold">{player.total}</div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Button
          size="lg"
          onClick={() => actor.send({ type: 'NEW_GAME_SAME_PLAYERS' })}
        >
          Replay
        </Button>
        <Button
          variant="outline"
          size="lg"
          onClick={() => actor.send({ type: 'START_OVER' })}
        >
          Start Over
        </Button>
      </div>
    </div>
  );
}
