"use client"
import { useCreatePinneMutation, useDeletePinneMutation } from "@/app/queries"
import { useProfileContext } from "@/components/context/context"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"

export function Incrementer() {
  const [render, setRender] = useState(0)
  const { person } = useProfileContext()

  const { createPinne } = useCreatePinneMutation()
  const { deletePinne } = useDeletePinneMutation()


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

  return (
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
  )
}
