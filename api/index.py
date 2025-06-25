import os
from datetime import datetime
import pytz
import traceback
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from openai import OpenAI
from dotenv import load_dotenv, find_dotenv
from kerykeion import AstrologicalSubject

# Load environment variables from .env.local
load_dotenv(find_dotenv(filename=".env.local"))

# Initialize the OpenAI Client
client = OpenAI()

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
    degree_in_sign = planet_object.position % 30
    return {
        "name": planet_object.name, "longitude": planet_object.position,
        "sign": planet_object.sign, "degreeInSign": degree_in_sign,
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
        tz = pytz.timezone(data.timezone)
        dt_str = f"{data.birthDate} {data.birthTime}"
        local_dt = datetime.strptime(dt_str, "%Y-%m-%d %H:%M")
        aware_dt = tz.localize(local_dt)
        subject = AstrologicalSubject(
            name="Seeker", year=aware_dt.year, month=aware_dt.month, day=aware_dt.day,
            hour=aware_dt.hour, minute=aware_dt.minute, lat=data.latitude,
            lng=data.longitude, tz_str=data.timezone
        )
        planets_to_process = [
            subject.sun, subject.moon, subject.mercury, subject.venus, subject.mars,
            subject.jupiter, subject.saturn, subject.uranus, subject.neptune, subject.pluto
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
        natal_chart_details = {
            # --- THESE ARE THE MISSING LINES ---
            "birthDateTimeUTC": aware_dt.astimezone(pytz.utc).isoformat(),
            "latitude": data.latitude,
            "longitude": data.longitude,
            # --- END OF MISSING LINES ---
            "ascendant": ascendant_data,
            "midheaven": midheaven_data,
            "houseCusps": house_cusps_data,
            "planets": planets_data,        }
        return natal_chart_details
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

# CORRECTED: Removed 'async' and 'await'
@app.get("/daily-horoscope")
def get_daily_horoscope():
    try:
        now = datetime.now(pytz.utc)
        transits = AstrologicalSubject(
            name="Current Sky", year=now.year, month=now.month, day=now.day,
            hour=now.hour, minute=now.minute
        )
        
        transit_strings = []
        for planet in [transits.sun, transits.moon, transits.mercury, transits.venus, transits.mars]:
            retro = " (Retrograde)" if planet.retrograde else ""
            transit_strings.append(f"{planet.name} in {planet.sign}{retro}")
        
        transit_summary = ", ".join(transit_strings)

        prompt_for_sophia = (
            "You are the oracle Sophia from the mystical app Constellaria. "
            "Based on the following planetary transits for today, write a short, "
            "insightful, and inspiring horoscope (2-3 sentences). The tone should be "
            "mystical and perfect for sharing on the social media app Threads. "
            f"Today's transits: {transit_summary}."
        )

        completion = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a wise and mystical oracle named Sophia."},
                {"role": "user", "content": prompt_for_sophia}
            ],
            temperature=0.7,
            max_tokens=150,
        )

        sophia_response = completion.choices[0].message.content
        return {"horoscope": sophia_response}
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

handler = app