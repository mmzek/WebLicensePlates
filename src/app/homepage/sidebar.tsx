import Browser from "../homepage/browser";
import Filters from "../homepage/filters";

export default function SideBar() {
  return (
    <div className="h-full w-1/4 bg-[#1f1f1f] overflow-y-auto command-scroll">
      <Browser />
      <Filters/>
    </div>
  );
}
