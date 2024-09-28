"use client"
import { ChartContainer, type ChartConfig } from "@/components/ui/chart"
import { useState } from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

const chartData = [
  { person: "Oskar", pinnar: 1 },
  { person: "Mikael", pinnar: 2 },
  { person: "Fredrik", pinnar: 3 },
  { person: "Gustaf", pinnar: 4 },
  { person: "Anton", pinnar: 5 },
  { person: "Arvid", pinnar: 6 },
]

const chartConfig = {
  pinnar: {
    label: "pinnar",
    color: "#2563eb",
  }
} satisfies ChartConfig


export default function Home() {
  const [pinnar, setPinnar] = useState(0)
  const [render, setRender] = useState(0)
  const [person, setPerson] = useState<string>("")

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      chartData
        .filter((data) => data.person === person)
        .forEach((data) => {
          data.pinnar += pinnar
          setRender(render + 1)
        })
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-10 p-2">
      <h1 className="text-4xl font-bold">This months Pinnar</h1>
      <section className="">
        <ChartContainer key={render} config={chartConfig} className="lg:min-h-[40vh] min-h-[180px] w-full -ml-4">
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="person"
              tickLine={false}
              tickMargin={10}
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
      </section>
      <section className="flex gap-4 items-center justify-center">
        <form className="flex gap-2 items-center" onSubmit={handleSubmit}>
          <select className="p-2 bg-gray-200 rounded-lg py-8" onChange={(e) => setPerson(e.target.value)}>
            <option>Choose person</option>
            {chartData.map((person, i) => (<option key={i}>{person.person}</option>))}
          </select>
          <div>
            <button className="w-full p-2 bg-blue-500 text-white rounded-lg mb-2" onClick={() => setPinnar(1)}>+</button>
            <button className="w-full p-2 bg-blue-500 text-white rounded-lg" onClick={() => setPinnar(-1)}>-</button>
          </div>
        </form>
      </section>
    </main>
  )
}
