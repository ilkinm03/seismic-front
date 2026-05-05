import { createBrowserRouter, Navigate } from "react-router-dom";
import { AppShell } from "@/layouts/AppShell";
import { DashboardPage } from "@/pages/DashboardPage";
import { EventsPage } from "@/pages/EventsPage";
import { EventAnalysisPage } from "@/pages/EventAnalysisPage";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { WellsPage } from "@/pages/WellsPage";
import { WellDetailPage } from "@/pages/WellDetailPage";
import { FracPage } from "@/pages/FracPage";
import { StationsPage } from "@/pages/StationsPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppShell />,
    children: [
      { index: true, element: <Navigate to="/events" replace /> },
      {
        path: "dashboard",
        element: <DashboardPage />,
        handle: { crumb: "Dashboard" },
      },
      {
        path: "events",
        element: <EventsPage />,
        handle: { crumb: "Events" },
      },
      {
        path: "events/:eventId",
        element: <EventAnalysisPage />,
        handle: { crumb: "Event Analysis" },
      },
      {
        path: "wells",
        element: <WellsPage />,
        handle: { crumb: "SWD Wells" },
      },
      {
        path: "wells/:uic",
        element: <WellDetailPage />,
        handle: { crumb: "Well Detail" },
      },
      {
        path: "frac",
        element: <FracPage />,
        handle: { crumb: "Frac Jobs" },
      },
      {
        path: "stations",
        element: <StationsPage />,
        handle: { crumb: "Stations" },
      },
    ],
  },
  { path: "*", element: <NotFoundPage /> },
]);
