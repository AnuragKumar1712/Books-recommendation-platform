import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface RatingsBarChartProps {
  data: {
    range: string;
    count: number;
  }[];
}

const RatingsBarChart = ({ data }: RatingsBarChartProps) => {
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
        Ratings Distribution
      </h3>

      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data}>
          <XAxis
            dataKey="range"
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
            fill="var(--color-accent)"
            radius={[6, 6, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RatingsBarChart;
