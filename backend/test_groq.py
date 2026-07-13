import os
from dotenv import load_dotenv
from groq import Groq

load_dotenv()

client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

question = "गत महिना सबैभन्दा धेरै बिक्री भएको उत्पादन कुन हो भन्ने कुरा बुझाउने एउटा जवाफ लेख।"

response = client.chat.completions.create(
    model="llama-3.3-70b-versatile",
    messages=[
        {"role": "system", "content": "You are a helpful business assistant that responds fluently in Nepali."},
        {"role": "user", "content": question}
    ]
)

print(response.choices[0].message.content)