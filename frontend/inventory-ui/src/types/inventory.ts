export interface ModelResult {
  daily_demand: number
  eoq: number
  rop: number
  trend: number[] // added to show demand trend in the chart
}

export interface PredictionEntry {
  store: number
  product: number
  horizon_days: number
  ml: ModelResult
  lstm: ModelResult
}
