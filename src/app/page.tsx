"use client"
import PlatesList from "./homepage/plates-list";
import { useState } from "react";
import SideBar from "./homepage/sidebar";

export default function HomePage() {
  const [selectedVoivodeship, setSelectedVoivodeship] = useState("");
  return (
    <div className="w-screen flex h-screen w-full overflow-hidden">
      <SideBar selected={selectedVoivodeship} onSelect={setSelectedVoivodeship} />
      <PlatesList voivodeship = {selectedVoivodeship}/>
    </div>
  );
}
