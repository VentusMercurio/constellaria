from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# This is our main FastAPI application instance
app = FastAPI()

# This is important for allowing our Next.js frontend (on localhost:3000)
# to make requests to this Python API.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allows all origins
    allow_credentials=True,
    allow_methods=["*"], # Allows all methods
    allow_headers=["*"], # Allows all headers
)

# This defines our main API endpoint.
# When someone visits our API's root URL, this function will run.
@app.get("/")
def read_root():
    return {"message": "Welcome to the Constellaria Celestial Engine"}

# When we deploy, Vercel will use this 'handler' variable to run our app.
handler = app