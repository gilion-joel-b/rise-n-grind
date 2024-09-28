import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import type { CreatePerson } from "./api/persons/route"

type Person = {
  id: number
  name: string
}

type Pinne = {
  pinne_id: number
  name: string
}

type PersonWithPinnar = { person: Person, pinnar: number }

const useCreatePersonMutation = () => {
  const client = useQueryClient()
  const mutation = useMutation({
    mutationKey: ["persons"],
    mutationFn: (name: string) => fetch("/api/persons", {
      method: "POST",
      body: JSON.stringify({name}),
    }).then((res) => {
      if (res.status !== 201) {
        throw new Error("Failed to create person")
      }

      return res.json()
    }),
    onSuccess: () => client.invalidateQueries({ queryKey: ["persons"] })
  })

  return { createPerson: mutation.mutate, ...mutation }
}

const useGetPersonsQuery = () => {
  const query = useQuery<void, unknown, PersonWithPinnar[]>({
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

const useLoginMutation = () => {
  const client = useQueryClient()
  const mutation = useMutation({
    mutationKey: ["login"],
    mutationFn: (password: string) => fetch("/api/login", {
      method: "POST",
      body: JSON.stringify({ password }),
    }).then((res) => {
      if (res.status === 200) {
        return res.json()
      } else {
        throw new Error("Invalid password")
      }
    }),
    onSuccess: (data: Response) => {
      client.invalidateQueries({ queryKey: ["login"] })
    },
  })

  return { login: mutation.mutate, ...mutation }
}

export {
  useCreatePersonMutation,
  useGetPersonsQuery,
  useCreatePinneMutation,
  useDeletePinneMutation,
  useLoginMutation
}

export type { Person, Pinne, PersonWithPinnar }
