import { Score } from "@/app/card-game/machine"
import { Input } from "../ui/input"

export const ScoreCell = ({
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
