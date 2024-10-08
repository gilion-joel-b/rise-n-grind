"use client"
import { useCreatePersonMutation, useGetPersonsQuery } from "../queries"

export default function Home() {
  const { persons } = useGetPersonsQuery()
  const { createPerson } = useCreatePersonMutation()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    e.currentTarget.test;
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-10 p-2">
      <section className="">
      </section>
      <section className="flex gap-4 items-center justify-center">
        <form className="flex gap-2 items-center" onSubmit={handleSubmit}>
          <input type="text" name="user" placeholder="Name" />
          <input type="submit" value="Submit" />
        </form>
      </section>
    </main>
  )
}
