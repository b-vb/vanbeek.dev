"use client"

import { useState } from "react"
import { useMachine } from "@xstate/react"
import { Edit, Gamepad2, Joystick, Recycle, Save, XCircle } from "lucide-react"

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
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { Score, cardGameMachine } from "./machine"

const ScoreCell = ({
  score,
  updateScore,
}: {
  score: Score
  updateScore: (scoreId: string, score: number) => void
}) => {
  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newScore = event.target.valueAsNumber
    updateScore(score.id, newScore)
  }

  return (
    <div className="flex w-full max-w-sm items-center space-x-2">
      <Input
        type="number"
        name="score"
        value={score.value}
        onChange={onChange}
      />
    </div>
  )
}

export default function Page() {
  const [state, send] = useMachine(cardGameMachine, {
    context: { players: [], rounds: 5 },
  })

  const { players, rounds, activeRound, setRounds } = state.context

  return (
    <>
      {state.matches("Setting up game") && (
        <>
          <Card className="m-5 max-w-sm">
            <CardHeader>
              <CardTitle>Kaartspel spelen!</CardTitle>
              <CardDescription>
                We kunnen bijna beginnen, eerst nog even wat gegevens
              </CardDescription>
            </CardHeader>
            <CardContent>
              <h2 className="font-semibold mb-3">Spelers</h2>
              <ul>
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
                      <Input type="text" name="playerName" autoComplete="off" placeholder="Speler 1" />
                      <Button variant="secondary">Toevoegen</Button>
                    </div>
                  </form>
                </li>
                {players.map((player) => (
                  <li
                    key={player.id}
                    className="row my-5 flex w-full max-w-sm items-center justify-between rounded-md bg-slate-100 pl-5"
                  >
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
              </ul>

              <h2 className="mt-5 font-semibold mb-3">Rondes</h2>
              <div className="flex items-center space-x-2">
                <Switch
                  id="setRounds"
                  checked={setRounds}
                  onCheckedChange={() => send("Toggle rounds")}
                />
                <Label htmlFor="setRounds">Vast aantal rondes</Label>
              </div>

              {setRounds && (
                <Input
                  className="mt-3"
                  type="number"
                  name="rounds"
                  value={rounds}
                  onChange={(event) => {
                    const rounds = event.target.valueAsNumber

                    send({
                      type: "Update rounds",
                      rounds: isNaN(rounds) ? undefined : rounds,
                    })
                  }}
                />
              )}
            </CardContent>
            <CardFooter>
              <Button
                onClick={() => {
                  if (rounds && rounds > 0 && players.length > 0) {
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
            <h1 className="text-2xl">Huidige ronde: {activeRound}</h1>
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
              {Array.from({ length: rounds || 0 }).map((_, index) => (
                <TableRow key={index} className={activeRound === index + 1 && "bg-green-600"} >
                  <TableCell>{index + 1}</TableCell>
                  {players.map((player) => (
                    <TableCell key={player.id}>
                      <ScoreCell
                        score={player.scores[index]}
                        updateScore={(scoreId: string, score: number) =>
                          send({
                            type: "Update player score",
                            id: player.id,
                            scoreId,
                            score: isNaN(score) ? 0 : score,
                          })
                        }
                      />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
              <TableRow>
                <TableCell>Totaal</TableCell>
                {players.map((player) => (
                  <TableCell key={player.id}>{player.totalScore}</TableCell>
                ))}
              </TableRow>
            </TableBody>
          </Table>
          <div className="flex w-full m-5 space-x-5">
            <Button onClick={() => send("Next round")}>
              <Gamepad2 className="mr-2 h-4 w-4" /> Volgende ronde!
            </Button>
            {!setRounds && (
              <Button onClick={() => send("Next round")}>
                <Joystick className="mr-2 h-4 w-4" /> Spel is klaar!
              </Button>
            )}
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
              {players
                .sort((a, b) => b.totalScore - a.totalScore)
                .map((player) => (
                  <li
                    key={player.id}
                    className="row my-5 flex w-full max-w-sm items-center justify-evenly rounded-md bg-slate-100 pl-5"
                  >
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
