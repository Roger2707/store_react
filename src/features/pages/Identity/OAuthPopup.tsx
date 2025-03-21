import { useEffect } from "react";

export const OAuthPopup = () => {
    useEffect(() => {
        const startOAuth = async () => {
            window.open('http://localhost:5110/api/users/external-login');
        };
        startOAuth();
    }, []);

    // useEffect(() => {
    //     const fetchUser = async () => {
    //         try {
    //             const res = await fetch("http://localhost:5110/api/users/external-login-callback", {
    //                 credentials: "include",
    //             });

    //             if (!res.ok) throw new Error("OAuth callback failed");

    //             const user = await res.json();

    //             window.opener.postMessage({ status: "success", user }, "*");

    //             window.close();
    //         } catch (error) {
    //             console.error("OAuth failed", error);
    //             window.close();
    //         }
    //     };

    //     if (window.location.search.includes("code=")) {
    //         fetchUser();
    //     }
    // }, []);

    return <div>Executing...</div>;
}