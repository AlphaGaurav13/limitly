import { useState } from "react";
import axios from "axios";

export default function Signup({ setToken, switchToLogin }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSignup = async () => {
        try {
            const res = await axios.post(
                "http://localhost:3000/api/auth/register",
                { email, password }
            );

            // save token
            localStorage.setItem("token", res.data.token);
            setToken(res.data.token);

        } catch (err) {
            alert(err.response?.data?.error || "Signup failed");
        }
    };

    return (
        <div style={{ padding: "50px" }}>
            <h2>Signup</h2>

            <input
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
            />

            <br /><br />

            <input
                type="password"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
            />

            <br /><br />

            <button onClick={handleSignup}>Signup</button>

            <br /><br />

            <p>
                Already have an account?{" "}
                <button onClick={switchToLogin}>Login</button>
            </p>
        </div>
    );
}