import { Navigate, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

function App() {
  const isAuthenticated = Boolean(
    localStorage.getItem("access_token")
  );

  return (
    <Routes>
      <Route
        path="/login"
        element={
          isAuthenticated ? (
            <Navigate to="/dashboard" />
          ) : (
            <Login />
          )
        }
      />

      <Route
        path="/dashboard"
        element={
          isAuthenticated ? (
            <Dashboard />
          ) : (
            <Navigate to="/login" />
          )
        }
      />

      <Route
        path="*"
        element={<Navigate to="/dashboard" />}
      />
    </Routes>
  );
}

export default App;