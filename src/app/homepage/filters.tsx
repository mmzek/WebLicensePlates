"use client";
import { useVoivodeships } from "@/hooks/use-voivodeships";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export interface FiltersProps {
  selectedVoivodeship: string | null;
  onSelectVoivodeship: (val: string) => void;
}

export default function Filters({ selectedVoivodeship, onSelectVoivodeship }: FiltersProps) {
  const { data: voivodeship = [] } = useVoivodeships();
  return (
    <div className="w-full px-4">
      <h1 className="text-xs font-bold uppercase tracking-widest text-blue-400">
        Przeglądaj rejestracje
      </h1>
      <ToggleGroup
        type="single"
        variant="outline"
        className="grid grid-cols-2 gap-4 w-full my-6"
        value={selectedVoivodeship || ""}
        onValueChange={(value) => {
          if (value) onSelectVoivodeship(value);
        }}
      >
        {voivodeship.map((v) => (
          <ToggleGroupItem
            value={v.name}
            key={v.voivodeshipId}
            className="!rounded-xl bg-background text-foreground filter text-white/70"
          >
            {v.name}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  );
}
