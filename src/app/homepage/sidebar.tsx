import Browser from "../homepage/browser";
import Filters from "../homepage/filters";

export interface FiltersProps {
  selected: string | null;
  onSelect: (val: string) => void;
}

export default function SideBar({selected, onSelect} :FiltersProps) {
  return (
    <div className="h-full w-1/4 bg-[#1f1f1f] overflow-y-auto command-scroll">
      <Browser />
      <Filters selected={selected} onSelect={onSelect}/>
    </div>
  );
}
