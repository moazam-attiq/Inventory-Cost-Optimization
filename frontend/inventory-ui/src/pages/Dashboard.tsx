import { useMemo, useState } from "react";
import predictions from "../data/predictions.json";
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

  const availableHorizons = useMemo(() => {
    return Array.from(
      new Set(
        data.filter((d) => d.product === product).map((d) => d.horizon_days),
      ),
    ).sort((a, b) => a - b);
  }, [product]);

  const availableProducts = useMemo(() => {
    return Array.from(new Set(data.map(d => d.product))).sort((a, b) => a - b);
    }, []);


  return (
    <div className="p-8 space-y-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 text-center">
        Inventory Cost Optimization Dashboard
      </h1>

      {/* Selectors */}
      <div className="flex flex-wrap justify-center gap-6">
        <ProductSelector value={product} onChange={setProduct} options={availableProducts} />
        <HorizonSelector
          value={horizon}
          onChange={setHorizon}
          options={availableHorizons}
        />
      </div>

      {!selected ? (
        <div className="flex justify-center items-center h-screen">
          <p className="text-gray-500 text-lg">No data available</p>
        </div>
      ) : (
        <>
          {/* Selected Info */}
          <p className="text-center text-gray-600">
            Showing results for{" "}
            <span className="font-semibold">Product {product}</span> over{" "}
            <span className="font-semibold">{horizon} days</span>
          </p>
          
          {/* Model Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <ModelSummaryCard
              title="ML Model"
              data={selected.ml}
              color="from-blue-400 to-blue-600"
            />
            <ModelSummaryCard
              title="LSTM Model"
              data={selected.lstm}
              color="from-green-400 to-green-600"
            />
          </div>

          {/* Comparison Chart */}
          <div className="bg-white p-6 rounded-lg shadow">
            <ComparisonChart
              ml={selected.ml.daily_demand}
              lstm={selected.lstm.daily_demand}
            />
          </div>

        <h2 className="font-semibold text-lg mt-6">Predicted Demand Trend</h2>
        <TrendChart mlTrend={selected.ml.trend} lstmTrend={selected.lstm.trend} />
        </>
      )}
    </div>
  );
}
