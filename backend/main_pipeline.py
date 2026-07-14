import os
from dotenv import load_dotenv
from groq import Groq

from data_functions import (
    load_sales_data,
    get_top_product,
    get_total_sales,
    get_sales_trend,
    format_nepali_currency,
)
from query_router import route_query

load_dotenv()
client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

DF = load_sales_data("sample_data/sales.csv")

FUNCTION_MAP = {
    "get_top_product": get_top_product,
    "get_total_sales": get_total_sales,
    "get_sales_trend": get_sales_trend,
}

NARRATION_SYSTEM_PROMPT = """You are a business assistant. Convert the given data into ONE natural, fluent Nepali sentence answering the question.
Write entirely in Nepali (translate all words, including "quantity" as "थान/वटा", "product" as "उत्पादन", etc).
You MUST use the exact numeric digits and product names as given in the data — do not recalculate or change them, but you may write them in Nepali digits (०-९) if that reads more naturally.
Do NOT add any information that isn't in the data."""

def answer_question(question: str) -> dict:
    routed = route_query(question)

    if "error" in routed:
        return {"error": routed["error"], "stage": "routing"}

    func_name = routed["function"]
    args = routed["arguments"]

    if func_name not in FUNCTION_MAP:
        return {"error": f"Unknown function: {func_name}", "stage": "execution"}

    try:
        if func_name == "get_sales_trend":
            result = get_sales_trend(DF)
        else:
            result = FUNCTION_MAP[func_name](DF, **args)
    except Exception as e:
        return {"error": f"Execution failed: {str(e)}", "stage": "execution"}

# Pre-format currency values in Python so the LLM never touches raw digits
    display_data = dict(result)
    for key in ("value", "total_sales"):
        if key in display_data and result.get("metric") != "quantity":
            display_data[key] = format_nepali_currency(display_data[key]) + " रुपैयाँ"

    # Special case: sales trend has amounts as dict values, not a single field
    if func_name == "get_sales_trend":
        display_data = {
            period: format_nepali_currency(amount) + " रुपैयाँ"
            for period, amount in result.items()
        }

    narration_response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {"role": "system", "content": NARRATION_SYSTEM_PROMPT},
            {"role": "user", "content": f"प्रश्न: {question}\n\nडाटा: {display_data}"}
        ]
    )

    answer_text = narration_response.choices[0].message.content

    return {
        "question": question,
        "function_used": func_name,
        "raw_data": result,
        "answer": answer_text
    }


if __name__ == "__main__":
    test_questions = [
        "गत महिना सबैभन्दा धेरै बिक्री भएको उत्पादन कुन हो?",
        "जुनको कुल बिक्री कति भयो?",
        "बिक्रीको ट्रेन्ड कस्तो छ?",
    ]

    for q in test_questions:
        result = answer_question(q)
        print(f"\nQ: {q}")
        if "error" in result:
            print(f"ERROR at stage '{result.get('stage')}': {result.get('error')}")
        else:
            print(f"Function: {result.get('function_used')}")
            print(f"Raw data: {result.get('raw_data')}")
            print(f"Answer: {result.get('answer')}")
        print("-" * 60)