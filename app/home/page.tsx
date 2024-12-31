"use client"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"
import { useEffect, useState } from "react"
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts"
import { useCreatePinneMutation, useDeletePinneMutation, useGetPersonsQuery } from "../queries"
import { deleteCookie, getCookie } from "cookies-next"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useProfileContext } from "../../components/context/context"
import { LoginModal } from "@/components/blocks/login-modal"
import { MonthlyChampion } from "@/components/blocks/monthly-champion"

const chartConfig = {
  pinnar: {
    label: "pinnar",
    color: "#2563eb",
  }
} satisfies ChartConfig

export default function Home() {
  const router = useRouter()
  const { person, setPerson } = useProfileContext()
  const { persons } = useGetPersonsQuery()
  const { createPinne } = useCreatePinneMutation()
  const { deletePinne } = useDeletePinneMutation()
  const [render, setRender] = useState(0)

  if (!getCookie("rng_loggedin")) {
    router.push("/")
  }

  const data = persons?.map((person) => ({
    person: person.person.name,
    pinnar: person.pinnar,
  }))

  const addPinne = () => {
    if (!person) return
    createPinne(person.id)
    setRender(render + 1)
  }

  const removePinne = () => {
    if (!person) return
    deletePinne(person.id)
    setRender(render - 1)
  }


  useEffect(() => {
    setTimeout(() => {
      setRender(_old => 0)
    }, 4000)
  }, [render])

  if (!persons || !setPerson) return null

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 p-2">
      {!person?.name ?
        <LoginModal /> :
        <Dialog>
          <DialogTrigger className="absolute top-4 right-4 capitalize">logout</DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Logout?</DialogTitle>
              <DialogDescription>
                Logout from current account here
              </DialogDescription>
              <Button onClick={() => {
                deleteCookie("rng_player")
                setPerson(null)
              }}>Logout</Button>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      }

      <h1 className="text-4xl font-bold">This months Pinnar</h1>
      <MonthlyChampion persons={persons} />
      <section className="relative lg:w-3/4 w-full">
        {persons &&
          <>
            <ChartContainer config={chartConfig} className="block min-h-[200px] w-full md:hidden">
              <BarChart
                accessibilityLayer
                data={data}
                layout="vertical"
                margin={{
                  right: 16,
                }}
              >
                <XAxis type="number" dataKey="pinnar" hide />
                <YAxis
                  dataKey="person"
                  type="category"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => value.slice(0, 3)}
                  hide
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Bar dataKey="pinnar" fill="var(--color-pinnar)" radius={5} >
                  <LabelList
                    dataKey="person"
                    position="insideLeft"
                    offset={8}
                    className="fill-[--color-label]"
                    fontSize={12}
                  />
                  <LabelList
                    dataKey="pinnar"
                    position="insideRight"
                    offset={8}
                    className="fill-foreground"
                    fontSize={12}
                  />
                </Bar>
              </BarChart>
            </ChartContainer>
            <ChartContainer config={chartConfig} className="hidden md:block min-h-[180px] w-full -ml-4">
              <BarChart accessibilityLayer data={data}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="person"
                  tickLine={false}
                  tickMargin={10}
                  tickFormatter={(value) => value.slice(0, 5)}
                  axisLine={false}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={10}
                />
                <Bar dataKey="pinnar" fill="var(--color-pinnar)" radius={4} />
              </BarChart>
            </ChartContainer>
          </>
        }
      </section>
      <section className="flex gap-4 items-center justify-center">
        <article className="flex gap-2 items-center">
          {render != 0 && <h1 className="text-2xl font-bold animate-bounce text-blue-500">{render > 0 ? `+${render}` : render}</h1>}
          {person?.name && <h1 className="text-2xl capitalize font-bold">{person?.name}</h1>}
          <div>
            <Button className="bg-blue-500" onClick={() => addPinne()}>+</Button>
            <Button className="ml-2 bg-blue-500" onClick={() => removePinne()}>-</Button>
          </div>
        </article>
      </section >
    </main >
  )
}
