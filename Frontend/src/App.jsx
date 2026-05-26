import { useState } from "react";
import "./App.css";
import Analytics from "./pages/Analytics";
import Login from "./pages/login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/dashboard";
import LandingPage from "./pages/LandingPage";
import Docs from "./pages/Docs";
import OAuthSuccess from "./pages/OAuthSuccess";
function App() {
  // extra thing added
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [page, setPage] = useState("landing"); // landing | login | signup
  const [selectedApiKey, setselectedApiKey] = useState(null);
  const [showDocs, setShowDocs] = useState(false);
  const isOAuthSuccess = window.location.pathname === "/oauth-success";

  if (isOAuthSuccess) {
    return <OAuthSuccess setToken={setToken} />;  
  }
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

  // Logged in — show docs page
  if (showDocs) {
    return <Docs token={token} goBack={() => setShowDocs(false)} />;
  }

  // Logged in — show analytics or dashboard
  if (selectedApiKey) {
    return (
      <Analytics apiKey={selectedApiKey} goBack={() => setselectedApiKey(null)} />
    );
  }

  return (
    <Dashboard
      token={token}
      setToken={setToken}
      goToAnalytics={setselectedApiKey}
      goToDocs={() => setShowDocs(true)}
    />
  );
}

export default App;