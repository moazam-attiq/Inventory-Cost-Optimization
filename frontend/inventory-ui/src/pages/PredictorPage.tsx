import { useMemo, useState } from "react"
import predictionsData from "../data/predictions.json"
import { products } from "../data/products"
import TrendChart from "../components/TrendChart"
import type { PredictionItem } from "../types/prediction"

const predictions = predictionsData as PredictionItem[]

export default function PredictorPage() {
  const [store] = useState<number>(1)
  const [product, setProduct] = useState<number>(1)
  const [horizon, setHorizon] = useState<number>(7)

  const selectedPrediction = useMemo(() => {
    return predictions.find(
      p =>
        p.store === store &&
        p.product === product &&
        p.horizon_days === horizon
    )
  }, [store, product, horizon])

  const productsList = useMemo(() => {
    return products.filter(prod =>
      predictions.some(p => p.product === prod.id)
    )
  }, [])

  const productMeta = products.find(p => p.id === product)

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-100 to-slate-200 p-8">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl p-8 space-y-8">

        {/* Header */}
        <div>
          <h2 className="text-3xl font-bold text-gray-800">
            Sales Forecasting Engine
          </h2>
          <p className="text-gray-500 mt-1">
            Predict upcoming product demand using ML & LSTM models
          </p>
        </div>

        {/* Controls Panel */}
        <div className="bg-gray-50 p-6 rounded-xl border flex flex-wrap gap-6 items-center">

          <div className="flex flex-col">
            <label className="text-sm text-gray-500 mb-1">Select Product</label>
            <select
              className="border p-2 rounded-lg focus:ring-2 focus:ring-blue-400"
              value={product}
              onChange={e => setProduct(Number(e.target.value))}
            >
              {productsList.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-sm text-gray-500 mb-1">Forecast Horizon</label>
            <select
              className="border p-2 rounded-lg focus:ring-2 focus:ring-blue-400"
              value={horizon}
              onChange={e => setHorizon(Number(e.target.value))}
            >
              {[7, 14, 30].map(h => (
                <option key={h} value={h}>
                  {h} Days
                </option>
              ))}
            </select>
          </div>

          {productMeta && (
            <div className="ml-auto bg-blue-50 px-4 py-3 rounded-lg">
              <p className="text-sm text-gray-500">Unit Price</p>
              <p className="font-semibold text-blue-700">
                Rs. {productMeta.cost}
              </p>
            </div>
          )}
        </div>

        {!selectedPrediction && (
          <div className="text-center text-red-500 font-medium">
            No prediction data available.
          </div>
        )}

        {selectedPrediction && (
          <div className="bg-white rounded-xl shadow p-6 border">
            <h3 className="font-semibold text-lg mb-4 text-gray-700">
              Predicted Demand Trend ({horizon} Days)
            </h3>
            <TrendChart
              mlTrend={selectedPrediction.ml.trend}
              lstmTrend={selectedPrediction.lstm.trend}
            />
          </div>
        )}

      </div>
    </div>
  )
}