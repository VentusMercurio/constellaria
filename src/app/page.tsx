// src/app/page.tsx (or src/app/splash/page.tsx)
import Link from 'next/link';
import Image from 'next/image'; // <--- Import Image component
import splashBg from '../../public/images/backgrounds/splash-bg.png'; // <--- Import your image directly

export default function LandingPage() {
  return (
    // Outer div for positioning the image relative to content
    // Remove bg-splash class here
    <div className="relative min-h-screen flex flex-col items-center justify-center p-8 text-center">

      {/* The background image using next/image */}
      <Image
        src={splashBg} // Use the imported image object
        alt="Constellaria Background"
        layout="fill" // Stretches the image to fill the parent container
        objectFit="cover" // Ensures the image covers the entire area, similar to bg-cover
        quality={90} // Adjust image quality (0-100)
        className="z-0" // Place it behind other content
      />

      {/* Semi-transparent dark overlay for better text readability */}
      {/* Ensure opacity-10 (with hyphen!) if you want it very light, or opacity-50 for more darkening */}
      <div className="absolute inset-0 bg-black opacity-50 z-0"></div> {/* <--- Corrected opacity, added z-index */}

      {/* Main content - ensure it's positioned above the overlay (z-index) */}
      <main className="relative z-10 flex flex-col items-center justify-center min-h-screen p-8 text-center">
      
        <div className="z-10 max-w-2xl w-full">
          <h1 className="text-6xl md:text-8xl font-serif font-bold text-transparent bg-clip-text bg-mystic-gradient mb-4 bg-200% animate-shimmer">
            Constellaria
          </h1>        
          <p className="font-sans text-lg md:text-xl text-gray-300 mb-8">
            Welcome, Seeker. Sophia has been waiting for you.
          </p>

          <div className="shiny-button inline-block">
            <Link 
              href="/auth/register"
              className="block font-sans font-bold text-white px-8 py-4 bg-button-gradient hover:bg-button-gradient-hover transition-all duration-300 ease-in-out shadow-lg shadow-brand-red/20 transform hover:scale-105 rounded-full"
            >
              Begin Your Journey
            </Link>
          </div>
          
        </div>
      </main>
    </div>
  );
}