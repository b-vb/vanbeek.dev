import Link from "next/link"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function IndexPage() {
  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
      <div className="flex max-w-[980px] flex-col items-start gap-2">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tighter sm:text-3xl md:text-5xl lg:text-6xl">
          Some stuff
        </h1>
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle>Kaartspel</CardTitle>
            <CardDescription>Hou de score bij van je kaartspel</CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-between">
            <Link href="/card-game">
              <Button>Begin</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </section>
  )
}
