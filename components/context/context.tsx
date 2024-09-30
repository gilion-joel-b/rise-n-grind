"use client"

import { createContext, Dispatch, SetStateAction, useContext, useEffect, useMemo, useState } from "react"
import { Person } from "../../app/queries"
import { deleteCookie, getCookie } from "cookies-next"

type ProfileContext = {
  person: Person | null
  setPerson: Dispatch<SetStateAction<Person | null>> | null
}

const profileContext = createContext<ProfileContext>({ person: null, setPerson: null })

const useProfileContext = (): {person: Person | null, setPerson:Dispatch<SetStateAction<Person | null>>} => {
  if (!profileContext) {
    throw new Error("useProfileContext must be used within a ProfileProvider")
  }
  const context = useContext(profileContext)

  if (!context) {
    throw new Error("useProfileContext must be used within a ProfileProvider")
  }

  if (!context.setPerson) {
    throw new Error("useProfileContext must be used within a ProfileProvider")
  }

  return context as {person: Person | null, setPerson:Dispatch<SetStateAction<Person | null>>}
}

const ProfileProvider = ({ children }: { children: React.ReactNode }) => {
  const cookie = getCookie("rng_player")
  const [person, setPerson] = useState<Person | null>(null)
  const profileValue = useMemo(() => {
    if (!cookie) return { person: null }

    try {
      return JSON.parse(cookie) satisfies Person
    } catch (e) {
      deleteCookie("rng_player")
      return { person: null }
    }
  }, [cookie])
  useEffect(() => {
    setPerson(profileValue.person)
  }, [profileValue])


  return <profileContext.Provider value={{ person, setPerson }}>{children}</profileContext.Provider>
}

export { ProfileProvider, useProfileContext }
