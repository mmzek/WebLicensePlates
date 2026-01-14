"use client";
import PlatesList from "./homepage/plates-list";
import LicensePlateDetails from "./homepage/plates-details";
import { useState } from "react";
import SideBar from "./homepage/sidebar";

export default function HomePage() {
  const [selectedVoivodeship, setSelectedVoivodeship] = useState("");
  const [selectedPlate, setSelectedPlate] = useState("")
  
  const handleVoivodeshipSelect = (voivodeship: string) => {
    setSelectedVoivodeship(voivodeship);
    setSelectedPlate("");
  };

  return (
    <div className="w-screen flex h-screen w-full overflow-hidden">
      <SideBar
        selectedVoivodeship={selectedVoivodeship}
        onSelectVoivodeship={handleVoivodeshipSelect}
        onSelectPlate={setSelectedPlate}
      />
      {selectedPlate ? (
        <LicensePlateDetails 
          selectedPlate={selectedPlate} 
        />
      ) : (
        <PlatesList 
          selectedVoivodeship={selectedVoivodeship} 
          onSelectPlate={setSelectedPlate}
        />
      )}
    </div>
  );
}
