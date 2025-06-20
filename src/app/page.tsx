import Link from 'next/link';

export default function LandingPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-8 text-center bg-gray-900">
      
      <div className="z-10 max-w-2xl w-full">
        <h1 className="text-6xl md:text-8xl font-serif font-bold text-transparent bg-clip-text bg-mystic-gradient mb-4 bg-200% animate-shimmer">
          Constellaria
        </h1>        
        <p className="font-sans text-lg md:text-xl text-gray-300 mb-8">
          Welcome, Seeker. Discover the wisdom of the cosmos, personalized for you.
          Sophia, your oracle, awaits to bridge the gap between the stars and your story.
        </p>

        {/* --- THE FINAL, CORRECTED BUTTON STRUCTURE --- */}

        {/* This div is now the animation container. It's rounded and clips the overflow. */}
        <div className="shiny-button inline-block">
          <Link 
            href="/register"
            className="block font-sans font-bold text-white px-8 py-4 bg-button-gradient hover:bg-button-gradient-hover transition-all duration-300 ease-in-out shadow-lg shadow-brand-red/20 transform hover:scale-105 rounded-full"
          >
            Begin Your Journey
          </Link>
        </div>
        
      </div>

    </main>
  );
}