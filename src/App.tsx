import { Routes, Route } from "react-router";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import HomePage from "./pages/HomePage";
import BrowseItemsPage from "./pages/BrowseItemsPage";
import ReportFoundPage from "./pages/ReportFoundPage";
import ReportLostPage from "./pages/ReportLostPage";
import TrackStatusPage from "./pages/TrackStatusPage";

export default function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <div className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/browse" element={<BrowseItemsPage />} />
          <Route path="/report-found" element={<ReportFoundPage />} />
          <Route path="/report-lost" element={<ReportLostPage />} />
          <Route path="/track" element={<TrackStatusPage />} />
        </Routes>
      </div>

      <Footer />
    </div>
  );
}