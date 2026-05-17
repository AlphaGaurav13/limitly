import { useEffect } from "react";


export default function OAuthSuccess({ setToken  }) {
    
    
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get("token");

        if(token) {
            localStorage.setItem("token", token);
            setToken(token);

            window.history.replaceState({}, document.title, "/");
        }
    }, []);

    return <h1>Logging in...</h1>;
}