import { Gamepad2, Recycle } from "lucide-react"

import { Player } from "@/app/card-game/machine"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card"
import { Button } from "../ui/button"

interface Props {
  players: Player[]
  startNewGame: () => void
  restartGame: () => void
}

export const Highscores = ({ players, startNewGame, restartGame }: Props) => {
  return (
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
        <Button onClick={startNewGame}>
          <Gamepad2 className="mr-2 h-4 w-4" /> Nieuw spel
        </Button>
        <Button onClick={restartGame}>
          <Recycle className="mr-2 h-4 w-4" /> Nog een keer
        </Button>
      </CardFooter>
    </Card>
  )
}
