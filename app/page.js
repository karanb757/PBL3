import { Divide } from "lucide-react";
import { Button } from "../components/ui/button.jsx";
import ListingMapView from './_components/ListingMapView.jsx'

export default function Home() {
  return (
      <div className="px-5">
          <ListingMapView type='Sell'/>
      </div>
  );
}
