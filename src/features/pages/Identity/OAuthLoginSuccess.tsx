import { useEffect } from "react";
import styled from "styled-components"

export const OAuthLoginSuccess = () => {

    useEffect(() => {
        if (window.opener) {
            window.opener.postMessage({ status: "success" }, "*");
        }
        window.close();
    }, []);

    return (
        <Style>
            <h1>OAuth Login Success !</h1>
        </Style>
    )
}

const Style = styled.div `

`