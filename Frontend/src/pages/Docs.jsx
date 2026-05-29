import { useState, useEffect } from "react";
import axios from "axios";
import API_URL from "../config";

export default function Docs({ token, goBack }) {
    const [keys, setKeys] = useState([]);
    const [selectedKey, setSelectedKey] = useState("");
    const [activeTab, setActiveTab] = useState("nodejs");
    const [copiedBlock, setCopiedBlock] = useState(null);

    useEffect(() => {
        if (token) {
            axios
                .get(`${API_URL}/api/keys`, {
                    headers: { Authorization: `Bearer ${token}` },
                })
                .then((res) => {
                    setKeys(res.data);
                    if (res.data.length > 0) setSelectedKey(res.data[0].key);
                })
                .catch(() => {});
        }
    }, [token]);

    const apiKey = selectedKey || "YOUR_API_KEY";
    const baseUrl = API_URL;

    const copyCode = (code, id) => {
        navigator.clipboard.writeText(code);
        setCopiedBlock(id);
        setTimeout(() => setCopiedBlock(null), 2000);
    };

    const codeSnippets = {
        nodejs: {
            label: "Node.js",
            icon: "⬢",
            middleware: `const axios = require("axios");

// Limitly Rate Limiter Middleware
async function limitly(req, res, next) {
    try {
        const { data } = await axios.post(
            "${baseUrl}/api/check-limit",
            {
                apiKey: "${apiKey}",
                endpoint: req.path,
                userId: req.ip
            }
        );

        if (data.allowed) {
            // ✅ Request is within rate limit
            next();
        } else {
            // 🚫 Rate limit exceeded
            res.status(429).json({
                error: "Too many requests",
                remaining: data.remaining,
                retryAfter: data.retryAfter
            });
        }
    } catch (err) {
        // If Limitly is unreachable, allow the request
        next();
    }
}

// Use on any Express route
app.get("/api/users", limitly, (req, res) => {
    res.json({ users: ["Alice", "Bob"] });
});

// Or protect all routes at once
app.use("/api", limitly);`,
            quick: `const axios = require("axios");

const { data } = await axios.post(
    "${baseUrl}/api/check-limit",
    {
        apiKey: "${apiKey}",
        endpoint: "/api/login",
        userId: "user_123"
    }
);

console.log(data);
// { allowed: true, remaining: 4, limit: 5, window: 60000 }`
        },
        python: {
            label: "Python",
            icon: "🐍",
            middleware: `import requests
from functools import wraps
from flask import request, jsonify

LIMITLY_URL = "${baseUrl}/api/check-limit"
LIMITLY_KEY = "${apiKey}"

def limitly(f):
    """Limitly Rate Limiter Decorator"""
    @wraps(f)
    def decorated(*args, **kwargs):
        try:
            resp = requests.post(LIMITLY_URL, json={
                "apiKey": LIMITLY_KEY,
                "endpoint": request.path,
                "userId": request.remote_addr
            })
            result = resp.json()

            if not result.get("allowed"):
                return jsonify({
                    "error": "Too many requests",
                    "remaining": result.get("remaining")
                }), 429

        except requests.RequestException:
            pass  # Allow if Limitly is unreachable

        return f(*args, **kwargs)
    return decorated

# Use on any Flask route
@app.route("/api/users")
@limitly
def get_users():
    return jsonify({"users": ["Alice", "Bob"]})`,
            quick: `import requests

response = requests.post(
    "${baseUrl}/api/check-limit",
    json={
        "apiKey": "${apiKey}",
        "endpoint": "/api/login",
        "userId": "user_123"
    }
)

print(response.json())
# {"allowed": True, "remaining": 4, "limit": 5, "window": 60000}`
        },
        curl: {
            label: "cURL",
            icon: "⌘",
            middleware: `# Check rate limit for an endpoint
curl -X POST ${baseUrl}/api/check-limit \\
  -H "Content-Type: application/json" \\
  -d '{
    "apiKey": "${apiKey}",
    "endpoint": "/api/login",
    "userId": "user_123"
  }'

# ✅ Success Response:
# {
#   "allowed": true,
#   "remaining": 4,
#   "limit": 5,
#   "window": 60000
# }

# 🚫 Rate Limited Response:
# {
#   "allowed": false,
#   "remaining": 0,
#   "limit": 5,
#   "window": 60000
# }`,
            quick: `curl -X POST ${baseUrl}/api/check-limit \\
  -H "Content-Type: application/json" \\
  -d '{"apiKey":"${apiKey}","endpoint":"/api/login","userId":"user_123"}'`
        }
    };

    const currentSnippet = codeSnippets[activeTab];

    return (
        <div className="docs-page">
            {/* Header */}
            <header className="docs-header">
                <div className="docs-header-left">
                    <button className="btn btn-ghost btn-sm" onClick={goBack}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="19" y1="12" x2="5" y2="12"></line>
                            <polyline points="12 19 5 12 12 5"></polyline>
                        </svg>
                        Dashboard
                    </button>
                    <div className="docs-header-divider"></div>
                    <div className="logo-text">
                        Limitly<span className="logo-dot">.</span>
                        <span className="docs-badge">Docs</span>
                    </div>
                </div>
            </header>

            {/* Main content */}
            <div className="docs-layout">
                {/* Sidebar */}
                <aside className="docs-sidebar">
                    <nav className="docs-nav">
                        <div className="docs-nav-section">
                            <div className="docs-nav-title">Getting Started</div>
                            <a href="#quickstart" className="docs-nav-link active">Quick Start</a>
                            <a href="#api-key-select" className="docs-nav-link">Your API Key</a>
                        </div>
                        <div className="docs-nav-section">
                            <div className="docs-nav-title">Integration</div>
                            <a href="#integration" className="docs-nav-link">Code Examples</a>
                            <a href="#middleware" className="docs-nav-link">Middleware</a>
                        </div>
                        <div className="docs-nav-section">
                            <div className="docs-nav-title">Reference</div>
                            <a href="#api-reference" className="docs-nav-link">API Reference</a>
                            <a href="#plans" className="docs-nav-link">Rate Limits</a>
                            <a href="#errors" className="docs-nav-link">Error Handling</a>
                        </div>
                    </nav>
                </aside>

                {/* Content */}
                <main className="docs-content">
                    {/* Hero intro */}
                    <section className="docs-hero" id="quickstart">
                        <div className="docs-hero-badge">
                            <span className="hero-badge-dot"></span>
                            Documentation
                        </div>
                        <h1>Integrate Limitly in <span className="text-accent">30 seconds</span></h1>
                        <p className="docs-hero-subtitle">
                            Add rate limiting to any API with a single HTTP call. No SDKs needed — works with any language, any framework.
                        </p>
                    </section>

                    {/* API Key selector */}
                    {token && keys.length > 0 && (
                        <section className="docs-section" id="api-key-select">
                            <div className="docs-key-selector">
                                <div className="docs-key-selector-icon">🔑</div>
                                <div className="docs-key-selector-info">
                                    <span className="docs-key-selector-label">Your API Key</span>
                                    <span className="docs-key-selector-hint">Code examples below use this key</span>
                                </div>
                                <select
                                    className="docs-key-dropdown"
                                    value={selectedKey}
                                    onChange={(e) => setSelectedKey(e.target.value)}
                                >
                                    {keys.map((k) => (
                                        <option key={k.key} value={k.key}>
                                            {k.key.slice(0, 8)}...{k.key.slice(-8)}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </section>
                    )}

                    {/* Quick Start */}
                    <section className="docs-section">
                        <h2>
                            <span className="docs-section-icon">⚡</span>
                            Quick Start
                        </h2>
                        <p>Just make a <code>POST</code> request to check if a request should be allowed:</p>

                        <div className="docs-code-block">
                            <div className="docs-code-header">
                                <span className="docs-code-label">Endpoint</span>
                            </div>
                            <div className="docs-code-body">
                                <code>
                                    <span className="code-method">POST</span> {baseUrl}/api/check-limit
                                </code>
                            </div>
                        </div>

                        <div className="docs-code-block">
                            <div className="docs-code-header">
                                <span className="docs-code-label">Request Body</span>
                                <button
                                    className="docs-copy-btn"
                                    onClick={() => copyCode(JSON.stringify({ apiKey, endpoint: "/api/login", userId: "user_123" }, null, 2), "body")}
                                >
                                    {copiedBlock === "body" ? "✓ Copied" : "Copy"}
                                </button>
                            </div>
                            <pre className="docs-code-body">
                                <code>{`{
    "apiKey": "${apiKey}",
    "endpoint": "/api/login",
    "userId": "user_123"
}`}</code>
                            </pre>
                        </div>

                        <div className="docs-params-table">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Parameter</th>
                                        <th>Type</th>
                                        <th>Required</th>
                                        <th>Description</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td><code>apiKey</code></td>
                                        <td>string</td>
                                        <td><span className="docs-required">Required</span></td>
                                        <td>Your Limitly API key from the dashboard</td>
                                    </tr>
                                    <tr>
                                        <td><code>endpoint</code></td>
                                        <td>string</td>
                                        <td><span className="docs-required">Required</span></td>
                                        <td>The endpoint path you want to rate limit</td>
                                    </tr>
                                    <tr>
                                        <td><code>userId</code></td>
                                        <td>string</td>
                                        <td><span className="docs-optional">Optional</span></td>
                                        <td>Unique identifier for the user (IP, user ID, etc.)</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <div className="docs-response-grid">
                            <div className="docs-code-block docs-response-success">
                                <div className="docs-code-header">
                                    <span className="docs-code-label">✅ Allowed Response</span>
                                </div>
                                <pre className="docs-code-body">
                                    <code>{`{
    "allowed": true,
    "remaining": 4,
    "limit": 5,
    "window": 60000
}`}</code>
                                </pre>
                            </div>
                            <div className="docs-code-block docs-response-blocked">
                                <div className="docs-code-header">
                                    <span className="docs-code-label">🚫 Blocked Response</span>
                                </div>
                                <pre className="docs-code-body">
                                    <code>{`{
    "allowed": false,
    "remaining": 0,
    "limit": 5,
    "window": 60000
}`}</code>
                                </pre>
                            </div>
                        </div>
                    </section>

                    {/* Code examples with tabs */}
                    <section className="docs-section" id="integration">
                        <h2>
                            <span className="docs-section-icon">🔧</span>
                            Integration Examples
                        </h2>
                        <p>Choose your language and copy-paste the code into your project:</p>

                        <div className="docs-lang-tabs">
                            {Object.entries(codeSnippets).map(([key, val]) => (
                                <button
                                    key={key}
                                    className={`docs-lang-tab ${activeTab === key ? "active" : ""}`}
                                    onClick={() => setActiveTab(key)}
                                >
                                    <span className="docs-lang-icon">{val.icon}</span>
                                    {val.label}
                                </button>
                            ))}
                        </div>

                        {/* Quick example */}
                        <div className="docs-code-block" id="quick-example">
                            <div className="docs-code-header">
                                <span className="docs-code-label">{currentSnippet.label} — Quick Check</span>
                                <button
                                    className="docs-copy-btn"
                                    onClick={() => copyCode(currentSnippet.quick, "quick")}
                                >
                                    {copiedBlock === "quick" ? "✓ Copied" : "Copy"}
                                </button>
                            </div>
                            <pre className="docs-code-body">
                                <code>{currentSnippet.quick}</code>
                            </pre>
                        </div>
                    </section>

                    {/* Full middleware example */}
                    <section className="docs-section" id="middleware">
                        <h2>
                            <span className="docs-section-icon">🛡️</span>
                            Middleware / Decorator
                        </h2>
                        <p>Drop this into your project to automatically rate limit every incoming request:</p>

                        <div className="docs-code-block docs-code-large">
                            <div className="docs-code-header">
                                <span className="docs-code-label">{currentSnippet.label} — Full Middleware</span>
                                <button
                                    className="docs-copy-btn"
                                    onClick={() => copyCode(currentSnippet.middleware, "middleware")}
                                >
                                    {copiedBlock === "middleware" ? "✓ Copied" : "Copy"}
                                </button>
                            </div>
                            <pre className="docs-code-body">
                                <code>{currentSnippet.middleware}</code>
                            </pre>
                        </div>
                    </section>

                    {/* API Reference */}
                    <section className="docs-section" id="api-reference">
                        <h2>
                            <span className="docs-section-icon">📖</span>
                            API Reference
                        </h2>

                        <div className="docs-endpoint-card">
                            <div className="docs-endpoint-header">
                                <span className="docs-method-badge">POST</span>
                                <code>/api/check-limit</code>
                            </div>
                            <p>Check if a request should be allowed based on the rate limit configuration for your plan.</p>
                            
                            <div className="docs-callout docs-callout-info">
                                <div className="docs-callout-icon">💡</div>
                                <div>
                                    <strong>How it works:</strong> Each API key + endpoint + userId combination has its own rate limit counter.
                                    The counter uses a <strong>Sliding Window Log</strong> algorithm for accurate rate limiting.
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Plans */}
                    <section className="docs-section" id="plans">
                        <h2>
                            <span className="docs-section-icon">📊</span>
                            Rate Limits by Plan
                        </h2>

                        <div className="docs-plans-grid">
                            <div className="docs-plan-card">
                                <div className="docs-plan-name">Free</div>
                                <div className="docs-plan-limit">5 <span>req/min</span></div>
                                <ul className="docs-plan-features">
                                    <li>✓ 5 requests per 60 seconds</li>
                                    <li>✓ Up to 3 API keys per day</li>
                                    <li>✓ Real-time analytics</li>
                                    <li>✓ Sliding window algorithm</li>
                                </ul>
                            </div>
                            <div className="docs-plan-card docs-plan-pro">
                                <div className="docs-plan-badge">Recommended</div>
                                <div className="docs-plan-name">Pro</div>
                                <div className="docs-plan-limit">100 <span>req/min</span></div>
                                <ul className="docs-plan-features">
                                    <li>✓ 100 requests per 60 seconds</li>
                                    <li>✓ Unlimited API keys</li>
                                    <li>✓ Advanced analytics</li>
                                    <li>✓ Priority support</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    {/* Error handling */}
                    <section className="docs-section" id="errors">
                        <h2>
                            <span className="docs-section-icon">⚠️</span>
                            Error Handling
                        </h2>

                        <div className="docs-params-table">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Status Code</th>
                                        <th>Error</th>
                                        <th>Description</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td><code>400</code></td>
                                        <td>Missing fields</td>
                                        <td><code>apiKey</code> and <code>endpoint</code> are required in the request body</td>
                                    </tr>
                                    <tr>
                                        <td><code>401</code></td>
                                        <td>API key missing</td>
                                        <td>No API key was provided in the request</td>
                                    </tr>
                                    <tr>
                                        <td><code>403</code></td>
                                        <td>Invalid API key</td>
                                        <td>The API key is invalid or has been deactivated</td>
                                    </tr>
                                    <tr>
                                        <td><code>500</code></td>
                                        <td>Internal Server Error</td>
                                        <td>Something went wrong on the server side</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <div className="docs-callout docs-callout-warning">
                            <div className="docs-callout-icon">💡</div>
                            <div>
                                <strong>Best Practice:</strong> Always wrap your Limitly calls in a try-catch block. If the Limitly service
                                is unreachable, allow the request to pass through to avoid blocking your users.
                            </div>
                        </div>
                    </section>

                    {/* Footer */}
                    <footer className="docs-footer">
                        <p>
                            Built with ❤️ by <span className="text-accent">Limitly</span> • Need help?{" "}
                            <a href="https://github.com/AlphaGaurav13/limitly" target="_blank" rel="noreferrer">Open an issue on GitHub</a>
                        </p>
                    </footer>
                </main>
            </div>
        </div>
    );
}
