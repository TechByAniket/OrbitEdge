import os
from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv()

url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")

if not url or not key:
    print("Missing SUPABASE_URL or SUPABASE_KEY")
    exit(1)

try:
    print(f"Connecting to Supabase at: {url}")
    supabase: Client = create_client(url, key)
    # Perform a simple check by attempting to access a table or checking auth
    # Since we might not have tables yet, let's just make a very basic request.
    response = supabase.table("properties").select("count", count="exact").limit(1).execute()
    print("Connection successful!")
    print(f"Response: {response}")
except Exception as e:
    print(f"Connection failed: {e}")
