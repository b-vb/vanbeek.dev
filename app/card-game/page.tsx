"use client"

import { useMachine } from "@xstate/react"

import { cardGameMachine } from "./machine"
import { SetupScreen } from "@/components/card-game/SetupScreen"
import { Scoreboard } from "@/components/card-game/Scoreboard"
import { Highscores } from "@/components/card-game/Highscores"

export default function Page() {
  const [state, send] = useMachine(cardGameMachine, {
    context: { players: [], rounds: 5 },
  })

  const { players, rounds, activeRound, setRounds } = state.context

  return (
    <>
      {state.matches("Setting up game") && (
        <SetupScreen
          players={players}
          rounds={rounds}
          setRounds={setRounds}
          addPlayer={(name) => send({ type: "Add player", name })}
          removePlayer={(id) => send({ type: "Remove player", id })}
          toggleRounds={() => send("Toggle rounds")}
          updateRounds={(rounds) => send({ type: "Update rounds", rounds })}
          startGame={() => send("Start game")}
        />
      )}

      {state.matches("Playing") && (
        <Scoreboard
          players={players}
          activeRound={activeRound}
          rounds={rounds}
          setRounds={setRounds}
          updateScore={(id, scoreId, score) =>
            send({ type: "Update player score", id, scoreId, score })
          }
          nextRound={() => send("Next round")}
        />
      )}

      {state.matches("Showing results") && (
        <Highscores
          players={players}
          startNewGame={() => send("Start new game")}
          restartGame={() => send("Restart game")}
        />
      )}
    </>
  )
}
