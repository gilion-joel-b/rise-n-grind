"use client"
import { useGetPersonsQuery } from "../queries"
import { getCookie } from "cookies-next"
import { useRouter } from "next/navigation"
import { useProfileContext } from "../../components/context/context"
import { MonthlyChampion } from "@/components/blocks/monthly-champion"
import { Profile } from "@/components/blocks/profile"
import { Incrementer } from "@/components/blocks/incrementer"
import { BarChartPinnar } from "@/components/blocks/bar-chart-pinnar"
import { Fireworks } from '@fireworks-js/react'


export default function Home() {
  const router = useRouter()
  const { setPerson } = useProfileContext()
  const { persons } = useGetPersonsQuery()

  if (!getCookie("rng_loggedin")) {
    router.push("/")
  }

  if (!persons || !setPerson) return null

  return (
    <main className="flex text-white min-h-screen flex-col items-center justify-center gap-8 p-2">
      <Fireworks
        options={{ opacity: 0.5 }}
        style={{
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          position: 'fixed',
          background: '#000',
          zIndex: -1
        }}
      />
      <Profile />
      <h1 className="text-4xl font-bold">This months Pinnar</h1>
      <MonthlyChampion persons={persons} />
      <BarChartPinnar />
      <Incrementer />
    </main >
  )
}
