"use client"
import { ChartContainer, type ChartConfig } from "@/components/ui/chart"
import { useEffect, useState } from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { useCreatePersonMutation, useCreatePinneMutation, useDeletePinneMutation, useGetPersonsQuery } from "../queries"
import { getCookie, setCookie } from "cookies-next"
import { useRouter } from "next/navigation"

const chartConfig = {
  pinnar: {
    label: "pinnar",
    color: "#2563eb",
  }
} satisfies ChartConfig

export default function Home() {
  const router = useRouter()
  const { persons } = useGetPersonsQuery()
  const { createPinne } = useCreatePinneMutation()
  const { deletePinne } = useDeletePinneMutation()
  const { createPerson } = useCreatePersonMutation()
  const [render, setRender] = useState(0)
  const [personId, setPersonId] = useState<number | null>(null)
  const [name, setName] = useState<string | undefined>(getCookie("rng_player")?.toString())

  if (!getCookie("rng_loggedin")) {
    router.push("/")
  }

  const data = persons?.map((person) => ({
    person: person.person.name,
    pinnar: person.pinnar,
  }))

  const addPinne = (personId: number | null) => {
    if (!personId) return
    createPinne(personId)
    setRender(render + 1)
  }

  const removePinne = (personId: number | null) => {
    if (!personId) return
    deletePinne(personId)
    setRender(render + 1)
  }

  const handleName = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const player = e.currentTarget.player.value
    createPerson(player, {
      onSuccess: () => {
        const date = new Date();
        date.setDate(date.getDay() + 90);
        setCookie("rng_player", player, { expires: date })
        setName(player)
      },
      onError: (error) => {
        console.log(error)
      }
    })
    console.log(e.currentTarget.player.value)
  }

  if (!persons) return null

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-10 p-2">
      {!name && <div>
        <div className="fixed z-[100] flex items-center justify-center w-screen h-screen top-0 left-0 bg-[#000000e6]">
          <form onSubmit={handleName} className="py-8 px-12 bg-[#0000004d]" method="post">
            <h1 className="text-4xl font-bold text-white pb-4">Enter your name</h1>
            <input type="text" name="player" className="bg-transparent text-white outline-none" placeholder="Name" />
            <input type="submit" value="Submit" className="text-white" />
          </form>
        </div>
      </div>
      }
      {name && <h1 className="absolute top-4 right-4">{name}</h1>}
      <h1 className="text-4xl font-bold">This months Pinnar</h1>
      <section className="relative w-full">
        {persons &&
          <ChartContainer key={render} config={chartConfig} className="lg:min-h-[40vh] min-h-[180px] w-full -ml-4">
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
        }
      </section>
      <section className="flex gap-4 items-center justify-center">
        <article className="flex gap-2 items-center">
          <select className="p-2 capitalize bg-gray-200 rounded-lg py-8" onChange={(e) => setPersonId(Number(e.target.value))}>
            <option>Choose person</option>
            {persons?.map((person, i) => (
              <option
                key={i}
                value={`${person.person.id}`}>{person.person.name}
              </option>))}
          </select>
          <div>
            <button className="w-full p-2 bg-blue-500 text-white rounded-lg mb-2" onClick={() => addPinne(personId)}>+</button>
            <button className="w-full p-2 bg-blue-500 text-white rounded-lg" onClick={() => removePinne(personId)}>-</button>
          </div>
        </article>
      </section>
    </main>
  )
}
