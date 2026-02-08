import math

def calculate_eoq(annual_demand, ordering_cost, holding_cost):
    """
    Economic Order Quantity (EOQ)

    annual_demand (D): units/year
    ordering_cost (S): cost per order
    holding_cost (H): cost per unit per year
    """
    if annual_demand <= 0 or ordering_cost <= 0 or holding_cost <= 0:
        return 0

    return math.sqrt((2 * annual_demand * ordering_cost) / holding_cost)


def calculate_reorder_point(avg_daily_demand, lead_time_days, safety_stock=0):
    """
    Reorder Point (ROP)
    """
    return (avg_daily_demand * lead_time_days) + safety_stock

def calculate_holding_cost(eoq, holding_cost):
    return (eoq / 2) * holding_cost


def calculate_ordering_cost(annual_demand, eoq, ordering_cost):
    return (annual_demand / eoq) * ordering_cost
