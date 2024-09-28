import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import type { CreatePerson } from "./api/persons/route"

type Person = {
  id: number
  name: string
  email: string
}

type Pinne = {
  pinne_id: number
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

const useGetPersonsQuery = () => {
  const query = useQuery<void, unknown, { person: Person, pinnar: number }[]>({
    queryKey: ["persons"],
    queryFn: () => fetch("/api/persons").then((res) => res.json()),
  })

  return { persons: query.data, ...query }
}

const useCreatePinneMutation = () => {
  const client = useQueryClient()
  const mutation = useMutation({
    mutationKey: ["pinnar"],
    mutationFn: (personId: number) => fetch("/api/pinnar", {
      method: "POST",
      body: JSON.stringify({ personId }),
    }),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["pinnar"] })
      client.invalidateQueries({ queryKey: ["persons"] })
    }
  })

  return { createPinne: mutation.mutate, ...mutation }
}

const useDeletePinneMutation = () => {
  const client = useQueryClient()
  const mutation = useMutation({
    mutationKey: ["pinnar"],
    mutationFn: (personId: number) => fetch(`/api/pinnar/${personId}`, {
      method: "DELETE",
    }),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["pinnar"] })
      client.invalidateQueries({ queryKey: ["persons"] })
    }
  })

  return { deletePinne: mutation.mutate, ...mutation }
}

export { useCreatePersonMutation, useGetPersonsQuery, useCreatePinneMutation, useDeletePinneMutation }
export type { Person, Pinne }
