"use client"
import { ChartContainer, type ChartConfig } from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

const chartData = [
    { person: "Oskar", pinnar: 10 },
    { person: "Mikael", pinnar: 20 },
    { person: "Fredrik", pinnar: 30 },
    { person: "Gustaf", pinnar: 40 },
    { person: "Anton", pinnar: 50 },
    { person: "Arvid", pinnar: 60 },
]

const chartConfig = {
    pinnar: {
        label: "pinnar",
        color: "#2563eb",
    }
} satisfies ChartConfig


export default function Home() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <section>
                <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
                    <BarChart accessibilityLayer data={chartData}>
                        <CartesianGrid vertical={false} />
                        <XAxis dataKey="person"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            //tickFormatter={(value) => value.slice(0, 3)}
                        />
                        <Bar dataKey="pinnar" fill="var(--color-pinnar)" radius={4} />
                    </BarChart>
                </ChartContainer>
            </section>
        </main>
    )
}
