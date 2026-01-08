"use client";
import "../globals.css";
import { useEffect, useState } from "react";
import { useLicensePlates } from "@/hooks/use-license-plate";
import {
  Command,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

export default function Browser() {
  const [inputValue, setInputValue] = useState("");
  const [debouncedValue, setDebouncedValue] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(inputValue);
    }, 300);

    return () => clearTimeout(handler);
  }, [inputValue]);

  const searchCode =
    debouncedValue.trim().length > 0 ? debouncedValue.toUpperCase() : null;

  const isEmpty = !searchCode;

  const { data: licensePlates = [], isLoading } = useLicensePlates(searchCode);
  return (
    <div className="px-4 py-6">
     <h1 className="text-xs font-bold uppercase tracking-widest text-blue-400">Wyszukaj rejestrację po kodzie</h1>
      <Command shouldFilter={false} className="my-6 command-scroll">
        <CommandInput
          value={inputValue}
          onValueChange={setInputValue}
          placeholder="Wyszukaj..."
        />

        <CommandList>
          {isLoading && <CommandItem disabled>Ładowanie...</CommandItem>}

          {!isEmpty && licensePlates.length == 0 && (
            <CommandItem disabled>Nie znaleziono kodu rejestracji</CommandItem>
          )}

          {licensePlates.map((plate) => (
            <CommandItem key={plate.code} value={plate.code}>
              <div className="flex flex-col">
                <span className="font-semibold">{plate.code}</span>
                <span className="text-sm opacity-80">
                  {plate.voivodeship} · {plate.district}
                </span>
                <span className="text-xs italic">{plate.type}</span>
              </div>
            </CommandItem>
          ))}
        </CommandList>
      </Command>
    </div>
  );
}
