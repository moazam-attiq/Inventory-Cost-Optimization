export interface ModelData {
  daily_demand: number
  eoq: number
  rop: number
  trend: number[]
}

export interface PredictionItem {
  store: number
  product: number
  horizon_days: number
  ml: ModelData
  lstm: ModelData
}