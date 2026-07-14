import os
import json
from dotenv import load_dotenv
from groq import Groq

load_dotenv()

client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

tools = [
    {
        "type": "function",
        "function": {
            "name": "get_top_product",
            "description": "Find the top-selling product for a given year and month, by quantity sold or by revenue.",
            "parameters": {
                "type": "object",
                "properties": {
                    "year": {"type": "integer", "description": "e.g. 2026"},
                    "month": {"type": "integer", "description": "1-12"},
                    "metric": {
                        "type": "string",
                        "enum": ["quantity", "total"],
                        "description": "quantity = units sold, total = revenue generated"
                    }
                },
                "required": ["year", "month", "metric"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "get_total_sales",
            "description": "Get total revenue for a given year, optionally filtered by month.",
            "parameters": {
                "type": "object",
                "properties": {
                    "year": {"type": "integer"},
                    "month": {"type": "integer", "description": "optional, 1-12"}
                },
                "required": ["year"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "get_sales_trend",
            "description": "Get monthly sales totals over time to show a trend.",
            "parameters": {
                "type": "object",
                "properties": {
                    "granularity": {
                        "type": "string",
                        "enum": ["month"],
                        "description": "How to group the trend data. Currently only 'month' is supported."
                    }
                },
                "required": []
            }
        }
    }
]

SYSTEM_PROMPT = """You are a query router for a Nepali business intelligence assistant.
Today's date is July 2026. "गत महिना" (last month) means June 2026. "यो महिना" (this month) means July 2026.
When a user asks about "top" or "best selling" product without specifying quantity or revenue, default metric to "quantity".
Always call exactly one function that matches the user's question."""


def route_query(question: str) -> dict:
    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": question}
            ],
            tools=tools,
            tool_choice="auto"
        )
    except Exception as e:
        return {"error": f"API call failed: {str(e)}"}

    message = response.choices[0].message

    if not message.tool_calls:
        return {"error": "No function matched", "raw_response": message.content}

    tool_call = message.tool_calls[0]
    args_str = tool_call.function.arguments

    try:
        arguments = json.loads(args_str) if args_str and args_str.strip() else {}
    except json.JSONDecodeError:
        return {"error": "Malformed arguments from model", "raw": args_str}

    return {
        "function": tool_call.function.name,
        "arguments": arguments
    }

if __name__ == "__main__":
    test_questions = [
        "गत महिना सबैभन्दा धेरै बिक्री भएको उत्पादन कुन हो?",
        "जुनको कुल बिक्री कति भयो?",
        "बिक्रीको ट्रेन्ड कस्तो छ?",
    ]

    for q in test_questions:
        print(f"\nQ: {q}")
        result = route_query(q)
        print(result)