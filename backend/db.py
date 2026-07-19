import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

client = MongoClient(os.environ.get("MONGO_URI"))
db = client["nepali_bi_chat"]
users_collection = db["users"]

# Ensure email is unique
users_collection.create_index("email", unique=True)