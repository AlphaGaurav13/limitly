import { useState, useEffect } from "react";

import axios from "axios";
import API_URL from "../config";

export default function Analytics({apiKey, goBack }) {
    const [data, setData] = useState(null);
   
    const fetchAnalytics = async () => {
        try {
            const res = await axios.post(
                `${API_URL}/api/analytics`,
                { apiKey }
            );

            setData(res.data);
        }catch(err) {
            console.error(err.response?.data);
            alert("Failed to fetch analytics");
        }
    };

    useEffect(() => {
        if(apiKey) {
            fetchAnalytics();
        }
    }, [apiKey]);

    return (
        <div style={{ padding: "50px" }}>
            <button onClick={goBack}>Back</button>

            <h2>Analytics Dashboard</h2>
            <p><b>API Key: </b> {apiKey}</p>


            {!data && <p>Loading...0</p>}

            
            {/* <input
            placeholder="Enter API Key"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            />

            <br/ > <br/>

            <button onClick={fetchAnalytics}>Load Analytics</button> */}

            {
                data && (
                    <>
                    <h3>Status</h3>
                    <p>Total: {data.total}</p>
                    <p>Allowed: {data.allowed}</p>
                    <p>Blocked: {data.blocked}</p>

                    <h3>Top Endpoints</h3>
                    <ul>
                        {data.topEndpoints.map((e, i) => (
                            <li key={i}>{e.endpoint} → {e.count} </li>
                        ))}
                    </ul>
                    </>
                )
            }
        </div>
    )
}