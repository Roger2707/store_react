import styled from "styled-components"
import { useGoogleLogin } from "@react-oauth/google";
import { useState } from "react";
import { GoogleAuthRequest } from "../../../app/models/User";
import agent from "../../../app/api/agent";
import { useAppDispatch } from "../../../app/store/configureStore";
import { setUser } from "../../../app/store/userSlice";

export const OAuthIdentity = () => {
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const dispatch = useAppDispatch();

    const login = useGoogleLogin({
        onSuccess: async (response: any) => {
            console.log(response);
            setErrorMessage(null);
            try {            
                const request: GoogleAuthRequest = {authCode: response.code};
                const user = await agent.User.oAuthLogin(request);
                console.log("Login Success:", user);
                dispatch(setUser(user));
            } catch (error: any) {
                console.error("Login Error:", error.response?.data || error.message);
                setErrorMessage(error.response?.data?.message || "Login failed!");
            }
        },
        onError: (error) => {
            console.error("Google Login Error:", error);
        },
        ux_mode: "popup",
        flow: "auth-code",
    });

    return (
        <Style>
            <button onClick={() => login()} style={{ padding: "10px", cursor: "pointer" }}>
                Sign in with Google
            </button>
            {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
        </Style>
    );
}

const Style = styled.div `
    margin-top: 1%;
    width: 60%;
    text-align: center;

    display: flex;
    justify-content: center;
    flex-direction: column;

    p {
        margin-bottom: 3%;
    }
`
