import { Routes, Route } from "react-router";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import HomePage from "./pages/HomePage";
import BrowseItemsPage from "./pages/BrowseItemsPage";
import ReportFoundPage from "./pages/ReportFoundPage";
import ReportLostPage from "./pages/ReportLostPage";
import TrackStatusPage from "./pages/TrackStatusPage";
import ItemDetailsPage from "./pages/ItemDetailsPage";
import ManageFoundItemPage from "./pages/ManageFoundItemPage";

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
          <Route path="/items/:itemId" element={<ItemDetailsPage />}/>
          <Route path="/manage/:referenceCode" element={<ManageFoundItemPage />}/>
        </Routes>
      </div>

      <Footer />
    </div>
  );
}