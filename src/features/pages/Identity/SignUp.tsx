import styled from "styled-components"
import { Input } from "../../ui/Forms/Input"
import { useState } from "react"
import { Link } from "react-router-dom";
import { SignUpRequest } from "../../../app/models/User";
import { useAppDispatch, useAppSelector } from "../../../app/store/configureStore";
import { signUpAsync } from "../../../app/store/accountSlice";
import { OAuthIdentity } from "./OAuthIdentity";

const logo = require('../../assets/images/mainLogo.jpg');

export const SignUp = () => {
    const {loadingState} = useAppSelector(state => state.account);
    const [signupRequest, setSignUpRequest] = useState<SignUpRequest>(
        {email: '', fullname: '', username: '', phoneNumber: ''}
    );

    const dispatch = useAppDispatch();

    const handleChangeData = (e: any, key: string) => {
        setSignUpRequest(prev => {
            return {...prev, [key]: e.target.value};
        });
    }

    const handleBeforeSubmit = () => {
        console.log(signupRequest);
    }

    const handleSubmit = (e: any) => {
        e.preventDefault();
        handleBeforeSubmit();

        try {
            dispatch(signUpAsync(signupRequest));
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <Style>
            <form onSubmit={handleSubmit} >
                <div className="identity_container" >
                    <div className="form_heading" >
                        <IMG />
                        <h1>Welcome,</h1>
                    </div>
                    <div className="form_content" >
                        <Input id="username" placeholder="Username..." type="text" value={signupRequest.username} onGetDataChange={e => handleChangeData(e, 'username')} />
                        <Input id="fullname" placeholder="FullName..." type="text" value={signupRequest.fullname} onGetDataChange={e => handleChangeData(e, 'fullname')} />
                        <Input id="email" placeholder="Email..." type="email" value={signupRequest.email} onGetDataChange={e => handleChangeData(e, 'email')} />
                        <Input id="phoneNumber" placeholder="Phone..." type="number" value={signupRequest.phoneNumber} onGetDataChange={e => handleChangeData(e, 'phoneNumber')} />
                    </div>
                    <div className="form_footer" >
                        <button disabled={loadingState} type="submit" >
                            {loadingState ? '...' : 'Sign Up'}
                        </button>
                    </div>
                </div>

            </form>
            
            <OAuthIdentity />

            <div className="redirect" >
                <p>Have an account ? <Link to='/login'>Let's Login</Link></p>
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