'use client';

export default function NatalChartPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-900">
      <div className="w-full max-w-lg text-center">
        <h1 className="font-serif text-5xl font-bold mb-2 text-transparent bg-clip-text bg-mystic-gradient">
          Your Cosmic Blueprint
        </h1>
        <p className="text-gray-400 mb-8">
          To reveal your chart, Sophia needs to know when and where your journey began.
        </p>

        <div className="bg-gray-800 p-8 rounded-2xl shadow-xl space-y-6">
          {/* We will replace this with a real form and your natal chart engine */}
          <p className="text-gray-400">
            A beautiful form for Birth Date, Birth Time, and Birth Location will go here.
          </p>
          <button
            type="button"
            className="w-full font-sans font-bold text-white px-8 py-3 rounded-full bg-button-gradient hover:bg-button-gradient-hover transition-all duration-300 ease-in-out shadow-lg shadow-brand-red/20"
          >
            Calculate My Chart
          </button>
        </div>
      </div>
    </div>
  );
}