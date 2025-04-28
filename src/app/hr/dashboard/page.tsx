// "use client"

// import * as React from "react"
// import { useEffect, useState } from "react"
// import { TrendingUp } from "lucide-react"
// import { Label, Pie, PieChart } from "recharts"

// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
// import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"



// export default function Component() {

//     const [dataShow, setDataShow] = useState<any[]>([]); 
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState<string | null>(null);

//     useEffect(() => {
//         fetch("/api/datakaryawan") // Gantilah dengan endpoint API yang sesuai
//         .then((res) => res.json())
//         .then((data) => setDataShow(data))
//         .catch((err) => console.error("Error fetching data:", err));
//     }, []);

//     const cabangColors = {
//     N001: "#FF5733",
//     N002: "#33FF57",
//     N003: "#3357FF",
//     N004: "#FF33A1",
//     N005: "#FF8C33",
//     N006: "#A133FF",
//     N007: "#33FFF0",
//     N008: "#FFD700",
//     N009: "#808080",
//     P001: "#8B0000",
//     P002: "#008000",
//     P003: "#00008B",
//     P004: "#FF4500",
//     P005: "#9400D3",
//     P006: "#20B2AA",
//     P007: "#4682B4",
//     P008: "#D2691E",
//     P009: "#708090",
// };

//   // ✅ Pastikan dataShow sudah ada & berbentuk array sebelum reduce()
// const chartData = Array.isArray(dataShow)
//     ? Object.values(
//         dataShow.reduce((acc: any, karyawan: any) => {
//         const { personnelArea } = karyawan;
//         if (!acc[personnelArea]) {
//             acc[personnelArea] = {
//             cabang: personnelArea,
//             jumlahKaryawan: 0,
//             fill: cabangColors[personnelArea as keyof typeof cabangColors] || "var(--color-default)",
//             };
//         }
//         acc[personnelArea].jumlahKaryawan += 1;
//         return acc;
//         }, {})
//     )
//     : [];

//     const chartConfig = {
//     visitors: {
//         label: "Visitors",
//     },
//HO: {
//         label: "Chrome",
//         color: "hsl(var(--chart-1))",
//     },
//     safari: {
//         label: "Safari",
//         color: "hsl(var(--chart-2))",
//     },
//     firefox: {
//         label: "Firefox",
//         color: "hsl(var(--chart-3))",
//     },
//     edge: {
//         label: "Edge",
//         color: "hsl(var(--chart-4))",
//     },
//     other: {
//         label: "Other",
//         color: "hsl(var(--chart-5))",
//     },
//     } satisfies ChartConfig



//     const totalVisitors: any = React.useMemo(() => {
//         return chartData.reduce((acc, curr: any) => acc + curr.visitors, 0)
//     }, [])

//     console.log(Object.values(chartData));

//     return (
//         <Card className="flex flex-col">
//         <CardHeader className="items-center pb-0">
//             <CardTitle>Pie Chart - Donut with Text</CardTitle>
//             <CardDescription>January - June 2024</CardDescription>
//         </CardHeader>
//         <CardContent className="flex-1 pb-0">
//             <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[250px]">
//             <PieChart>
//                 <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
//                 <Pie data={Object.values(chartData)} dataKey="cabang" nameKey="jumlahKaryawan" innerRadius={60} strokeWidth={5}>
//                 <Label
//                     content={({ viewBox }) => {
//                     if (viewBox && "cx" in viewBox && "cy" in viewBox) {
//                         return (
//                         <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
//                             <tspan x={viewBox.cx} y={viewBox.cy} className="fill-foreground text-3xl font-bold">
//                             {totalVisitors.toLocaleString()}
//                             </tspan>
//                             <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 24} className="fill-muted-foreground">
//                             Visitors
//                             </tspan>
//                         </text>
//                         )
//                     }
//                     }}
//                 />
//                 </Pie>
//             </PieChart>
//             </ChartContainer>
//         </CardContent>
//         <CardFooter className="flex-col gap-2 text-sm">
//             <div className="flex items-center gap-2 font-medium leading-none">
//             Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
//             </div>
//             <div className="leading-none text-muted-foreground">Showing total visitors for the last 6 months</div>
//         </CardFooter>
//         </Card>
//     )
//     }

"use client"

import * as React from "react"
import { TrendingUp } from "lucide-react"
import { Label, Pie, PieChart, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
const chartData = [
  { cabang: "HO", jumlahKaryawan: 275, fill: "var(--color-HO)" },
  { cabang: "DKI", jumlahKaryawan: 200, fill: "var(--color-DKI)" },
  { cabang: "Cibitung", jumlahKaryawan: 287, fill: "var(--color-Cibitung)" },
  { cabang: "Bandung", jumlahKaryawan: 173, fill: "var(--color-Bandung)" },
  { cabang: "Medan", jumlahKaryawan: 190, fill: "var(--color-Medan)" },
]

const formCompletionData = [
    { status: "Sudah Mengisi", jumlah: 820, fill: "#4CAF50" },
    { status: "Belum Mengisi", jumlah: 180, fill: "#F44336" },
]

const chartConfig = {
  jumlahKaryawan: {
    label: "Visitors",
  },
  HO: {
    label: "HO",
    color: "hsl(var(--chart-1))",
  },
  DKI: {
    label: "DKI",
    color: "hsl(var(--chart-2))",
  },
  Cibitung: {
    label: "Cibitung",
    color: "hsl(var(--chart-3))",
  },
  Bandung: {
    label: "Bandung",
    color: "hsl(var(--chart-4))",
  },
  Medan: {
    label: "Medan",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig

const barChartData = chartData.map((item) => ({ cabang: item.cabang, jumlahKaryawan: item.jumlahKaryawan }))

export default function Component() {
  const totalKaryawan = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.jumlahKaryawan, 0)
  }, [])

  return (
    <div className="flex gap-4 w-full h-full">
  {/* Left Column (Pie Charts) */}
  <div className="flex flex-col w-1/2 gap-4">
    {/* Pie Chart (Jumlah Karyawan) */}
    <Card className="flex flex-col h-1/2">
      <CardHeader className="items-center pb-0">
        <CardTitle>Pie Chart</CardTitle>
        <CardDescription>Jumlah Karyawan per Cabang</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[250px]">
          <PieChart>
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Pie data={chartData} dataKey="jumlahKaryawan" nameKey="cabang" innerRadius={60} strokeWidth={5}>
              <Label
                content={({ viewBox }) =>
                  viewBox && "cx" in viewBox && "cy" in viewBox ? (
                    <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                      <tspan x={viewBox.cx} y={viewBox.cy} className="fill-foreground text-3xl font-bold">
                        {totalKaryawan.toLocaleString()}
                      </tspan>
                      <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 24} className="fill-muted-foreground">
                        Total Karyawan
                      </tspan>
                    </text>
                  ) : null
              }
              />
            </Pie>
          </PieChart>
        </ChartContainer>
        {/* Legend */}
        <div className="flex justify-center gap-2 mt-2">
          {chartData.map(({ cabang, fill }) => (
            <div key={cabang} className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full" style={{ backgroundColor: fill }}></span>
              <span>{cabang}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>

    {/* Pie Chart (Form Completion) */}
    <Card className="flex flex-col h-1/2">
      <CardHeader className="items-center pb-0">
        <CardTitle>Form Completion</CardTitle>
        <CardDescription>Status Pengisian Form</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[250px]">
          <PieChart>
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Pie data={formCompletionData} dataKey="jumlah" nameKey="status" innerRadius={60} strokeWidth={5} />
          </PieChart>
        </ChartContainer>
        {/* Legend */}
        <div className="flex justify-center gap-2 mt-2">
          {formCompletionData.map(({ status, fill }) => (
            <div key={status} className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full" style={{ backgroundColor: fill }}></span>
              <span>{status}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  </div>

  {/* Right Column (Bar Chart) */}
  <Card className="flex flex-col w-1/2 h-full justify-center items-center">
  <CardHeader className="items-center pb-0">
    <CardTitle>Bar Chart</CardTitle>
    <CardDescription>Jumlah Karyawan per Cabang</CardDescription>
  </CardHeader>
  <CardContent className="flex-1 pb-0">
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={barChartData}>
        <XAxis dataKey="cabang" />
        <YAxis />
        <Tooltip />
        <Bar
          dataKey="jumlahKaryawan"
          fill="#8884d8"
        >
          {/* Menggunakan warna berbeda untuk setiap bar */}
          {barChartData.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={["#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#ff0000"][index % 5]}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>

    {/* Legend */}
    <div className="flex justify-center gap-2 mt-4 flex-wrap">
      {barChartData.map((item, index) => (
        <div key={item.cabang} className="flex items-center gap-2">
          <span
            className="w-4 h-4 rounded-full"
            style={{ backgroundColor: ["#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#ff0000"][index % 5] }}
          ></span>
          <span>{item.cabang}</span>
        </div>
      ))}
    </div>
  </CardContent>
</Card>

</div>
  )
}
