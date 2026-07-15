import pandas as pd


def load_sales_data(filepath: str) -> pd.DataFrame:
    """Load sales CSV and parse dates."""
    df = pd.read_csv(filepath)
    df["date"] = pd.to_datetime(df["date"])
    return df

def format_nepali_currency(amount: int) -> str:
    """Format a number using Nepali digit grouping (lakh/crore style) as a string."""
    s = str(int(amount))
    if len(s) <= 3:
        return s
    last3 = s[-3:]
    rest = s[:-3]
    parts = []
    while len(rest) > 2:
        parts.insert(0, rest[-2:])
        rest = rest[:-2]
    if rest:
        parts.insert(0, rest)
    return ",".join(parts) + "," + last3


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
def load_sales_data_from_buffer(file_obj, filename: str) -> pd.DataFrame:
    """
    Load sales data from an uploaded file (CSV or Excel).
    file_obj: file-like object (from FastAPI's UploadFile)
    filename: original filename, used to detect format
    """
    if filename.endswith(".csv"):
        df = pd.read_csv(file_obj)
    elif filename.endswith((".xlsx", ".xls")):
        df = pd.read_excel(file_obj)
    else:
        raise ValueError("Unsupported file format. Please upload .csv or .xlsx")

    df["date"] = pd.to_datetime(df["date"])
    return df


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