"use client"

import { useMachine } from "@xstate/react"
import { Gamepad2, Recycle, XCircle } from "lucide-react"

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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { Player, cardGameMachine } from "./machine"

export default function Page() {
  const [state, send] = useMachine(cardGameMachine, {
    context: { players: [], rounds: 3 },
  })

  const { players, rounds, activeRound } = state.context

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
              <Button
                onClick={() => {
                  if (rounds > 0 && players.length > 0) {
                    send("Start game")
                  }
                }}
              >
                <Gamepad2 className="mr-2 h-4 w-4" /> Start spel
              </Button>
            </CardFooter>
          </Card>
        </>
      )}

      {state.matches("Playing") && (
        <>
          <div className="flex w-full justify-center font-extrabold mt-5">
            <h1>Ronde {activeRound}</h1>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ronde</TableHead>
                {players.map((player) => (
                  <TableHead key={player.id}>{player.name}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: rounds }).map((_, index) => (
                <TableRow>
                  <TableCell>{index + 1}</TableCell>
                  {players.map((player) => (
                    <TableCell key={player.id}>
                      {player.scores[index]?.score}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
              <TableRow>
                <TableCell>Nieuw </TableCell>
                {players.map((player) => (
                  <TableCell key={player.id}>
                    <form
                      onSubmit={(event) => {
                        event.preventDefault()
                        // @ts-ignore
                        const score = event.target.score.valueAsNumber
                        console.log("score:", score)
                        send({
                          type: "Add player score",
                          id: player.id,
                          score: isNaN(score) ? 0 : score,
                        })
                        // @ts-ignore
                        event.target.reset()
                      }}
                    >
                      <Input type="number" name="score" />
                    </form>
                  </TableCell>
                ))}
              </TableRow>
              <TableRow>
                <TableCell>Totaal</TableCell>
                {players.map((player) => (
                  <TableCell key={player.id}>{player.totalScore}</TableCell>
                ))}
              </TableRow>
            </TableBody>
          </Table>
          <div className="flex w-full justify-center mt-5">
            <Button onClick={() => send("Next round")}>
              <Gamepad2 className="mr-2 h-4 w-4" /> Volgende ronde!
            </Button>
          </div>
        </>
      )}

      {state.matches("Showing results") && (
        <Card className="m-5">
          <CardHeader>
            <CardTitle>Spel afgelopen!</CardTitle>
            <CardDescription>Dit zijn de eindresultaten</CardDescription>
          </CardHeader>
          <CardContent>
            <ol>
              {players.sort(
                (a, b) => b.totalScore - a.totalScore
              ).map((player) => (
                <li className="row my-5 flex w-full max-w-sm items-center justify-between rounded-md bg-slate-100 pl-5">
                  <span>{player.name}</span>
                  <span>{player.totalScore}</span>
                </li>
              ))}
            </ol>
          </CardContent>
          <CardFooter className="flex space-x-2">
            <Button onClick={() => send("Start new game")}>
              <Gamepad2 className="mr-2 h-4 w-4" /> Nieuw spel
            </Button>
            <Button onClick={() => send("Restart game")}>
              <Recycle className="mr-2 h-4 w-4" /> Nog een keer
            </Button>
          </CardFooter>
        </Card>
      )}
    </>
  )
}
