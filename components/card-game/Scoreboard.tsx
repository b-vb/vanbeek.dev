import { Gamepad2, Joystick } from "lucide-react"

import { Player } from "@/app/card-game/machine"

import { Button } from "../ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table"
import { ScoreCell } from "./ScoreCell"

interface Props {
  players: Player[]
  activeRound: number
  rounds?: number
  setRounds: boolean
  updateScore: (id: string, scoreId: string, score: number) => void
  nextRound: () => void
}

export const Scoreboard = ({
  players,
  activeRound,
  rounds,
  setRounds,
  updateScore,
  nextRound,
}: Props) => {
  return (
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
            <TableRow
              key={index}
              className={activeRound === index + 1 ? "bg-green-600" : ""}
            >
              <TableCell>{index + 1}</TableCell>
              {players.map((player) => (
                <TableCell key={player.id}>
                  <ScoreCell
                    score={player.scores[index]}
                    updateScore={(scoreId: string, score: number) =>
                      updateScore(player.id, scoreId, score)
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
        <Button onClick={() => nextRound()}>
          <Gamepad2 className="mr-2 h-4 w-4" /> Volgende ronde!
        </Button>
        {!setRounds && (
          <Button onClick={() => nextRound()}>
            <Joystick className="mr-2 h-4 w-4" /> Spel is klaar!
          </Button>
        )}
      </div>
    </>
  )
}
