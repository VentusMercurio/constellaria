from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime
import pytz
import traceback

# Import the correct main class
from kerykeion import AstrologicalSubject

# --- Pydantic Models ---
class BirthData(BaseModel):
    birthDate: str
    birthTime: str
    latitude: float
    longitude: float
    timezone: str

# --- FastAPI Application Setup ---
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Helper Function ---
def format_astro_point(planet_object):
    # THE FIX IS HERE: We now calculate degreeInSign ourselves.
    degree_in_sign = planet_object.position % 30
    return {
        "name": planet_object.name,
        "longitude": planet_object.position,
        "sign": planet_object.sign,
        "degreeInSign": degree_in_sign, # Using our calculated value
        "formattedPosition": f"{degree_in_sign:.2f}° {planet_object.sign}",
        "house": getattr(planet_object, 'house', None),
        "isRetrograde": getattr(planet_object, 'retrograde', False),
    }

# --- API Endpoints ---

@app.get("/")
def read_root():
    return {"message": "Welcome to the Constellaria Celestial Engine"}

@app.post("/calculate-chart")
def calculate_natal_chart(data: BirthData):
    try:
        # 1. Localize the datetime object
        tz = pytz.timezone(data.timezone)
        dt_str = f"{data.birthDate} {data.birthTime}"
        local_dt = datetime.strptime(dt_str, "%Y-%m-%d %H:%M")
        aware_dt = tz.localize(local_dt)

        # 2. Create an instance of AstrologicalSubject
        subject = AstrologicalSubject(
            name="Seeker",
            year=aware_dt.year, month=aware_dt.month, day=aware_dt.day,
            hour=aware_dt.hour, minute=aware_dt.minute,
            lat=data.latitude, lng=data.longitude, tz_str=data.timezone
        )

        # 3. Format the data by manually creating the lists
        planets_to_process = [
            subject.sun, subject.moon, subject.mercury, subject.venus,
            subject.mars, subject.jupiter, subject.saturn, subject.uranus,
            subject.neptune, subject.pluto
        ]
        planets_data = [format_astro_point(p) for p in planets_to_process]
        
        houses_to_process = [
            subject.first_house, subject.second_house, subject.third_house,
            subject.fourth_house, subject.fifth_house, subject.sixth_house,
            subject.seventh_house, subject.eighth_house, subject.ninth_house,
            subject.tenth_house, subject.eleventh_house, subject.twelfth_house
        ]
        house_cusps_data = [format_astro_point(h) for h in houses_to_process]
        
        ascendant_data = format_astro_point(subject.ascendant)
        midheaven_data = format_astro_point(subject.medium_coeli)

        # 4. Construct the final JSON response
        natal_chart_details = {
            "ascendant": ascendant_data, "midheaven": midheaven_data,
            "houseCusps": house_cusps_data, "planets": planets_data
        }
        return natal_chart_details

    except Exception as e:
        print("--- DETAILED PYTHON ERROR ---")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

# For Vercel deployment
handler = app