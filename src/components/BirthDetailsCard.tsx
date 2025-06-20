import { formatInTimeZone } from 'date-fns-tz';

// Define the structure of the props this component expects
interface BirthDetailsCardProps {
  birthDateTimeUTC: string;
  latitude: number;
  longitude: number;
  timezone: string;
}

export default function BirthDetailsCard({
  birthDateTimeUTC,
  latitude,
  longitude,
  timezone,
}: BirthDetailsCardProps) {

  // --- DIAGNOSTIC LOGGING ---
  // This will print the exact values to your browser's console before we try to use them.
  console.log("--- Inside BirthDetailsCard Component ---");
  console.log("Received birthDateTimeUTC:", birthDateTimeUTC);
  console.log("Type of birthDateTimeUTC:", typeof birthDateTimeUTC);
  console.log("Received timezone:", timezone);
  console.log("Type of timezone:", typeof timezone);
  // --- END DIAGNOSTIC LOGGING ---

  // We will now wrap the dangerous code in a try...catch block
  // to prevent the app from crashing and see the error more clearly.
  let formattedBirthDate = 'Error: Could not format date.';
  try {
    const dateObject = new Date(birthDateTimeUTC);

    // This checks if the date string was successfully parsed
    if (isNaN(dateObject.getTime())) {
      throw new Error(`Failed to parse the date string: "${birthDateTimeUTC}"`);
    }

    formattedBirthDate = formatInTimeZone(
      dateObject,
      timezone,
      'yyyy-MM-dd HH:mm'
    );
  } catch (error) {
      console.error("ERROR during date formatting:", error);
  }

  return (
    <div className="bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-700">
      <h2 className="text-center font-serif text-2xl text-fuchsia-400 mb-4">
        Birth Details
      </h2>
      <div className="text-left text-gray-300 space-y-2">
        <p>
          <span className="font-bold">Date & Time:</span> {formattedBirthDate}
        </p>
        <p>
          <span className="font-bold">Location:</span> Lat: {latitude.toFixed(4)}, Lon: {longitude.toFixed(4)}
        </p>
         <p>
          <span className="font-bold">Timezone:</span> {timezone}
        </p>
      </div>
    </div>
  );
}