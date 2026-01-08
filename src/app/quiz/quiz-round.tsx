import PolandMap from "./map";

export default function QuizRound() {

  return (
    <div className="min-h-screen bg-[#0f172a] flex flex-col items-center justify-center pb-6 font-sans">
     <div className="flex flex-col items-center justify-center w-full max-w-4xl mx-auto p-4 text-center">
  <h2 className="text-blue-500 font-bold uppercase tracking-[0.3em] text-xs mb-2">
    Quiz o rejestracjach
  </h2>
  <div className="flex items-baseline gap-3 mb-1">
    <span className="text-3xl font-mono font-black text-white tracking-tighter">
      KOD REJESTRACYJNY:
    </span>
    <span className="text-5xl font-mono font-black text-blue-500 tracking-tighter shadow-blue-500/20 drop-shadow-sm">
      WGM
    </span>
  </div>
  <h2 className="text-2xl font-mono font-black text-white tracking-tighter mb-8">
    Z jakiego województwa pochodzi ten kod?
  </h2>
  <div className="w-3/5 bg-gray-900/40 rounded-2xl border border-white/5 overflow-hidden">
    <PolandMap/>
  </div>
  
</div>
    </div>
  );
}