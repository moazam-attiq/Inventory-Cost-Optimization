import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LabelList
} from "recharts"

interface Props {
  ml: number
  lstm: number
}

export default function ComparisonChart({ ml, lstm }: Props) {
  const data = [
    { name: "ML", demand: ml },
    { name: "LSTM", demand: lstm }
  ]

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart
        layout="vertical" // <-- key change for horizontal bars
        data={data}
        margin={{ top: 20, right: 20, bottom: 20, left: 50 }}
      >
        <XAxis type="number" />       {/* Horizontal axis is now numeric */}
        <YAxis type="category" dataKey="name" /> {/* Vertical axis is categorical */}
        <Tooltip />
        <Bar dataKey="demand" fill="#3b82f6" barSize={20}>
          <LabelList dataKey="demand" position="right" /> {/* labels at end of bar */}
        </Bar>
        <Bar dataKey="demand" fill="#10b981" barSize={20} />
      </BarChart>
    </ResponsiveContainer>
  )
}
