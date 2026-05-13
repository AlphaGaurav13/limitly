import { useState } from "react";
import "./App.css";
import Analytics from "./pages/Analytics";
import Login from "./pages/login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/dashboard";
import LandingPage from "./pages/LandingPage";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [page, setPage] = useState("landing"); // landing | login | signup
  const [selectedApiKey, setselectedApiKey] = useState(null);

  // If not logged in, show landing/login/signup
  if (!token) {
    if (page === "login") {
      return (
        <Login
          setToken={setToken}
          switchToSignup={() => setPage("signup")}
          goBack={() => setPage("landing")}
        />
      );
    }
    if (page === "signup") {
      return (
        <Signup
          setToken={setToken}
          switchToLogin={() => setPage("login")}
          goBack={() => setPage("landing")}
        />
      );
    }
    // Default: landing page
    return (
      <LandingPage
        onLogin={() => setPage("login")}
        onSignup={() => setPage("signup")}
      />
    );
  }

  // Logged in — show analytics or dashboard
  if (selectedApiKey) {
    return (
      <Analytics apiKey={selectedApiKey} goBack={() => setselectedApiKey(null)} />
    );
  }

  return <Dashboard token={token} setToken={setToken} goToAnalytics={setselectedApiKey} />;
}

export default App;