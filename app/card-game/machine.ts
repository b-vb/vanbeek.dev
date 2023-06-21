import { assign, createMachine } from "xstate"
import { nanoid } from 'nanoid'

export interface Score {
  id: string
  value?: number
}

export interface Player {
  id: string
  name: string
  scores: Score[]
  totalScore: number
}

interface Schema {
  context: {
    players: Player[];
    activeRound: number;
    rounds?: number;
    setRounds: boolean
  },
  events:
  | { type: "Start game" }
  | { type: "Toggle rounds" }
  | { type: "Start new game" }
  | { type: "Restart game" }
  | { type: "Add player", name: string }
  | { type: "Update player score", id: string, scoreId: string, score: number }
  | { type: "Remove player", id: string }
  | { type: "Edit player", id: string, name: string }
  | { type: "Update rounds", rounds?: number }
  | { type: "Next round" }
  | { type: "Finish game" }
}


export const cardGameMachine = createMachine({
  id: "Card game score machine",
  initial: "Setting up game",
  tsTypes: {} as import("./machine.typegen").Typegen0,
  schema: {} as Schema,
  context: {
    players: [],
    activeRound: 1,
    rounds: 0,
    setRounds: false
  },
  predictableActionArguments: true,
  preserveActionOrder: true,
  states: {
    "Setting up game": {
      on: {
        "Start game": {
          target: "Playing",
          actions: "Add blank scores",
        },
        "Add player": {
          actions: "Add player",
        },
        "Remove player": {
          actions: "Remove player",
        },
        "Edit player": {
          actions: "Edit player",
        },
        "Update rounds": {
          actions: "Update rounds",
        },
        "Toggle rounds": {
          actions: "Toggle rounds",
        }
      },
    },
    Playing: {
      always: {
        target: "Showing results",
        cond: "Game over when set rounds are played"
      },
      on: {
        "Update player score": {
          actions: [
            "Edit score of player",
            "Update player total score"
          ],
        },
        "Next round": {
          actions: "Increment active round",
        },
        "Finish game": {
          target: "Showing results",
        }
      },
    },
    "Showing results": {
      on: {
        "Start new game": {
          target: "Setting up game",
          actions: "Reset game"
        },
        "Restart game": {
          target: "Playing",
          actions: "Clear all player scores",
        },
      },
    },
  },
}, {
  actions: {
    "Add blank scores": assign({
      players: (context) => {
        const players = context.players.map(player => {
          const scores = Array.from({ length: context.rounds || 0 }, () => {
            return {
              id: nanoid(),
              value: undefined
            }
          })
          return { ...player, scores }
        })
        return players
      }
    }),
    "Add player": assign({
      players: (context, event) => {
        const newPlayer = {
          id: nanoid(),
          name: event.name,
          scores: [],
          totalScore: 0
        }
        return [...context.players, newPlayer]
      }
    }),
    "Edit player": assign({
      players: (context, event) => {
        const updatedPlayers = context.players.map(player => {
          if (player.id === event.id) {
            return { ...player, name: event.name }
          }
          return player
        })
        return updatedPlayers
      }
    }),
    "Remove player": assign({
      players: (context, event) => {
        const updatedPlayers = context.players.filter(player => player.id !== event.id)
        return updatedPlayers
      }
    }),
    "Edit score of player": assign({
      players: (context, event) => {
        const updatedPlayers = context.players.map(player => {
          if (player.id === event.id) {
            const updatedScores = player.scores.map(score => {
              if (score.id === event.scoreId) {
                return { ...score, value: event.score }
              }
              return score
            })
            return { ...player, scores: updatedScores }
          }
          return player
        })
        return updatedPlayers
      }
    }),
    "Update player total score": assign({
      players: (context) => {
        const updatedPlayers = context.players.map(player => {
          const totalScore = player.scores.reduce((acc, score) => {
            if (score.value) {
              return acc + score.value
            }
            return acc
          }, 0)
          return { ...player, totalScore }
        })
        return updatedPlayers
      }
    }),
    "Clear all player scores": assign({
      players: (context) => {
        const updatedPlayers = context.players.map(player => {
          return { ...player, scores: [], totalScore: 0 }
        })
        return updatedPlayers
      },
      activeRound: 0
    }),
    "Reset game": assign({
      players: [],
      rounds: 0,
      activeRound: 0
    }),
    "Update rounds": assign({
      rounds: (_, event) => {
        return event.rounds
      }
    }),
    "Increment active round": assign({
      activeRound: (context) => {
        return context.activeRound + 1
      }
    }),
    "Toggle rounds": assign({
      setRounds: (context) => {
        return !context.setRounds
      }
    })
  },
  guards: {
    "Game over when set rounds are played": (context) => {
      console.log('context:', context);
      return context.activeRound === context.rounds
    }
  }
});
