import { useMemo, useState } from "react";
import predictions from "../data/predictions.json";
import { products } from "../data/products"
import type { PredictionEntry } from "../types/inventory";
import ComparisonChart from "../components/ComparisonChart";
import ProductSelector from "../components/ProductSelector";
import HorizonSelector from "../components/HorizonSelector";
import ModelSummaryCard from "../components/ModelSummaryCard";
import TrendChart from "../components/TrendChart";

const data = predictions as PredictionEntry[];

export default function Dashboard() {
  const [product, setProduct] = useState<number>(data[0]?.product || 1);
  const [horizon, setHorizon] = useState<number>(data[0]?.horizon_days || 7);

  const selected = useMemo(() => {
    return data.find(
      (d) =>
        Number(d.product) === product && Number(d.horizon_days) === horizon,
    );
  }, [product, horizon]);

  const productMeta = useMemo(() => {
    return products.find(p => p.id === product)
  }, [product])

  const businessMetrics = useMemo(() => {
    if (!selected || !productMeta) return null

    const sellingPrice = productMeta.cost
    // const horizonDays = horizon

    // Projected Revenue
    const mlRevenue =
      selected.ml.trend.reduce((a, b) => a + b, 0) * sellingPrice

    const lstmRevenue =
      selected.lstm.trend.reduce((a, b) => a + b, 0) * sellingPrice

    // Inventory Cost Approximation
    const mlTotalCost =
      selected.ml.eoq * productMeta.cost

    const lstmTotalCost =
      selected.lstm.eoq * productMeta.cost

    const costDifference = Math.abs(mlTotalCost - lstmTotalCost)

    return {
      mlRevenue,
      lstmRevenue,
      mlTotalCost,
      lstmTotalCost,
      costDifference
    }
  }, [selected, productMeta, horizon])

  const availableHorizons = useMemo(() => {
    return Array.from(
      new Set(
        data.filter((d) => d.product === product).map((d) => d.horizon_days),
      ),
    ).sort((a, b) => a - b);
  }, [product]);

  const availableProducts = useMemo(() => {
    return Array.from(new Set(data.map(d => d.product))).sort((a, b) => a - b)
  }, [])


  return (
    <div className="min-h-screen bg-linear-to-br from-slate-100 to-slate-200 p-8">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Inventory Optimization Dashboard
          </h1>
          <p className="text-gray-500">
            Compare forecasting models and evaluate cost efficiency
          </p>
        </div>

        {/* Control Panel */}
        <div className="bg-white p-6 rounded-2xl shadow border flex flex-wrap gap-6 items-center">

          <ProductSelector
            value={product}
            onChange={setProduct}
            options={availableProducts}
          />

          <HorizonSelector
            value={horizon}
            onChange={setHorizon}
            options={availableHorizons}
          />

          {productMeta && (
            <div className="ml-auto bg-blue-50 px-5 py-3 rounded-xl">
              <p className="text-sm text-gray-500">Unit Cost</p>
              <p className="text-lg font-semibold text-blue-700">
                Rs. {productMeta.cost}
              </p>
            </div>
          )}
        </div>

        {!selected ? (
          <div className="bg-white p-12 rounded-xl shadow text-center text-gray-500">
            No data available
          </div>
        ) : (
          <>
            {/* KPI Cards */}
            {businessMetrics && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                <div className="bg-blue-50 p-6 rounded-2xl shadow border">
                  <p className="text-sm text-gray-500">ML Revenue</p>
                  <p className="text-2xl font-bold text-blue-700">
                    Rs. {businessMetrics.mlRevenue.toFixed(0)}
                  </p>
                </div>

                <div className="bg-green-50 p-6 rounded-2xl shadow border">
                  <p className="text-sm text-gray-500">LSTM Revenue</p>
                  <p className="text-2xl font-bold text-green-700">
                    Rs. {businessMetrics.lstmRevenue.toFixed(0)}
                  </p>
                </div>

                <div className="bg-purple-50 p-6 rounded-2xl shadow border">
                  <p className="text-sm text-gray-500">Cost Difference</p>
                  <p className="text-2xl font-bold text-purple-700">
                    Rs. {businessMetrics.costDifference.toFixed(0)}
                  </p>
                </div>

              </div>
            )}

            {/* Model Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ModelSummaryCard
                title="ML Model"
                data={selected.ml}
                color="from-blue-500 to-blue-600"
              />
              <ModelSummaryCard
                title="LSTM Model"
                data={selected.lstm}
                color="from-green-500 to-green-600"
              />
            </div>

            {/* Comparison */}
            <div className="bg-white p-6 rounded-2xl shadow border">
              <h3 className="font-semibold text-lg mb-4 text-gray-700">
                Daily Demand Comparison
              </h3>
              <ComparisonChart
                ml={selected.ml.daily_demand}
                lstm={selected.lstm.daily_demand}
              />
            </div>

            {/* Trend */}
            <div className="bg-white p-6 rounded-2xl shadow border">
              <h3 className="font-semibold text-lg mb-4 text-gray-700">
                Predicted Demand Trend
              </h3>
              <TrendChart
                mlTrend={selected.ml.trend}
                lstmTrend={selected.lstm.trend}
              />
            </div>
          </>
        )}

      </div>
    </div>
  )
}
