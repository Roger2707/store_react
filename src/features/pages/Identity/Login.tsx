import styled from "styled-components"
import { Input } from "../../ui/Forms/Input"
import { useState } from "react"
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../app/store/configureStore";
import { signInAsync } from "../../../app/store/accountSlice";
import { SignInRequest } from "../../../app/models/User";
import { OAuthIdentity } from "./OAuthIdentity";

const logo = require('../../assets/images/mainLogo.jpg');

export const Login = () => {
    const dispatch = useAppDispatch();
    const {loadingState} = useAppSelector(state => state.account);
    const [loginRequest, setLoginRequest] = useState<SignInRequest>(
        {
            username: '',
            password: ''
        }
    );


    const handleChangeData = (e: any, key: string) => {
        setLoginRequest(prev => {
            return {...prev, [key]: e.target.value};
        });
    }

    const handleBeforeSubmit = () => {
        console.log(loginRequest);
    }

    const handleSubmit = (e: any) => {
        e.preventDefault();
        handleBeforeSubmit();

        try {
            dispatch(signInAsync(loginRequest));
        } catch (error: any) {
            console.log(error);
        }
    }

    return (
        <Style>
            <form onSubmit={handleSubmit} >
                <div className="identity_container" >
                    <div className="form_heading" >
                        <IMG />
                        <h1>Welcome back,</h1>
                    </div>
                    <div className="form_content" >
                        <Input id="username" placeholder="Username..." type="text" value={loginRequest.username} onGetDataChange={e => handleChangeData(e, 'username')} />
                        <Input id="password" placeholder="Password..." type="password" value={loginRequest.password} onGetDataChange={e => handleChangeData(e, 'password')} />
                    </div>
                    <div className="form_footer" >
                        <button disabled={loadingState} type="submit" >
                            {loadingState ? '...' : 'Log In'}
                        </button>
                    </div>
                </div>

            </form>

            <OAuthIdentity />

            <div className="redirect" >
                <p>Don't have account ? <Link to='/signup'>Go to Sign up</Link></p>
                <p>Forgot Password ? <Link to='/forgot-password' >Click Here .</Link></p>
            </div>
        </Style>
    )
}

const IMG = styled.div`
    width: 100px;
    height: 100px;

    border-radius: 50%;
    background-image: url(${logo});
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
`

const Style = styled.div`
    background: #E5E4E2;
    color: #333;
    width: 100%;
    height: calc(100vh - 10vh);
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;

    form {
        background: #E6E6FA;
        width: 30%;
        height: fit-content;
        padding: 3%;
        border: 2px solid #333;
        border-radius: 5%;

        .identity_container {

            .form_heading {
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                h1 {
                    color: #333;
                    margin-top: 5%;
                    font-size: 1.5rem;
                }
            }
    
            .form_content {
                margin-top: 8%;

                p {
                    color: #5D3FD3;
                    font-size: 1.15rem;
                    font-style: italic;
                    font-weight: 600;
                }
            }
    
            .form_footer {
                width: 100%;
                text-align: center;
                button {
                    margin-top: 5%;
                    font-size: 1.2rem;
                    border: none;
                    border-radius: 5px;
                    padding: 2% 8%;
                    background: #ff5733;
                    opacity: 0.5;
                    color: #fff;
                    cursor: not-allowed;

                    &:focus:enabled {
                        opacity: 1;
                    }
                    
                    &:hover:enabled {
                        opacity: 1;
                        cursor: pointer;
                    }
                }
            }
        }
    }

    .redirect {
        display: block;
        margin-top: 1%;
        font-size: 1.1rem;

        a {
            text-decoration: underline;
            color: #d35656;
            display: inline-block;
            font-weight: bold;
        }
    }
`