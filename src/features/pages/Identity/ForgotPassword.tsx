import styled from "styled-components"
import { Input } from "../../UI/Forms/Input"
import { useState } from "react"
import { ForgetPasswordDTO } from "../../../app/models/User";
import { useAppDispatch, useAppSelector } from "../../../app/store/configureStore";
import { handleForgetPassword } from "../../../app/store/userSlice";

const logo = require('../../assets/images/change-pw.png');
const IMG = styled.div`
    width: 150px;
    height: 150px;

    border-radius: 50%;
    background-image: url(${logo});
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
`

export const ForgotPassword = () => {
    const [forgetPasswordDTO, setForgetPasswordDTO] = useState<ForgetPasswordDTO>({email: ''});
    const dispatch = useAppDispatch();
    const {loadingState, message} = useAppSelector(state => state.user);

    const handleChangeData = (e: any, email: string) => {
        setForgetPasswordDTO(prev => {
            return {...prev, [email]: e.target.value};
        });
    }

    const handleSubmit = (e: any) => {
        e.preventDefault();

        try {
            dispatch(handleForgetPassword(forgetPasswordDTO));
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <Style disabled={loadingState} >
            <form onSubmit={handleSubmit} >
                {
                    message === 'success'  ?
                    <p>Link reset password was sent to email : 
                        <a href="https://www.gmail.com" >{forgetPasswordDTO.email}</a>
                        <br/>
                        <span>You can close this tab now !</span>
                    </p>
                    :
                    <div className="identity_container" >
                        <div className="form_heading" >
                            <IMG />
                            <h1>Forgot Password ?</h1>
                        </div>
                        <div className="form_content" >
                            <p>Email address :</p>
                            <Input id="email" placeholder="Email Address..." type="text" value={forgetPasswordDTO.email} onGetDataChange={e => handleChangeData(e, 'email')} />
                        </div>
                        <div className="form_footer" >
                            <button disabled={loadingState} type="submit" >
                                {loadingState ? '...' : 'Confirm'}
                            </button>
                        </div>
                    </div>
                }
            </form>
        </Style>
    )
}

const Style = styled.div<{ disabled: boolean }>`
    background: #E5E4E2;
    width: 100%;
    height: calc(100vh - 10vh);
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;

    opacity: ${(props) => (props.disabled ? 0.6 : 1)};
    pointer-events: ${(props) => (props.disabled ? "none" : "auto")}; 

    form {
        background: #E6E6FA;
        min-width: 30%;
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
                    
                    &:hover:enabled {
                        opacity: 1;
                        cursor: pointer;
                    }
                }
            }
        }
    }
`