# index.py

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
import json # Make sure json is imported for pretty printing (if you want to keep that print)

# Load environment variables from .env.local
load_dotenv(find_dotenv(filename=".env.local"))

# Initialize the OpenAI Client
client = OpenAI() # Using 'client' as the variable name

# --- Pydantic Models ---
class BirthData(BaseModel):
    birthDate: str
    birthTime: str
    latitude: float
    longitude: float
    timezone: str

class TarotInterpretationRequest(BaseModel):
    card_name: str
    card_meaning_upright: str
    user_sun_sign: str

# --- FastAPI Application Setup ---
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # REMEMBER TO CHANGE THIS TO YOUR VERCEL FRONTEND URL IN PRODUCTION!
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

# --- RESTORED LOGIC FOR /interpret-tarot ---
@app.post("/interpret-tarot")
async def interpret_tarot(request: TarotInterpretationRequest):
    try:
        prompt = f"""You are a mystical guide for an astrology app.
        The user's sun sign is {request.user_sun_sign}.
        The tarot card drawn is "${request.card_name}".
        Its upright meaning is: "${request.card_meaning_upright}".

        Provide a concise (2-3 sentences), insightful, and encouraging daily interpretation that blends the card's meaning with the general characteristics of a {request.user_sun_sign} individual.
        Start directly with the interpretation, without phrases like "Your card today is...".
        """
        # (Optional Debug Prints for Tarot)
        # print("\n--- OpenAI Tarot Prompt ---")
        # print(prompt)
        # print("---------------------------\n")

        chat_completion = client.chat.completions.create( # Use 'client' as defined globally
            messages=[{"role": "user", "content": prompt}],
            model='gpt-3.5-turbo', # Or 'gpt-4o' if you prefer
            max_tokens=150,
        )

        interpretation = chat_completion.choices[0].message.content
        
        # (Optional Debug Prints for Tarot)
        # print("\n--- OpenAI Raw Tarot Completion Response ---")
        # print(chat_completion)
        # print("-------------------------------------------\n")
        # print(f"Interpretation content: '{interpretation}'")

        if not interpretation:
            raise ValueError("OpenAI returned no interpretation content.")

        return {"interpretation": interpretation}

    except Exception as e:
        traceback.print_exc()
        # (Optional Debug Print for Error)
        # print(f"Error in /interpret-tarot Python endpoint: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to generate tarot interpretation: {str(e)}")
# --- END RESTORED LOGIC FOR /interpret-tarot ---

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
            "birthDateTimeUTC": aware_dt.astimezone(pytz.utc).isoformat(),
            "latitude": data.latitude,
            "longitude": data.longitude,
            "ascendant": ascendant_data,
            "midheaven": midheaven_data,
            "houseCusps": house_cusps_data,
            "planets": planets_data,        }
        return natal_chart_details
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

# --- MODIFIED: Daily Horoscope Endpoint to return Ephemeris Data (full working version) ---
@app.get("/daily-horoscope")
async def get_daily_horoscope():
    try:
        fixed_lat = 34.0522 # Example: Los Angeles Latitude
        fixed_lng = -118.2437 # Example: Los Angeles Longitude
        fixed_tz = "America/Los_Angeles" # Example: Los Angeles Timezone

        now_local = datetime.now(pytz.timezone(fixed_tz))

        transits_subject = AstrologicalSubject(
            name="Current Sky",
            year=now_local.year,
            month=now_local.month,
            day=now_local.day,
            hour=now_local.hour,
            minute=now_local.minute,
            lat=fixed_lat,
            lng=fixed_lng,
            tz_str=fixed_tz
        )
        
        # (Optional Debug Prints for Ephemeris Data Generation - remove if no longer needed)
        # print("\n--- Kerykeion Transits Subject Debugging ---")
        # print(f"AstrologicalSubject created: {transits_subject is not None}")
        # if transits_subject:
        #     print(f"Type of transits_subject: {type(transits_subject)}")
        #     print(f"Transits Subject Name: {transits_subject.name}")
        #     print(f"Raw Sun Object: {transits_subject.sun}")
        #     if transits_subject.sun:
        #         print(f"Sun Name: {transits_subject.sun.name}, Position: {transits_subject.sun.position}, Sign: {transits_subject.sun.sign}")
        #         print(f"Formatted Sun: {format_astro_point(transits_subject.sun)}")
        #     else:
        #         print("WARNING: transits_subject.sun is None!")
        # else:
        #     print("ERROR: AstrologicalSubject failed to create!")
        # print("----------------------------------------------\n")

        # Extract and format ephemeris data similar to natal chart details
        planets_data = [format_astro_point(p) for p in [
            transits_subject.sun, transits_subject.moon, transits_subject.mercury,
            transits_subject.venus, transits_subject.mars, transits_subject.jupiter,
            transits_subject.saturn, transits_subject.uranus, transits_subject.neptune,
            transits_subject.pluto
        ]]
        house_cusps_data = [format_astro_point(h) for h in [
            transits_subject.first_house, transits_subject.second_house, transits_subject.third_house,
            transits_subject.fourth_house, transits_subject.fifth_house, transits_subject.sixth_house,
            transits_subject.seventh_house, transits_subject.eighth_house, transits_subject.ninth_house,
            transits_subject.tenth_house, transits_subject.eleventh_house, transits_subject.twelfth_house
        ]]
        ascendant_data = format_astro_point(transits_subject.ascendant)
        midheaven_data = format_astro_point(transits_subject.medium_coeli)

        ephemeris_details = {
            "birthDateTimeUTC": now_local.astimezone(pytz.utc).isoformat(),
            "latitude": fixed_lat,
            "longitude": fixed_lng,
            "ascendant": ascendant_data,
            "midheaven": midheaven_data,
            "houseCusps": house_cusps_data,
            "planets": planets_data,
        }
        # (Optional Debug Prints for Full Ephemeris JSON)
        # print("\n--- Raw Ephemeris Data (before OpenAI prompt) ---")
        # print(json.dumps(ephemeris_details, indent=2))
        # print("---------------------------------------------------\n")

        # Prepare transit strings for the AI prompt (Corrected variable name: transits_subject)
        transit_strings = []
        for planet in [transits_subject.sun, transits_subject.moon, transits_subject.mercury,
                       transits_subject.venus, transits_subject.mars, transits_subject.jupiter,
                       transits_subject.saturn, transits_subject.uranus, transits_subject.neptune,
                       transits_subject.pluto]:
            # Guard against None objects if Kerykeion failed to produce them
            if planet:
                retro = " (Retrograde)" if getattr(planet, 'retrograde', False) else ""
                transit_strings.append(f"{planet.name} in {planet.sign}{retro}")
            else:
                transit_strings.append(f"Unknown Planet") # Or log a warning

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
        
        return {
            "horoscope": sophia_response,
            "ephemeris_data": ephemeris_details # Ensure this is still returned
        }
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

handler = app