// App.js
import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Home from "./Home";
import Login from "./Login";
import Register from "./Register";

const ProtectedRoute = ({ authToken, children }) => {
  return authToken ? children : <Navigate to="/login" />;
};

const App = () => {
  const [authToken, setAuthToken] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setAuthToken(token);
    }
  }, []);

  return (
    <Router>
      <Routes>
        {/* Default route: redirect to /home or /login */}
        <Route
          path="/"
          element={
            authToken ? (
              <Home authToken={authToken} />
            ) : (
              <Login authToken={authToken} />
            )
          }
        />
        <Route
          path="/home"
          element={
            authToken ? (
              <Home authToken={authToken} />
            ) : (
              <Login authToken={authToken} />
            )
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
};

export default App;
