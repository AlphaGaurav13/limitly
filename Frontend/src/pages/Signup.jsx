import { useState } from "react";
import axios from "axios";
import API_URL from "../config";

export default function Signup({ setToken, switchToLogin, goBack }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSignup = async (e) => {
        e.preventDefault();
        if (!email || !password) {
            alert("Enter email and password");
            return;
        }
        setLoading(true);
        try {
            const res = await axios.post(
                `${API_URL}/api/auth/register`,
                { email, password }
            );
            localStorage.setItem("token", res.data.token);
            setToken(res.data.token);
        } catch (err) {
            alert(err.response?.data?.error || "Signup failed");
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
                    <p className="auth-subtitle">Create your account</p>
                </div>

                <form className="auth-form" onSubmit={handleSignup}>
                    <div className="form-group">
                        <label htmlFor="signup-email">Email</label>
                        <input
                            id="signup-email"
                            className="form-input"
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            autoComplete="email"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="signup-password">Password</label>
                        <input
                            id="signup-password"
                            className="form-input"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoComplete="new-password"
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary btn-full"
                        disabled={loading}
                        style={{ marginTop: '8px' }}
                    >
                        {loading ? "Creating account..." : "Get Started"}
                        {!loading && <span style={{ fontSize: '1.1em' }}>→</span>}
                    </button>
                </form>

                <div className="auth-footer">
                    Already have an account?{" "}
                    <button className="auth-link" onClick={switchToLogin}>
                        Sign in
                    </button>
                </div>
            </div>
        </div>
    );
}