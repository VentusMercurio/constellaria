import Link from 'next/link';

export default function WelcomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center bg-gray-900 text-white">
      <div className="w-full max-w-lg">
        <div className="mb-8">
            <div className="w-48 h-48 mx-auto bg-gray-800 border-2 border-fuchsia-500 rounded-full flex items-center justify-center">
                <span className="text-gray-500">Sophia</span>
            </div>
        </div>
        <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">Your Pact is Sealed</h1>
        <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-md mx-auto">
          Welcome, Seeker. Your place in the cosmos is confirmed. Let us now reveal your unique stellar signature.
        </p>
        <Link href="/onboarding/natal-chart">
          <span className="font-sans font-bold text-white px-8 py-4 rounded-full bg-button-gradient hover:bg-button-gradient-hover transition-all duration-300 ease-in-out shadow-lg shadow-brand-red/20 transform hover:scale-105">
            Calculate Your Natal Chart
          </span>
        </Link>
      </div>
    </div>
  );
}