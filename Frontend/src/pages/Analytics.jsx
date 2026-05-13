import { useState, useEffect } from "react";
import axios from "axios";
import API_URL from "../config";

export default function Analytics({ apiKey, goBack }) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchAnalytics = async () => {
        try {
            const res = await axios.post(
                `${API_URL}/api/analytics`,
                { apiKey }
            );
            setData(res.data);
        } catch(err) {
            console.error(err.response?.data);
            alert("Failed to fetch analytics");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if(apiKey) {
            fetchAnalytics();
        }
    }, [apiKey]);

    return (
        <div className="analytics-page">
            {/* Header */}
            <header className="analytics-header">
                <button className="btn btn-ghost btn-sm" onClick={goBack}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="19" y1="12" x2="5" y2="12"></line>
                        <polyline points="12 19 5 12 12 5"></polyline>
                    </svg>
                    Back
                </button>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Analytics Dashboard</h3>
            </header>

            {/* Content */}
            <div className="analytics-content">
                <div className="analytics-key-badge">
                    <span className="badge-label">API Key</span>
                    {apiKey}
                </div>

                {/* Loading */}
                {loading && (
                    <div className="loading-container">
                        <div className="spinner"></div>
                        <span className="loading-text">Fetching analytics...</span>
                    </div>
                )}

                {/* Stats */}
                {data && (
                    <>
                        <div className="stats-grid">
                            <div className="stat-card">
                                <div className="stat-value">{data.total}</div>
                                <div className="stat-label">Total Requests</div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-value">{data.allowed}</div>
                                <div className="stat-label">Allowed</div>
                            </div>
                            <div className="stat-card stat-blocked">
                                <div className="stat-value">{data.blocked}</div>
                                <div className="stat-label">Blocked</div>
                            </div>
                        </div>

                        {/* Top Endpoints */}
                        {data.topEndpoints && data.topEndpoints.length > 0 && (
                            <div className="endpoints-section">
                                <h3>Top Endpoints</h3>
                                <table className="endpoints-table">
                                    <thead>
                                        <tr>
                                            <th>Endpoint</th>
                                            <th style={{ textAlign: 'right' }}>Requests</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.topEndpoints.map((e, i) => (
                                            <tr key={i}>
                                                <td className="endpoint-path">{e.endpoint}</td>
                                                <td className="endpoint-count" style={{ textAlign: 'right' }}>{e.count}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}