"use client"
import { getCookie, setCookie } from "cookies-next"
import { useRouter } from "next/navigation"
import { useLoginMutation } from "./queries"


export default function Home() {
  const router = useRouter()
  const { login, isPending, data, isError } = useLoginMutation()

  if (getCookie("rng_loggedin")) {
    console.log(getCookie("rng_loggedin"))
    router.push("/home")
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    login(e.currentTarget.password.value, {
      onSuccess: () => {
        const date = new Date()
        date.setDate(date.getDate() + 90)
        setCookie("rng_loggedin", "true", { expires:  date})
        router.push("/home")
      }
    })
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-10 p-2">

      {isError && <div>Invalid password</div>}
      {isPending && <div>Loading...</div>}
      <form onSubmit={handleSubmit} method="post">
        <input type="password" name="password" placeholder="Password" />
        <input type="submit" value="Login" disabled={isPending} />
      </form>
    </main>
  )
}
