import DashboardClient from "./DashboardClient";
import { Suspense } from "react";

export default function Dashboard() {
  return (
    <Suspense
      fallback={
        <div className="skeleton-container">
          <div className="skeleton-button-container">
            <div className="skeleton-button"></div>
          </div>
          <div className="skeleton-greeting"></div>
          <div className="skeleton-button"></div>
        </div>
      }
    >
      <DashboardClient />
    </Suspense>
  );
}
