"use client";
import Image from "next/image";
import { useLicensePlateDetails } from "@/hooks/use-license-plates-details";
import { useEffect, useState, useTransition } from "react";

export interface LicensePlateDetailsProps {
  selectedPlate: string | null;
}

export default function LicensePlateDetails({ selectedPlate }: LicensePlateDetailsProps) {
  const { data: plate, isLoading } = useLicensePlateDetails(selectedPlate);
  const [isAnimating, setIsAnimating] = useState(false);
  const [, startTransition] = useTransition();

  useEffect(() => {
    if (selectedPlate) {
      startTransition(() => {
        setIsAnimating(true);
      });
      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, 1000);

      return () => clearTimeout(timer);
    } else {
      startTransition(() => {
        setIsAnimating(false);
      });
    }
  }, [selectedPlate]);

  const shouldShowPlaceholder = !selectedPlate || isLoading || isAnimating;
  return (
    <div className="w-3/4 h-full overflow-y-auto p-6 bg-background command-scroll">
      {(shouldShowPlaceholder || selectedPlate== null || selectedPlate == "") && (
        <div className="flex h-full w-full items-center justify-center">
          <Image
            src="/wariat-rejestracja.png"
            alt="background placeholder"
            width={400}
            height={400}
            className="relative w-1/2 object-contain animate-breath"
          />
        </div>
      )}
      {!shouldShowPlaceholder && plate && (
        <div>
          <div className="flex justify-between items-start mb-6">
            <div>
              <div className="py-4">
                <span className="text-l text-white/30 font-bold uppercase tracking-widest">
                  Kod rejestracji
                </span>
              </div>
              <div className="relative group w-1/4 pb-4">
                <div className="absolute -inset-1 bg-black/20 rounded-lg blur-md group-hover:blur-xl transition-all"></div>
                <div className="relative flex items-center bg-white border-3 border-gray-400 rounded-lg px-6 py-1 min-w-[320px]">
                  <div className="absolute left-0 top-0 bottom-0 w-15 bg-blue-400 rounded-l-[5px] flex flex-col items-center justify-between py-2 text-white">
                    <span className="text-xl absolute bottom-2 font-bold">PL</span>
                  </div>
                  <h2 className="w-full text-center text-7xl font-mono font-bold mt-1 tracking-tighter text-black">
                    {plate.code}
                  </h2>
                </div>
              </div>
            </div>
            <div className="bg-white/5 px-4 py-1 rounded-full border border-white/10">
              <span className="text-2xl text-white/50 uppercase">
                👁 {plate.numberOfViews}
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-4">
            <div>
              <p className="text-sm uppercase text-white/30 font-semibold">
                Województwo
              </p>
              <p className="text-2xl pl-6 text-white/90">{plate.district.voivodeship.name}</p>
            </div>
            <div>
              <p className="text-sm uppercase text-white/30 font-semibold">
                Powiat
              </p>
              <p className="text-2xl pl-6 capitalize text-white/90">
                {plate.district.name}
              </p>
            </div>
            <div className="col-span-2">
              <p className="text-sm uppercase text-white/30 font-semibold">
                Typ rejestracji
              </p>
              <p className="text-2xl pl-6 text-blue-200/80 italic">{plate.type.type}</p>
            </div>
          </div>

          {Array.isArray(plate.funFacts) && plate.funFacts.length > 0 && (
            <div className="bg-white/5 rounded-3xl p-6 border border-white/5 space-y-4 mt-6">
              <div className="flex items-center gap-2">
                <h3 className="text-xl uppercase font-black text-blue-400">
                  Czy wiesz że?
                </h3>
              </div>
              
              {plate.funFacts.map((fact, index) => (
                <div key={index} className="flex flex-col md:flex-row gap-6">
                  {fact.imageUrl && (
                    <div className="relative w-full md:w-48 h-32 bg-white/10 rounded-xl overflow-hidden border border-white/10 flex-shrink-0">
                      <Image 
                        src={fact.imageUrl} 
                        alt="Ciekawostka" 
                        fill 
                        className="object-cover" 
                      />
                    </div>
                  )}
                  <div className="flex flex-col justify-center">
                    <p className="text-lg leading-relaxed text-white/70 italic font-serif">
                      &quot;{fact.description}&quot;
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}