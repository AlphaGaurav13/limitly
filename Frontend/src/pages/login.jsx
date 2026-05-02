import { useState } from "react"

import axios from "axios"
import API_URL from "../config"

export default function Login({ setToken, switchToSignup }) {
    const [email, setEmail] = useState("");

    const [password, setPassword] = useState("");


    const handleLogin = async () => {
         if (!email || !password) {
            alert("Enter email and password");
            return;
        }
        try {
            const res = await axios.post(
                `${API_URL}/api/auth/login`,
                { email, password }
            );

            localStorage.setItem('token', res.data.token);
            setToken(res.data.token);
        }catch(err) {
            console.error(err.response?.data);
            alert("Login failed");
        }
    };


    return (
  <div
    style={{
      height: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "column",
      gap: "10px"
    }}
  >
    <h2>Login</h2>

    <input
      placeholder="Email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
    />

    <input
      placeholder="Password"
      type="password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
    />

    <button onClick={handleLogin}>Login</button>

    <p>
      Don't have an account?{" "}
      <button onClick={switchToSignup}>Signup</button>
    </p>
  </div>
);
}