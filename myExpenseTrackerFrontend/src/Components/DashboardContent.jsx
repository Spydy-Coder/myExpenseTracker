import { useOutletContext } from "react-router-dom";
import TripDetails from "./TripDetails";

const DashboardContent = () => {
  const { tripRefreshKey } = useOutletContext();

  return <TripDetails refreshKey={tripRefreshKey} />;
};

export default DashboardContent;
