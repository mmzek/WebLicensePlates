"use client";
import { useVoivodeships } from "@/hooks/use-voivodeships";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";


export default function Filters(){

    const {data: voivodeship = [], isLoading} = useVoivodeships();
    return(<div className="w-full px-4">
        Przeglądaj rejestracje
        <ToggleGroup type="single" className="grid grid-cols-2 gap-4 w-full my-6">
            {voivodeship.map((v) => (
            <ToggleGroupItem value={v.name} key={v.voivodeshipId} className="!rounded-xl bg-background">{v.name}</ToggleGroupItem>
        ))}
</ToggleGroup>
    </div>)
}