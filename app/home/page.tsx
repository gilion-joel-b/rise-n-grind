"use client"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"
import { useEffect, useState } from "react"
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts"
import { useCreatePersonMutation, useCreatePinneMutation, useDeletePinneMutation, useGetPersonsQuery, useLoginPersonMutation } from "../queries"
import { deleteCookie, getCookie, setCookie } from "cookies-next"
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
import { Input } from "@/components/ui/input"

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
  const { createPinne, isError } = useCreatePinneMutation()
  const { deletePinne } = useDeletePinneMutation()
  const { createPerson } = useCreatePersonMutation()
  const { loginPerson } = useLoginPersonMutation()
  const [render, setRender] = useState(0)
  const [register, setRegister] = useState(true)

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

  const handleRegister = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const username = e.currentTarget.username.value
    const displayname = e.currentTarget.displayname.value
    if (!username || !displayname) return

    const player = { name: displayname, username }

    createPerson(player, {
      onSuccess: (data) => {
        const date = new Date();
        date.setDate(date.getDay() + 90);
        setCookie("rng_player", JSON.stringify(data), { expires: date })
        setPerson(data)
      },
      onError: (error) => {
        console.log(error)
      }
    })
  }

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const username = e.currentTarget.username.value
    if (!username) return

    loginPerson(username, {
      onSuccess: (data) => {
        const date = new Date();
        date.setDate(date.getDay() + 90);
        setCookie("rng_player", JSON.stringify(data), { expires: date })
        setPerson(data)
      },
      onError: (error) => {
        console.log(error)
      }
    })
  }

  useEffect(() => {
    setTimeout(() => {
      setRender(_old => 0)
    }, 4000)
  }, [render])

  if (!persons || !setPerson) return null

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-10 p-2">
      {!person?.name && <div>
        <div className="fixed z-[100] flex items-center justify-center w-screen h-screen top-0 left-0 bg-[#000000e6]">
          {register && <form onSubmit={handleRegister} className="py-8 px-12 bg-[#0000004d]" method="post">
            {isError && <h1 className="text-xl font-bold text-white pb-4">Enter a valid name and username</h1>}
            <h1 className="text-4xl font-bold text-white pb-4">Choose your name</h1>
            <Input type="text" name="username" required className="bg-transparent text-white outline-none mb-4" placeholder="Username" />
            <Input type="text" name="displayname" required className="bg-transparent text-white outline-none mb-4" placeholder="Display name" />
            <Button type="submit" className="mr-4 w-full mb-4 bg-white text-black hover:bg-black hover:text-white hover:outline">Register</Button>
            <Button variant="link" className="text-white w-full" onClick={() => setRegister(false)}>Already have an account?</Button>
          </form>}
          {!register && <form onSubmit={handleLogin} className="py-8 px-12 bg-[#0000004d]" method="post">
            <h1 className="text-4xl font-bold text-white pb-4">Enter your name</h1>
            <Input type="text" name="username" className="bg-transparent text-white outline-none mb-4" placeholder="Username" />
            <Button type="submit" className="mr-4 w-full mb-4 bg-white text-black hover:bg-black hover:text-white hover:outline">Login</Button>
            <Button variant="link" className="text-white w-full" onClick={() => setRegister(true)}>Create an account</Button>
          </form>}
        </div>
      </div>
      }
      {person?.name &&
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
