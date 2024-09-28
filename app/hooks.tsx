import { useState } from "react";
import { Person, useGetPersonsQuery } from "./queries";

const usePersons = () => {
  const [data, setData] = useState<[{person: Person, pinnar: number}] | null>(null);
  const [render, setRender] = useState(0);
  const { persons } = useGetPersonsQuery();
}
