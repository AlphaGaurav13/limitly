import { useState } from "react"
import axios from "axios"
import API_URL from "../config"

export default function Login({ setToken, switchToSignup, goBack }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!email || !password) {
            alert("Enter email and password");
            return;
        }
        setLoading(true);
        try {
            const res = await axios.post(
                `${API_URL}/api/auth/login`,
                { email, password }
            );
            localStorage.setItem('token', res.data.token);
            setToken(res.data.token);
        } catch(err) {
            console.error(err.response?.data);
            alert("Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                {goBack && (
                    <button className="auth-back" onClick={goBack}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                        Back
                    </button>
                )}
                <div className="auth-brand">
                    <div className="logo-text">
                        Limitly<span className="logo-dot">.</span>
                    </div>
                    <p className="auth-subtitle">Sign in to your account</p>
                </div>

               

               

                <button
                    type="button"
                    className="btn btn-google btn-full"
                    onClick={() => {
                    window.location.href =
                    `${API_URL}/api/auth/google`;
                    }}
                >
                    <img
                        src="https://www.svgrepo.com/show/475656/google-color.svg"
                    alt="Google"
                    width="20"
                    height="20"
                    />
                    Continue with Google
                    </button>

                
            </div>
        </div>
    );
}