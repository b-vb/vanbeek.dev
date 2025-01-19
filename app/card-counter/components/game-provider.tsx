'use client';

import { createActorContext } from '@xstate/react';
import { gameMachine } from '../gameMachine';

export const GameContext = createActorContext(gameMachine);

export function useGame() {
  return GameContext;
}