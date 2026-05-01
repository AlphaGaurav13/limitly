import { useState } from "react";

import axios from "axios";

export default function Analytics() {
    const [apiKey, setApiKey] = useState("");
    const [data, setData] = useState(null);

    const fetchAnalytics = async () => {
        try {
            const res = await axios.post(
                "http://localhost:3000/api/analytics",
                { apiKey }
            );

            setData(res.data);
        }catch(err) {
            console.error(err.response?.data);
            alert("Failed to fetch analytics");
        }
    };

    return (
        <div style={{ padding: "50px" }}>
            <h2>Analytics Dashboard</h2>

            <input
            placeholder="Enter API Key"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            />

            <br/ > <br/>

            <button onClick={fetchAnalytics}>Load Analytics</button>

            {
                data && (
                    <div>
                        <h3>Stats</h3>
                        <p>Total Request: {data.total}</p>
                        <p>Allowed: {data.allowed}</p>
                        <p>Blocked: {data.blocked}</p>


                        <h3>Top Users</h3>
                        <ul>
                            {data.topUsers?.map((u, i) => (
                                <li key={i}>
                                    {u.userdId} → {u.count}
                                </li>
                            ))}
                        </ul>
                        

                        <h3>Top Endpoints</h3>
                        <ul>
                           {data.topEndpoints?.map((e, i) => (
                            <li key={i}>
                                {e.endpoint} → {e.count}
                            </li>
                        ))}
                        </ul>

                    </div>
                )
            }
        </div>
    )
}