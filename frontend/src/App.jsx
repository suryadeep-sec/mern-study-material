import { Link, Navigate, Route, Routes } from "react-router-dom";
import Materials from "./pages/Materials";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

function ComingSoon({ title }) {
  return (
    <div className="p-10 text-center">
      <h1 className="text-2xl font-bold">{title}</h1>

      <p className="mt-3">
        Yeh page next steps mein banayenge.
      </p>

      <Link
        to="/dashboard"
        className="mt-4 inline-block text-indigo-700"
      >
        Back to Dashboard
      </Link>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={<Navigate to="/dashboard" replace />}
      />

      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />

      <Route
        path="/materials"
        element={<ComingSoon title="Study Materials" />}
      />

      <Route
        path="/materials/upload"
        element={< Materials />}
      />

      <Route
        path="/upload"
        element={<ComingSoon title="My Uploads" />}
      />

      <Route
        path="/assignments"
        element={<ComingSoon title="My Assignments" />}
      />

      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />
    </Routes>
  );
}

export default App;