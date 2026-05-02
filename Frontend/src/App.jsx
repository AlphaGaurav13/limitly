import { useState } from "react";
import Analytics from "./pages/Analytics";
import Login from "./pages/login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/dashboard";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [showSignup, setShowSignup] = useState(false);
  const [selectedApiKey, setselectedApiKey] = useState(null);

  

  if(!token) {
    return showSignup ? (
    <Signup setToken={setToken} switchToLogin={() => setShowSignup(false)} />
    ) : (
    <Login setToken={setToken} switchToSignup={() => setShowSignup(true)} />
    );
  }


  if(selectedApiKey) {
    return (
      <Analytics apiKey={selectedApiKey} goBack={() => setselectedApiKey(null)}/>
    );
  }
  
    return <Dashboard token={token} setToken={setToken} goToAnalytics={setselectedApiKey}/>;
  
    
}

export default App;