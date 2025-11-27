import { Routes, Route } from "react-router-dom";
import MasterLayout from "./components/MasterLayout";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Reports from "./pages/Reports";

function App() {
  return (
    <MasterLayout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/users" element={<Users />} />
        <Route path="/reports" element={<Reports />} />
      </Routes>
    </MasterLayout>
  );
}

export default App
