import { useGetPersonsQuery } from "@/app/queries";
import { useProfileContext } from "@/components/context/context";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts";

const chartConfig = {
  pinnar: {
    label: "pinnar",
    color: "#2563eb",
  }
} satisfies ChartConfig

export function BarChartPinnar() {
  const { persons } = useGetPersonsQuery()
  const { setPerson } = useProfileContext()

  const data = persons?.map((person) => ({
    person: person.person.name,
    pinnar: person.pinnar,
  }))

  if (!persons || !setPerson) return null


  return (
    <section className="relative lg:w-3/4 w-full">
      <ChartContainer config={chartConfig} className="block min-h-[200px] w-full md:hidden">
        <BarChart
          accessibilityLayer
          data={data}
          layout="vertical"
          margin={{
            right: 16,
          }}
        >
          <XAxis type="number" dataKey="pinnar" hide />
          <YAxis
            dataKey="person"
            type="category"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={(value) => value.slice(0, 3)}
            hide
          />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel />}
          />
          <Bar dataKey="pinnar" fill="var(--color-pinnar)" radius={5} >
            <LabelList
              dataKey="person"
              position="insideLeft"
              offset={8}
              className="fill-[--color-label]"
              fontSize={12}
            />
            <LabelList
              dataKey="pinnar"
              position="insideRight"
              offset={8}
              className="fill-foreground"
              fontSize={12}
            />
          </Bar>
        </BarChart>
      </ChartContainer>
      <ChartContainer config={chartConfig} className="hidden md:block min-h-[180px] w-full -ml-4">
        <BarChart accessibilityLayer data={data}>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="person"
            tickLine={false}
            tickMargin={10}
            tickFormatter={(value) => value.slice(0, 5)}
            axisLine={false}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tickMargin={10}
          />
          <Bar dataKey="pinnar" fill="var(--color-pinnar)" radius={4} />
        </BarChart>
      </ChartContainer>
    </section>
  )
}
