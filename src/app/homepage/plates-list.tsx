"use client";
import Image from "next/image";
import { usePlatesList } from "@/hooks/use-plates-list";
import { useEffect, useState, useTransition } from "react";

export interface PlatesListProps {
  selectedVoivodeship: string;
  onSelectPlate: (val: string) => void;
}

export default function PlatesList({
  selectedVoivodeship,
  onSelectPlate,
}: PlatesListProps) {
  const { data: platesList = [], isLoading } = usePlatesList(selectedVoivodeship);
  const [isAnimating, setIsAnimating] = useState(false);
  const [, startTransition] = useTransition();

  useEffect(() => {
    if (selectedVoivodeship) {
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
  }, [selectedVoivodeship]);

  const shouldShowPlaceholder = !selectedVoivodeship || isLoading || isAnimating;
  return (
    <div className="w-3/4 h-full overflow-y-auto p-6 bg-background command-scroll">
      {(shouldShowPlaceholder || selectedVoivodeship == null || selectedVoivodeship == "") && (
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
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 px-10 py-6">
        {platesList.map((pl) => (
          <div key={pl.code} onClick={()=>onSelectPlate(pl.code)} className="plate-card">
            <div className="flex justify-between items-start mb-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-blue-400">
                  Kod rejestracji
                </span>
                <h2 className="text-3xl font-mono font-black text-white mt-1 tracking-tighter">
                  {pl.code}
                </h2>
              </div>
              <div className="bg-white/5 px-3 py-1 rounded-full border border-white/10">
                <span className="text-[10px] text-white/50 uppercase">
                  👁 {pl.numberOfViews}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-4">
              <div>
                <p className="text-[10px] uppercase text-white/30 font-semibold">
                  Województwo
                </p>
                <p className="text-sm text-white/90">{pl.voivodeship}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase text-white/30 font-semibold">
                  Powiat
                </p>
                <p className="text-sm capitalize text-white/90">
                  {pl.district}
                </p>
              </div>
              <div className="col-span-2">
                <p className="text-[10px] uppercase text-white/30 font-semibold">
                  Typ rejestracji
                </p>
                <p className="text-sm text-blue-200/80 italic">{pl.type}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
