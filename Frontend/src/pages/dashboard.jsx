import { useEffect, useState } from "react";
import axios from "axios";
import API_URL from "../config";
// this is me
export default function Dashboard({ token, setToken, goToAnalytics, goToDocs }) {
    const [keys, setKeys] = useState([]);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);
    const [copiedKey, setCopiedKey] = useState(null);

    const fetchKeys = async () => {
        try {
            const res = await axios.get(`${API_URL}/api/keys`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setKeys(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const generateKey = async () => {
        setGenerating(true);
        try {
            await axios.post(
                `${API_URL}/api/generate-key`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchKeys();
        } catch (err) {
            alert(err.response?.data?.error || "Failed to generate key");
        } finally {
            setGenerating(false);
        }
    };

    const deleteKey = async (key) => {
        if (!window.confirm("Are you sure you want to delete this API key?")) return;
        await axios.delete(
            `${API_URL}/api/keys/${key}`,
            { headers: { Authorization: `Bearer ${token}` } }
        );
        fetchKeys();
    };

    const copyKey = (key) => {
        navigator.clipboard.writeText(key);
        setCopiedKey(key);
        setTimeout(() => setCopiedKey(null), 2000);
    };

    useEffect(() => {
        fetchKeys();
    }, []);

    return (
        <div className="dashboard-page">
            {/* Header */}
            <header className="dashboard-header">
                <div className="logo-text">
                    Limitly<span className="logo-dot">.</span>
                </div>
                <div className="dashboard-header-actions">
                    <button
                        className="btn btn-secondary btn-sm"
                        onClick={goToDocs}
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                        </svg>
                        Docs
                    </button>
                    <button
                        className="btn btn-ghost btn-sm"
                        onClick={() => {
                            localStorage.removeItem("token");
                            setToken(null);
                        }}
                    >
                        Logout
                    </button>
                </div>
            </header>

            {/* Content */}
            <div className="dashboard-content">
                <div className="dashboard-title-row">
                    <div>
                        <h2>API Keys here are we</h2>
                        <p style={{ marginTop: '4px', fontSize: '0.9rem' }}>
                            Manage your rate-limiting API keys
                        </p>
                    </div>
                    <button
                        className="btn btn-primary"
                        onClick={generateKey}
                        disabled={generating}
                    >
                        {generating ? (
                            <>
                                <span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }}></span>
                                Generating...
                            </>
                        ) : (
                            <>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="12" y1="5" x2="12" y2="19"></line>
                                    <line x1="5" y1="12" x2="19" y2="12"></line>
                                </svg>
                                Generate Key
                            </>
                        )}
                    </button>
                </div>

                {/* Loading state */}
                {loading && (
                    <div className="loading-container">
                        <div className="spinner"></div>
                        <span className="loading-text">Loading your keys...</span>
                    </div>
                )}

                {/* Empty state */}
                {!loading && keys.length === 0 && (
                    <div className="empty-state">
                        <div className="empty-icon">🔑</div>
                        <h3 style={{ marginBottom: '8px', color: 'var(--text-secondary)' }}>No API keys yet</h3>
                        <p>Generate your first API key to start rate limiting your endpoints.</p>
                    </div>
                )}

                {/* Keys list */}
                {!loading && keys.length > 0 && (
                    <div className="keys-list">
                        {keys.map((k, index) => (
                            <div
                                key={k.key}
                                className="key-card"
                                style={{ animationDelay: `${index * 0.08}s` }}
                            >
                                <div className="key-info">
                                    <span className="key-text">{k.key}</span>
                                </div>
                                <div className="key-actions">
                                    <button
                                        className="btn btn-ghost btn-sm"
                                        onClick={() => copyKey(k.key)}
                                        title="Copy to clipboard"
                                    >
                                        {copiedKey === k.key ? (
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00e599" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                <polyline points="20 6 9 17 4 12"></polyline>
                                            </svg>
                                        ) : (
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                                            </svg>
                                        )}
                                        {copiedKey === k.key ? "Copied!" : "Copy"}
                                    </button>
                                    <button
                                        className="btn btn-secondary btn-sm"
                                        onClick={() => goToAnalytics(k.key)}
                                    >
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <line x1="18" y1="20" x2="18" y2="10"></line>
                                            <line x1="12" y1="20" x2="12" y2="4"></line>
                                            <line x1="6" y1="20" x2="6" y2="14"></line>
                                        </svg>
                                        Analytics
                                    </button>
                                    <button
                                        className="btn btn-danger btn-sm"
                                        onClick={() => deleteKey(k.key)}
                                    >
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="3 6 5 6 21 6"></polyline>
                                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                        </svg>
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}