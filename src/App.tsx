import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
} from "react-router-dom";
import "./App.css";
import { Login } from "./components/Login/Login";
import { Resturant } from "./components/Resturant/Resturant";
import { useState, useEffect } from "react";
import { Sign } from "./components/Sign/Sign";
import { Admin } from "./components/Admin/Admin";

function App() {
  const [theme] = useState(localStorage.getItem("theme") || "light");
  const [token, setToken] = useState(localStorage.getItem("accessToken"));

  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <Router>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-all">
        <Routes>
          <Route path="/" element={<Navigate to="/menu" />} />
          <Route path="/menu" element={<Resturant />} />
          <Route path="/sign" element={<Sign />} />
          <Route
            path="/admin"
            element={token ? <Admin /> : <Navigate to="/menu" />}
          />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
