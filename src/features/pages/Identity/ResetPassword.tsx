import { useEffect, useState } from "react"
import styled from "styled-components"
import { ResetPasswordDTO } from "../../../app/models/User"
import { useLocation } from "react-router-dom";
import { Input } from "../../ui/Forms/Input";
import { useAppDispatch, useAppSelector } from "../../../app/store/configureStore";
import { handleResetPassword } from "../../../app/store/userSlice";
import { toast } from "react-toastify";
import { icons } from "../../../app/utils/helper";

const logo = require('../../assets/images/change-pw.png');

// Test Change User Git
export const ResetPassword = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const dispatch = useAppDispatch();
    const {loadingState} = useAppSelector(state => state.user);

    const [resetPasswordDTO, setResetPasswordDTO] = useState<ResetPasswordDTO>({
        email: '',
        token: '',
        newPassword: '',
        confirmNewPassword: '' 
    });

    const handleChangeData = (e: any, key: string) => {
        setResetPasswordDTO(prev => {
            return {...prev, [key]: e.target.value};
        })
    }

    useEffect(() => {
        setResetPasswordDTO(prev => {
            return {
                ...prev,
                email: queryParams.get('email') || '',
                token: queryParams.get('token') || '',
            }
        });

    // eslint-disable-next-line
    }, []);

    const handleBeforeSubmit = () => {
        console.log(resetPasswordDTO);    
    }

    const handleSubmit = (e: any) => {
        e.preventDefault();
        handleBeforeSubmit();

        try {
            dispatch(handleResetPassword(resetPasswordDTO));
            toast.success('Reset password successfully !', {icon: icons.success});
        } catch (error) {
            console.log(error);
        }
    }
  
    return (
        <Style disabled={loadingState}>
            <form onSubmit={handleSubmit} >
                <div className="identity_container" >
                    <div className="form_heading" >
                        <IMG />
                        <h1>Reset Password:</h1>
                    </div>
                    <div className="form_content" >
                        <Input 
                            id="newPassword" placeholder="New Password..." type="password" 
                            value={resetPasswordDTO.newPassword} onGetDataChange={e => handleChangeData(e, 'newPassword')} 
                        />

                        <Input 
                            id="confirmNewPassword" placeholder="Confirm Password..." type="password" marginTop="1vh"
                            value={resetPasswordDTO.confirmNewPassword} onGetDataChange={e => handleChangeData(e, 'confirmNewPassword')} 
                        />
                    </div>
                    <div className="form_footer" >
                        <button disabled={loadingState} type="submit" >
                            {loadingState ? '...' : 'Confirm'}
                        </button>
                    </div>
                </div>
            </form>
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
                    
                    &:hover:enabled {
                        opacity: 1;
                        cursor: pointer;
                    }
                }
            }
        }
    }
`