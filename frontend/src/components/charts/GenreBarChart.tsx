import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface GenreBarChartProps {
  data: {
    genre: string;
    count: number;
  }[];
}

const GenreBarChart = ({ data }: GenreBarChartProps) => {
  return (
    <div
      className="
      bg-[var(--color-card)]
      border border-[var(--color-border)]
      rounded-xl
      p-6
      literary-shadow
      h-full
      "
    >
      <h3 className="text-lg font-semibold text-[var(--color-card-foreground)] mb-4">
        Genre Distribution
      </h3>

      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data}>
          <XAxis
            dataKey="genre"
            height={60}
            angle={-45}
            textAnchor="end"
            interval={0}
            tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }}
            axisLine={{ stroke: "var(--color-border)" }}
            tickLine={false}
          />

          <YAxis
            allowDecimals={false}
            tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }}
            axisLine={{ stroke: "var(--color-border)" }}
            tickLine={false}
          />

          <Tooltip
            contentStyle={{
              background: "var(--color-card)",
              border: "1px solid var(--color-border)",
              borderRadius: "8px",
              color: "var(--color-foreground)",
            }}
          />

          <Bar
            dataKey="count"
            fill="var(--color-primary)"
            radius={[6, 6, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GenreBarChart;
