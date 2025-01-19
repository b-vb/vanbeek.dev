import { setup, assign } from 'xstate';
import { nanoid } from 'nanoid';

export interface Player {
  id: string;
  name: string;
  scores: number[];
  total: number;
}

export interface GameContext {
  players: Player[];
  currentRound: number;
  currentDealer: number;
  highestScoreWins: boolean;
  blindMode: boolean;
}

const initialContext: GameContext = {
  players: [],
  currentRound: 1,
  currentDealer: 0,
  highestScoreWins: true,
  blindMode: false,
};

export const gameMachine = setup({
  types: {
    context: {} as GameContext,
    events: {} as
      | { type: 'ADD_PLAYER'; name: string }
      | { type: 'REMOVE_PLAYER'; id: string }
      | { type: 'REORDER_PLAYERS'; players: Player[] }
      | { type: 'SET_GAME_MODE'; highestScoreWins: boolean }
      | { type: 'SET_BLIND_MODE'; blindMode: boolean }
      | { type: 'START_GAME' }
      | { type: 'ENTER_SCORES' }
      | { type: 'END_GAME' }
      | { type: 'CONFIRM_SCORES'; scores: number[] }
      | { type: 'CANCEL_SCORE_ENTRY' }
      | { type: 'NEW_GAME_SAME_PLAYERS' }
      | { type: 'START_OVER' },
  },
  actions: {
    addPlayer: assign(({ context, event }) => {
      if (event.type !== 'ADD_PLAYER') return context;
      return {
        ...context,
        players: [
          ...context.players,
          {
            id: nanoid(),
            name: event.name,
            scores: [],
            total: 0,
          },
        ],
      };
    }),
    removePlayer: assign(({ context, event }) => {
      if (event.type !== 'REMOVE_PLAYER') return context;
      return {
        ...context,
        players: context.players.filter((p) => p.id !== event.id),
      };
    }),
    reorderPlayers: assign(({ context, event }) => {
      if (event.type !== 'REORDER_PLAYERS') return context;
      return {
        ...context,
        players: event.players,
      };
    }),
    setGameMode: assign(({ context, event }) => {
      if (event.type !== 'SET_GAME_MODE') return context;
      return {
        ...context,
        highestScoreWins: event.highestScoreWins,
      };
    }),
    setBlindMode: assign(({ context, event }) => {
      if (event.type !== 'SET_BLIND_MODE') return context;
      return {
        ...context,
        blindMode: event.blindMode,
      };
    }),
    updateScores: assign(({ context, event }) => {
      if (event.type !== 'CONFIRM_SCORES') return context;
      return {
        ...context,
        players: context.players.map((player, index) => ({
          ...player,
          scores: [...player.scores, event.scores[index]],
          total: player.total + event.scores[index],
        })),
        currentRound: context.currentRound + 1,
        currentDealer: (context.currentDealer + 1) % context.players.length,
      };
    }),
    resetGame: assign(({ context }) => ({
      ...context,
      currentRound: 1,
      currentDealer: 0,
      players: context.players.map((player) => ({
        ...player,
        scores: [],
        total: 0,
      })),
    })),
    startOver: assign(() => initialContext),
  },
  guards: {
    hasEnoughPlayers: ({ context }) => context.players.length >= 2,
  },
}).createMachine({
  id: 'cardGame',
  initial: 'setup',
  context: initialContext,
  states: {
    setup: {
      on: {
        ADD_PLAYER: {
          actions: 'addPlayer',
        },
        REMOVE_PLAYER: {
          actions: 'removePlayer',
        },
        REORDER_PLAYERS: {
          actions: 'reorderPlayers',
        },
        SET_GAME_MODE: {
          actions: 'setGameMode',
        },
        SET_BLIND_MODE: {
          actions: 'setBlindMode',
        },
        START_GAME: {
          guard: 'hasEnoughPlayers',
          target: 'playing',
        },
      },
    },
    playing: {
      on: {
        ENTER_SCORES: 'scoreEntry',
        END_GAME: 'gameOver',
      },
    },
    scoreEntry: {
      on: {
        CONFIRM_SCORES: {
          target: 'playing',
          actions: 'updateScores',
        },
        CANCEL_SCORE_ENTRY: 'playing',
      },
    },
    gameOver: {
      on: {
        NEW_GAME_SAME_PLAYERS: {
          target: 'playing',
          actions: 'resetGame',
        },
        START_OVER: {
          target: 'setup',
          actions: 'startOver',
        },
      },
    },
  },
});