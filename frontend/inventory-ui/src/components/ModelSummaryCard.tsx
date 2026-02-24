import type { ModelResult } from "../types/inventory"

interface Props {
  title: string
  data: ModelResult
  color?: string
}

export default function ModelSummaryCard({ title, data, color }: Props) {
  return (
    <div
      className={`p-5 rounded-lg shadow hover:shadow-lg transition-shadow duration-200 bg-linear-to-r ${
        color || "from-gray-200 to-gray-300"
      } text-white`}
    >
      <h2 className="text-xl font-bold mb-3">{title}</h2>
      <p className="text-lg">
        <span className="font-semibold">Daily Demand:</span>{" "}
        {data.daily_demand.toFixed(2)}
      </p>
      <p className="text-lg">
        <span className="font-semibold">EOQ:</span> {data.eoq.toFixed(0)}
      </p>
      <p className="text-lg">
        <span className="font-semibold">Reorder Point:</span>{" "}
        {data.rop.toFixed(0)}
      </p>
    </div>
  )
}
