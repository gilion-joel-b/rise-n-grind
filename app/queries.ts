import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

type Person = {
  id: number
  name: string
  username: string
}

type Pinne = {
  pinne_id: number
  name: string
}

type CreatePerson = {
  name: string
  username: string
}

type PersonWithPinnar = { person: Person, pinnar: number }

const useCreatePersonMutation = () => {
  const client = useQueryClient()
  const mutation = useMutation<Person, unknown, CreatePerson>({
    mutationKey: ["persons"],
    mutationFn: ({ name, username }) => fetch("/api/persons", {
      method: "POST",
      body: JSON.stringify({ name, username }),
    }).then((res) => {
      if (res.status !== 201) {
        throw new Error("Failed to create person")
      }
      return res.json()
    }),
    onSuccess: () => client.invalidateQueries({ queryKey: ["persons"] }),
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
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["login"] })
    },
  })

  return { login: mutation.mutate, ...mutation }
}

const useLoginPersonMutation = () => {
  const mutation = useMutation({
    mutationKey: ["login"],
    mutationFn: (username: string) => fetch("/api/login/person", {
      method: "POST",
      body: JSON.stringify({ username }),
    }).then((res) => {
      if (res.status === 200) {
        return res.json()
      } else {
        throw new Error("Invalid username")
      }
    }),
  })

  return { loginPerson: mutation.mutate, ...mutation }
}

export {
  useCreatePersonMutation,
  useGetPersonsQuery,
  useCreatePinneMutation,
  useDeletePinneMutation,
  useLoginMutation,
  useLoginPersonMutation,
}

export type { Person, Pinne, PersonWithPinnar, CreatePerson }
