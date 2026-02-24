import sys
import os

PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(PROJECT_ROOT)

# import json
# import joblib
# import numpy as np
# import pandas as pd
# from tensorflow.keras.models import load_model
# from utils.eoq import calculate_eoq, calculate_reorder_point

# # Load models
# ml_model = joblib.load("models/lightgbm_model.pkl")
# lstm_model = load_model("models/lstm_model.keras")

# df = pd.read_csv("data/processed/feature_data.csv")

# WINDOW = 60
# ORDERING_COST = 500
# HOLDING_COST = 50
# LEAD_TIME = 7

# output = []

# print(ml_model.feature_name_)
# for (store, item), group in df.groupby(["store", "item"]):

#     # ML prediction
    # FEATURES = ml_model.feature_name_
#     latest_row = group.tail(1)[FEATURES]
#     ml_pred = ml_model.predict(latest_row)[0]



#     # LSTM prediction
#     sales = group["sales"].values[-WINDOW:].reshape(1, WINDOW, 1)
#     lstm_pred = lstm_model.predict(sales)[0][0]

#     for horizon in [7, 14, 30]:
#         annual_ml = ml_pred * 365
#         annual_lstm = lstm_pred * 365

#     output.append({
#         "store": int(store),
#         "product": int(item),
#         "horizon_days": int(horizon),

#         "ml": {
#             "daily_demand": float(ml_pred),
#             "eoq": float(calculate_eoq(annual_ml, ORDERING_COST, HOLDING_COST)),
#             "rop": float(calculate_reorder_point(ml_pred, LEAD_TIME, 20))
#         },

#         "lstm": {
#             "daily_demand": float(lstm_pred),
#             "eoq": float(calculate_eoq(annual_lstm, ORDERING_COST, HOLDING_COST)),
#             "rop": float(calculate_reorder_point(lstm_pred, LEAD_TIME, 20))
#         }
#     })

# with open("data/outputs/predictions.json", "w") as f:
#     json.dump(output, f, indent=2)

# print("predictions.json generated")

import sys
import os
import json
import joblib
import numpy as np
import pandas as pd
from tensorflow.keras.models import load_model
from utils.eoq import calculate_eoq, calculate_reorder_point

PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(PROJECT_ROOT)

# Load models
ml_model = joblib.load("models/lightgbm_model.pkl")
lstm_model = load_model("models/lstm_model.keras")

df = pd.read_csv("data/processed/feature_data.csv")

WINDOW = 60
ORDERING_COST = 500
HOLDING_COST = 50
LEAD_TIME = 7

output = []

FEATURES = ml_model.feature_name_


for (store, item), group in df.groupby(["store", "item"]):
    group = group.reset_index(drop=True)
    
    # ML trend prediction
    ml_trend = []
    latest_row = group.tail(1)[FEATURES].copy()
    for day in range(30):  # max horizon, will slice later
        pred = ml_model.predict(latest_row)[0]
        ml_trend.append(float(pred))
        
        # update lag features for next day
        latest_row = latest_row.copy()
        latest_row["sales_lag_1"] = pred
        latest_row["sales_lag_7"] = latest_row["sales_lag_7"]  # keep static for simplicity
        latest_row["sales_lag_14"] = latest_row["sales_lag_14"]
        latest_row["sales_lag_30"] = latest_row["sales_lag_30"]

    # LSTM trend prediction
    sales_series = group["sales"].values[-WINDOW:].reshape(1, WINDOW, 1)
    lstm_trend = []
    temp_series = sales_series.copy()
    for day in range(30):
        pred = lstm_model.predict(temp_series)[0][0]
        lstm_trend.append(float(pred))
        # update the sequence for next day
        temp_series = np.roll(temp_series, -1)
        temp_series[0, -1, 0] = pred

    # Now, for horizons 7, 14, 30
    for horizon in [7, 14, 30]:
        annual_ml = np.mean(ml_trend[:horizon]) * 365
        annual_lstm = np.mean(lstm_trend[:horizon]) * 365

        output.append({
            "store": int(store),
            "product": int(item),
            "horizon_days": horizon,

            "ml": {
                "daily_demand": float(ml_trend[0]),
                "eoq": calculate_eoq(annual_ml, ORDERING_COST, HOLDING_COST),
                "rop": calculate_reorder_point(ml_trend[0], LEAD_TIME, 20),
                "trend": ml_trend[:horizon]
            },

            "lstm": {
                "daily_demand": float(lstm_trend[0]),
                "eoq": calculate_eoq(annual_lstm, ORDERING_COST, HOLDING_COST),
                "rop": calculate_reorder_point(lstm_trend[0], LEAD_TIME, 20),
                "trend": lstm_trend[:horizon]
            }
        })

# Save to JSON
with open("data/outputs/predictions.json", "w") as f:
    json.dump(output, f, indent=2)

print("predictions.json with trends generated successfully!")
