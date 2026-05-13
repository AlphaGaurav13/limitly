import { useState } from "react";

export default function LandingPage({ onLogin, onSignup }) {
    const [activeTab, setActiveTab] = useState(0);

    const features = [
        {
            icon: "🛡️",
            tab: "Rate Limiting",
            title: "Powerful Rate Limiting",
            desc: "Protect your APIs from abuse with configurable rate limits. Set request thresholds per minute, hour, or day with a single API key.",
            code: `const res = await fetch(apiUrl, {
  headers: {
    "x-api-key": "your-limitly-key"
  }
});
// { allowed: true, remaining: 98 }`
        },
        {
            icon: "📊",
            tab: "Analytics",
            title: "Real-Time Analytics",
            desc: "Monitor every request hitting your endpoints. See allowed vs blocked requests, top endpoints, and usage patterns — all in real time.",
            code: `// Analytics response
{
  total: 12847,
  allowed: 12103,
  blocked: 744,
  topEndpoints: [
    { endpoint: "/api/users", count: 4521 }
  ]
}`
        },
        {
            icon: "🔑",
            tab: "API Keys",
            title: "Simple API Key Management",
            desc: "Generate, rotate, and revoke API keys instantly from your dashboard. Each key is scoped and independently trackable.",
            code: `// Generate a new key
POST /api/generate-key
Authorization: Bearer <token>

// Response
{ key: "a6948c35dad39efd27ed..." }`
        },
        {
            icon: "⚡",
            tab: "Integration",
            title: "Integrate in 30 Seconds",
            desc: "Just add one header to your API requests. No SDKs, no complex setup. Works with any language, any framework, any platform.",
            code: `// That's it. One header.
fetch("https://your-api.com/endpoint", {
  headers: {
    "x-api-key": "your-limitly-key"
  }
});`
        }
    ];

    const stats = [
        { value: "99.9%", label: "Uptime" },
        { value: "<1ms", label: "Latency Overhead" },
        { value: "10M+", label: "Requests Protected" },
        { value: "∞", label: "Scalability" }
    ];

    const steps = [
        { num: "01", icon: "🔑", title: "Get Your API Key", desc: "Sign up and generate your unique API key from the dashboard in seconds." },
        { num: "02", icon: "🔧", title: "Add One Header", desc: "Include your Limitly API key as a header in your API requests. That's the entire integration." },
        { num: "03", icon: "📈", title: "Monitor & Scale", desc: "Watch real-time analytics, track usage patterns, and scale without worrying about abuse." }
    ];

    return (
        <div className="landing-page">
            {/* Navbar */}
            <nav className="landing-nav">
                <div className="landing-nav-inner">
                    <div className="logo-text">
                        Limitly<span className="logo-dot">.</span>
                    </div>
                    <div className="landing-nav-links">
                        <a href="#features" className="nav-link">Features</a>
                        <a href="#how-it-works" className="nav-link">How it Works</a>
                        <a href="#stats" className="nav-link">Stats</a>
                    </div>
                    <div className="landing-nav-actions">
                        <button className="btn btn-ghost" onClick={onLogin}>Login</button>
                        <button className="btn btn-primary" onClick={onSignup}>
                            Start for Free
                            <span style={{ fontSize: '1.1em' }}>↗</span>
                        </button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-content">
                    <div className="hero-badge">
                        <span className="hero-badge-dot"></span>
                        Open Source Rate Limiter
                    </div>
                    <h1 className="hero-title">
                        <span className="hero-title-green">Rate Limiting</span>
                        <br />
                        <span className="hero-title-green">Platform</span>
                    </h1>
                    <p className="hero-subtitle">
                        The single platform for all your API rate limiting needs.
                        <br />
                        Protect, monitor, and scale your endpoints effortlessly.
                    </p>
                    <div className="hero-actions">
                        <button className="btn btn-primary btn-lg" onClick={onSignup}>
                            Start for Free
                            <span style={{ fontSize: '1.2em' }}>↗</span>
                        </button>
                        <button className="btn btn-secondary btn-lg" onClick={onLogin}>
                            Sign In
                        </button>
                    </div>
                </div>

                {/* Ambient glow */}
                <div className="hero-glow"></div>
            </section>

            {/* Feature Tabs */}
            <section className="features-section" id="features">
                <div className="features-inner">
                    <div className="features-tabs">
                        {features.map((f, i) => (
                            <button
                                key={i}
                                className={`feature-tab ${activeTab === i ? 'active' : ''}`}
                                onClick={() => setActiveTab(i)}
                            >
                                <span className="feature-tab-icon">{f.icon}</span>
                                {f.tab}
                            </button>
                        ))}
                    </div>

                    <div className="feature-panel">
                        <div className="feature-panel-info">
                            <h2>{features[activeTab].title}</h2>
                            <p>{features[activeTab].desc}</p>
                            <button className="btn btn-secondary" onClick={onSignup} style={{ marginTop: '16px' }}>
                                Get Started →
                            </button>
                        </div>
                        <div className="feature-panel-code">
                            <div className="code-window">
                                <div className="code-window-dots">
                                    <span className="dot red"></span>
                                    <span className="dot yellow"></span>
                                    <span className="dot green"></span>
                                </div>
                                <pre className="code-content">
                                    <code>{features[activeTab].code}</code>
                                </pre>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats */}
            <section className="stats-section" id="stats">
                <div className="stats-inner">
                    {stats.map((s, i) => (
                        <div key={i} className="landing-stat">
                            <div className="landing-stat-value">{s.value}</div>
                            <div className="landing-stat-label">{s.label}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* How it works */}
            <section className="how-section" id="how-it-works">
                <div className="how-inner">
                    <h2 className="section-title">Get started in minutes</h2>
                    <p className="section-subtitle">Three simple steps to protect your APIs</p>

                    <div className="steps-grid">
                        {steps.map((s, i) => (
                            <div key={i} className="step-card">
                                <div className="step-num">{s.num}</div>
                                <div className="step-icon">{s.icon}</div>
                                <h3>{s.title}</h3>
                                <p>{s.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="cta-section">
                <div className="cta-inner">
                    <h2>Ready to protect your APIs?</h2>
                    <p>Start rate limiting in under 30 seconds. No credit card required.</p>
                    <div className="hero-actions" style={{ marginTop: '32px' }}>
                        <button className="btn btn-primary btn-lg" onClick={onSignup}>
                            Get Started Free
                            <span style={{ fontSize: '1.2em' }}>↗</span>
                        </button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="landing-footer">
                <div className="landing-footer-inner">
                    <div className="logo-text" style={{ fontSize: '1rem' }}>
                        Limitly<span className="logo-dot">.</span>
                    </div>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        © 2026 Limitly. Built with ❤️ for developers.
                    </p>
                </div>
            </footer>
        </div>
    );
}
