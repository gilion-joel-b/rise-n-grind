"use client"
import { useCreatePersonMutation, useLoginPersonMutation } from "@/app/queries"
import { useProfileContext } from "@/components/context/context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { setCookie } from "cookies-next"
import { useState } from "react"

export function LoginModal() {
  const { createPerson, isError: isErrorRegister } = useCreatePersonMutation()
  const { loginPerson, isError: isErrorLogin } = useLoginPersonMutation()
  const { person, setPerson } = useProfileContext()

  const [register, setRegister] = useState(true)

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
  return (
    <div>
      <div className="fixed z-[100] flex items-center justify-center w-screen h-screen top-0 left-0 bg-[#000000e6]">
        {register && <form onSubmit={handleRegister} className="py-8 px-12 bg-[#0000004d]" method="post">
          {isErrorRegister && <h1 className="text-xl font-bold text-white pb-4">Enter a valid name and username</h1>}
          <h1 className="text-4xl font-bold text-white pb-4">Choose your name</h1>
          <Input type="text" name="username" required className="bg-transparent text-white outline-none mb-4" placeholder="Username" />
          <Input type="text" name="displayname" required className="bg-transparent text-white outline-none mb-4" placeholder="Display name" />
          <Button type="submit" className="mr-4 w-full mb-4 bg-white text-black hover:bg-black hover:text-white hover:outline">Register</Button>
          <Button variant="link" className="text-white w-full" onClick={() => setRegister(false)}>Already have an account?</Button>
        </form>}
        {!register && <form onSubmit={handleLogin} className="py-8 px-12 bg-[#0000004d]" method="post">
          {isErrorLogin && <h1 className="text-xl font-bold text-white pb-4">Could not find a user with that name</h1>}
          <h1 className="text-4xl font-bold text-white pb-4">Enter your name</h1>
          <Input type="text" name="username" className="bg-transparent text-white outline-none mb-4" placeholder="Username" />
          <Button type="submit" className="mr-4 w-full mb-4 bg-white text-black hover:bg-black hover:text-white hover:outline">Login</Button>
          <Button variant="link" className="text-white w-full" onClick={() => setRegister(true)}>Create an account</Button>
        </form>}
      </div>
    </div>
  )
}
