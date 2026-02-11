"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

interface ProgressLineChartProps {
  data: { date: string; percentage: number; label: string }[];
  color?: string;
}

export function ProgressLineChart({
  data,
  color = "hsl(142, 76%, 36%)",
}: ProgressLineChartProps) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(0, 0%, 20%)" />
        <XAxis
          dataKey="label"
          tick={{ fontSize: 10, fill: "hsl(0, 0%, 60%)" }}
          stroke="hsl(0, 0%, 30%)"
        />
        <YAxis
          domain={[0, 100]}
          tick={{ fontSize: 10, fill: "hsl(0, 0%, 60%)" }}
          stroke="hsl(0, 0%, 30%)"
          tickFormatter={(v) => `${v}%`}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(0, 0%, 12%)",
            border: "1px solid hsl(0, 0%, 20%)",
            borderRadius: "8px",
            fontSize: 12,
          }}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          formatter={(value: any) => [`${value}%`, "Acerto"]}
        />
        <Line
          type="monotone"
          dataKey="percentage"
          stroke={color}
          strokeWidth={2}
          dot={{ r: 3 }}
          activeDot={{ r: 5 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

interface VolumeBarChartProps {
  data: { label: string; shots: number }[];
}

export function VolumeBarChart({ data }: VolumeBarChartProps) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(0, 0%, 20%)" />
        <XAxis
          dataKey="label"
          tick={{ fontSize: 10, fill: "hsl(0, 0%, 60%)" }}
          stroke="hsl(0, 0%, 30%)"
        />
        <YAxis
          tick={{ fontSize: 10, fill: "hsl(0, 0%, 60%)" }}
          stroke="hsl(0, 0%, 30%)"
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(0, 0%, 12%)",
            border: "1px solid hsl(0, 0%, 20%)",
            borderRadius: "8px",
            fontSize: 12,
          }}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          formatter={(value: any) => [value, "Arremessos"]}
        />
        <Bar dataKey="shots" fill="hsl(221, 83%, 53%)" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
