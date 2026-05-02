import { useEffect, useState } from "react";
import axios from "axios";
import API_URL from "../config";

export default function Dashboard({ token, setToken, goToAnalytics }) {
    const [keys, setKeys] = useState([]);

    const fetchKeys = async () => {
        const res = await axios.get(`${API_URL}/api/keys`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        setKeys(res.data);
    };

    const generateKey = async () => {
        try {
            await axios.post(
                `${API_URL}/api/generate-key`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchKeys();
        } catch (err) {
            alert(err.response?.data?.error);
        }
    };

    const deleteKey = async (key) => {
        if (!window.confirm("Delete this key?")) return;

        await axios.delete(
            `${API_URL}/api/keys/${key}`,
            { headers: { Authorization: `Bearer ${token}` } }
        );

        fetchKeys();
    };



    useEffect(() => {
        fetchKeys();
    }, []);

    return (
        <div style={{ padding: "50px" }}>
            <h2>Dashboard</h2>

            <button onClick={generateKey}>Generate API Key</button>

            <button onClick={() => {
                localStorage.removeItem("token");
                setToken(null);
            }}>
                Logout
            </button>

            <h3>Your API Keys</h3>

            {keys.map((k) => (
                <div key={k.key} style={{
                border: "1px solid #444",
                padding: "12px",
                margin: "10px 0",
                borderRadius: "8px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                }}>
                    <span>{k.key}</span>
                    <div style={{display: "flex", gap:"10px"}}>
                        <button onClick={() => goToAnalytics(k.key)}>Analytics</button>
                    
                    <button onClick={() => deleteKey(k.key)}>Delete</button>
                    </div>
                </div>
            ))}
        </div>
    );
}