import { assign, createMachine } from "xstate"
import { nanoid } from 'nanoid'

interface Score {
  id: string
  score: number
}

export interface Player {
  id: string
  name: string
  scores: Score[]
  totalScore: number
}

interface Schema {
  context: { players: Player[]; activeRound: number, rounds: number },
  events:
  | { type: "Start game" }
  | { type: "Start new game" }
  | { type: "Restart game" }
  | { type: "Add player score", id: string, score: number }
  | { type: "Add player", name: string }
  | { type: "Remove player score", id: string, scoreId: string, score: number }
  | { type: "Edit player score", id: string, scoreId: string, score: number }
  | { type: "Remove player", id: string }
  | { type: "Edit player", id: string, name: string }
  | { type: "Update rounds", rounds: number }
  | { type: "Next round" }
}


export const cardGameMachine = createMachine({
  id: "Card game score machine",
  initial: "Setting up game",
  tsTypes: {} as import("./machine.typegen").Typegen0,
  schema: {} as Schema,
  context: {
    players: [],
    activeRound: 0,
    rounds: 0,
  },
  predictableActionArguments: true,
  preserveActionOrder: true,
  states: {
    "Setting up game": {
      on: {
        "Start game": {
          target: "Playing",
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
      },
    },
    Playing: {
      always: {
        target: "Showing results",
        cond: "Game done",
      },
      on: {
        "Add player score": {
          actions: "Add score to player",
        },
        "Remove player score": {
          actions: "Remove score of player",
        },
        "Edit player score": {
          actions: "Edit score of player",
        },
        "Next round": {
          actions: "Increment active round",
        },
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
    "Add score to player": assign({
      players: (context, event) => {
        const updatedPlayers = context.players.map(player => {
          if (player.id === event.id) {
            const newScore = {
              id: nanoid(),
              score: event.score
            }
            return { ...player, scores: [...player.scores, newScore], totalScore: player.totalScore + event.score }
          }
          return player
        })
        return updatedPlayers
      }
    }),
    "Edit score of player": assign({
      players: (context, event) => {
        const updatedPlayers = context.players.map(player => {
          if (player.id === event.id) {
            const updatedScores = player.scores.map(score => {
              if (score.id === event.scoreId) {
                return { ...score, score: event.score }
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
    "Remove score of player": assign({
      players: (context, event) => {
        const updatedPlayers = context.players.map(player => {
          if (player.id === event.id) {
            const updatedScores = player.scores.filter(score => score.id !== event.scoreId)
            return { ...player, scores: updatedScores, totalScore: player.totalScore - event.score }
          }
          return player
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
      rounds: (context, event) => {
        return event.rounds
      }
    }),
    "Increment active round": assign({
      activeRound: (context) => {
        return context.activeRound + 1
      }
    }),
  },
  guards: {
    "Game done": (context) => {
      const activeRound = context.activeRound
      const rounds = context.rounds
      return activeRound >= rounds
    }
  }
});
