import { Gamepad2, XCircle } from "lucide-react"

import { Player } from "@/app/card-game/machine"

import { Button } from "../ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Switch } from "../ui/switch"

interface Props {
  players: Player[]
  rounds?: number
  addPlayer: (name: string) => void
  removePlayer: (id: string) => void
  toggleRounds: () => void
  updateRounds: (rounds?: number) => void
  setRounds: boolean
  startGame: () => void
}

export const SetupScreen = ({
  players,
  rounds,
  addPlayer,
  removePlayer,
  setRounds,
  toggleRounds,
  updateRounds,
  startGame,
}: Props) => {
  return (
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

                addPlayer(playerName)
                // @ts-ignore
                event.target.reset()
              }}
            >
              <div className="flex w-full max-w-sm items-center space-x-2">
                <Input
                  type="text"
                  name="playerName"
                  autoComplete="off"
                  placeholder="Speler 1"
                />
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
                onClick={() => removePlayer(player.id)}
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
            onCheckedChange={toggleRounds}
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
              updateRounds(isNaN(rounds) ? undefined : rounds)
            }}
          />
        )}
      </CardContent>
      <CardFooter>
        <Button
          onClick={() => {
            if (rounds && rounds > 0 && players.length > 0) {
              startGame()
            }
          }}
        >
          <Gamepad2 className="mr-2 h-4 w-4" /> Start spel
        </Button>
      </CardFooter>
    </Card>
  )
}
