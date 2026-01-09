"use client";
import { useRouter } from "next/navigation";
import Browser from "../homepage/browser";
import Filters from "../homepage/filters";

export interface FiltersProps {
  selected: string | null;
  onSelect: (val: string) => void;
}

export default function SideBar({ selected, onSelect }: FiltersProps) {
  const router = useRouter();
  return (
    <div className="h-full w-1/4 bg-[#1f1f1f] overflow-y-auto command-scroll">
      <h1 className="text-xs font-bold uppercase tracking-widest text-blue-400 p-4">
        Quiz o rejestracjach
      </h1>
      <div className="px-4 flex justify-center pb-4">
        <button
          className="bg-blue-400 px-4 py-2 rounded-xl text-black font-bold filter"
          onClick={() => router.push("/quiz")}
        >
          WEŹ UDZIAŁ W QUIZIE!
        </button>
      </div>
      <Browser />
      <Filters selected={selected} onSelect={onSelect} />
    </div>
  );
}
