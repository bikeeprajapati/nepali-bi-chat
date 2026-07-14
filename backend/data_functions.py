import pandas as pd


def load_sales_data(filepath: str) -> pd.DataFrame:
    """Load sales CSV and parse dates."""
    df = pd.read_csv(filepath)
    df["date"] = pd.to_datetime(df["date"])
    return df


def get_top_product(df: pd.DataFrame, year: int, month: int, metric: str = "quantity") -> dict:
    """
    Find the top-selling product for a given year/month.
    metric: 'quantity' or 'total' (revenue)
    """
    filtered = df[(df["date"].dt.year == year) & (df["date"].dt.month == month)]
    
    if filtered.empty:
        return {"product": None, "value": 0, "message": "No data for this period"}
    
    grouped = filtered.groupby("product")[metric].sum().sort_values(ascending=False)
    
    top_product = grouped.index[0]
    top_value = grouped.iloc[0]
    
    return {
        "product": top_product,
        "value": int(top_value),
        "metric": metric,
        "year": year,
        "month": month
    }


def get_total_sales(df: pd.DataFrame, year: int, month: int = None) -> dict:
    """Total revenue for a given year, optionally filtered by month."""
    filtered = df[df["date"].dt.year == year]
    if month:
        filtered = filtered[filtered["date"].dt.month == month]
    
    total = filtered["total"].sum()
    return {"total_sales": int(total), "year": year, "month": month}


def get_sales_trend(df: pd.DataFrame) -> dict:
    """Monthly sales totals, sorted chronologically."""
    trend = df.groupby(df["date"].dt.to_period("M"))["total"].sum()
    return {str(period): int(value) for period, value in trend.items()}


if __name__ == "__main__":
    df = load_sales_data("sample_data/sales.csv")
    
    print("=== Top product in June 2026 (by quantity) ===")
    print(get_top_product(df, 2026, 6, metric="quantity"))
    
    print("\n=== Top product in June 2026 (by revenue) ===")
    print(get_top_product(df, 2026, 6, metric="total"))
    
    print("\n=== Total sales June 2026 ===")
    print(get_total_sales(df, 2026, 6))
    
    print("\n=== Sales trend ===")
    print(get_sales_trend(df))