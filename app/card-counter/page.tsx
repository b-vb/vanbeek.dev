'use client';

import { GameContext, useGame } from './components/game-provider';
import { SetupScreen } from './components/setup-screen';
import { GameScreen } from './components/game-screen';
import { ResultsScreen } from './components/results-screen';

function GameStateRouter() {
  const { useSelector } = useGame();
  const state = useSelector((state) => state.value);

  switch (state) {
    case 'playing':
    case 'scoreEntry':
      return <GameScreen />;
    case 'gameOver':
      return <ResultsScreen />;
    case 'setup':
    default:
      return <SetupScreen />;
  }
}

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <GameContext.Provider>
        <GameStateRouter />
      </GameContext.Provider>
    </main>
  );
}
