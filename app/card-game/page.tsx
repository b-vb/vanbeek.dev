"use client"

import { useMachine } from "@xstate/react"
import { Gamepad2, XCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"

import { Player, cardGameMachine } from "./machine"

const defaultPlayers: Player[] = [
  {
    id: "3452",
    name: "Marjo",
    scores: [
      { id: "235423145", score: 10 },
      { id: "235423145", score: 10 },
      { id: "235423145", score: 10 },
    ],
    totalScore: 30,
  },
  {
    id: "3422",
    name: "Bjorn",
    scores: [
      { id: "665544", score: 10 },
      { id: "37895", score: 10 },
      { id: "5273", score: 20 },
    ],
    totalScore: 40,
  },
]

export default function Page() {
  const [state, send] = useMachine(cardGameMachine, {
    context: { players: defaultPlayers, rounds: 3 },
  })

  const { players, rounds } = state.context

  return (
    <>
      {state.matches("Setting up game") && (
        <>
          <Card className="m-5">
            <CardHeader>
              <CardTitle>Kaartspel spelen!</CardTitle>
              <CardDescription>
                We kunnen bijna beginnen, eerst nog even wat gegevens
              </CardDescription>
            </CardHeader>
            <CardContent>
              <h2 className="font-semibold">Spelers</h2>
              <ul>
                {players.map((player) => (
                  <li className="row my-5 flex w-full max-w-sm items-center justify-between rounded-md bg-slate-100 pl-5">
                    <span>{player.name}</span>
                    <Button
                      variant="secondary"
                      onClick={() =>
                        send({ type: "Remove player", id: player.id })
                      }
                    >
                      <XCircle className="h-4 w-4" />
                    </Button>
                  </li>
                ))}
                <li>
                  <form
                    onSubmit={(event) => {
                      event.preventDefault()
                      // @ts-ignore
                      const playerName = event.target.playerName.value
                      send({ type: "Add player", name: playerName })
                      // @ts-ignore
                      event.target.reset()
                    }}
                  >
                    <div className="flex w-full max-w-sm items-center space-x-2">
                      <Input type="text" name="playerName" />
                      <Button variant="secondary">Toevoegen</Button>
                    </div>
                  </form>
                </li>
              </ul>

              <h2 className="mt-5 font-semibold">Rondes</h2>
              <Input
                type="number"
                name="rounds"
                onChange={(event) => {
                  const rounds = event.target.valueAsNumber
                  send({
                    type: "Update rounds",
                    rounds: isNaN(rounds) ? 0 : rounds,
                  })
                }}
              />
            </CardContent>
            <CardFooter>
              <Button onClick={() => send("Start game")}>
                <Gamepad2 className="mr-2 h-4 w-4" /> Start spel
              </Button>
            </CardFooter>
          </Card>
        </>
      )}

      {state.matches("Playing") && (
        <>
          <table>
            <thead>
              <tr>
                <td></td>
                {players.map((player) => (
                  <td>{player.name}</td>
                ))}
              </tr>
            </thead>
            <tbody>
              {players[0].scores.map((_, index) => (
                <tr>
                  <td>Score</td>
                  {players.map((player) => (
                    <td>{player.scores[index].score}</td>
                  ))}
                </tr>
              ))}
              <tr>
                <td>Nieuwe score: </td>
                {players.map((player) => (
                  <td>
                    <form onSubmit={(event) => onSubmit(event, player)}>
                      <Input type="number" name="addedScore" />
                      <Button>+</Button>
                    </form>
                  </td>
                ))}
              </tr>
              <tr>
                <td>Stand</td>
                {players.map((player) => (
                  <td>{player.sum}</td>
                ))}
              </tr>
            </tbody>
          </table>
        </>
      )}
    </>
  )
}
