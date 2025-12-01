import { HashRouter as Router, Routes, Route } from "react-router-dom";
import HUDPage from "./pages/HUDPage";
import ControlPanelPage from "./pages/ControlPanelPage";
import ConnectionPage from "./pages/ConnectionPage";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HUDPage />} />
        <Route path="/control" element={<ControlPanelPage />} />
        <Route path="/connect" element={<ConnectionPage />} />
      </Routes>
    </Router>
  );
}
