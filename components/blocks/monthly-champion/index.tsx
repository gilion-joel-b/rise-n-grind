import { PersonWithPinnar } from "@/app/queries";

export function MonthlyChampion({ persons }: { persons: PersonWithPinnar[] }) {
  const monthlyChampion = persons.reduce((max, obj) =>
    obj.pinnar > max.pinnar ? obj : max
  );
  return (
    <h2 className="text-lg font-bold">{monthlyChampion.person.name} 🥇</h2>
  )
}
