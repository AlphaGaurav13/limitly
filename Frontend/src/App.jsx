import { useState } from "react";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [showSignup, setShowSignup] = useState(false);

  if (token) {
    return <Dashboard token={token} setToken={setToken} />;
  }

  return showSignup ? (
  <Signup setToken={setToken} switchToLogin={() => setShowSignup(false)} />
  ) : (
  <Login setToken={setToken} switchToSignup={() => setShowSignup(true)} />
  );
}

export default App;