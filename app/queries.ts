import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import type { CreatePerson } from "./api/persons/route"

type Person = {
  id: number
  name: string
  email: string
}

const useCreatePersonMutation = () => {
  const client = useQueryClient()
  const mutation = useMutation({
    mutationKey: ["persons"],
    mutationFn: (person: CreatePerson) => fetch("/api/persons", {
      method: "POST",
      body: JSON.stringify(person),
    }),
    onSuccess: () => client.invalidateQueries({ queryKey: ["persons"] })
  })

  return { createPerson: mutation.mutate, ...mutation }
}

const useGetPersonsQuery= () => {
  const query = useQuery<void, unknown, Person[]>({
    queryKey: ["persons"],
    queryFn: () => fetch("/api/persons").then((res) => res.json()),
  })

  return { persons: query.data, ...query }
}

export { useCreatePersonMutation, useGetPersonsQuery, type Person }
