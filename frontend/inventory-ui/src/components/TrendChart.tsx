import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid
} from "recharts"

interface Props {
  mlTrend: number[]
  lstmTrend: number[]
}

export default function TrendChart({ mlTrend, lstmTrend }: Props) {
  const data = mlTrend.map((val, idx) => ({
    day: idx + 1,
    ML: Math.max(0, val),
    LSTM: Math.max(0, lstmTrend[idx] ?? 0)
  }))

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="day" label={{ value: "Day", position: "insideBottomRight", offset: 0 }} />
        <YAxis label={{ value: "Predicted Demand", angle: -90, position: "insideLeft" }} />
        <Tooltip />
        <Legend verticalAlign="top" height={36} />
        <Line type="monotone" dataKey="ML" stroke="#3b82f6" strokeWidth={2} />
        <Line type="monotone" dataKey="LSTM" stroke="#10b981" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  )
}
