import { useEffect, useState } from "react";
import axios from "axios";

export default function Dashboard({ token, setToken }) {
    const [keys, setKeys] = useState([]);

    const fetchKeys = async () => {
        const res = await axios.get("http://localhost:3000/api/keys", {
            headers: { Authorization: `Bearer ${token}` }
        });
        setKeys(res.data);
    };

    const generateKey = async () => {
        try {
            await axios.post(
                "http://localhost:3000/api/generate-key",
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
            `http://localhost:3000/api/keys/${key}`,
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
                    border: "1px solid gray",
                    padding: "10px",
                    margin: "10px 0"
                }}>
                    <p>{k.key}</p>
                    <button onClick={() => deleteKey(k.key)}>Delete</button>
                </div>
            ))}
        </div>
    );
}