import styled from "styled-components"
import { Input } from "../../ui/Forms/Input"
import { useState } from "react"
import { ChangePasswordDTO } from "../../../app/models/User"
import { useAppDispatch, useAppSelector } from "../../../app/store/configureStore"
import { changePassword } from "../../../app/store/userSlice"

const changePwImage = require('../../assets/images/change-pw.png');
const IMG = styled.div`
    width: 150px;
    height: 150px;

    border-radius: 50%;
    background-image: url(${changePwImage});
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
`

export const ChangePassword = () => {

    const [changePasswordModel, setChangePasswordModel] = useState<ChangePasswordDTO>({
        currentPassword: '',
        newPassword: '',
        confirmedNewPassword: ''
    });

    const {loadingState} = useAppSelector(state => state.user);
    const dispatch = useAppDispatch();

    const handleGetDataChange = (e: any, key: string) => {
        setChangePasswordModel(prev => {
            return {
                ...prev, [key] : e.target.value
            }
        })
    }

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        try {
            await dispatch(changePassword(changePasswordModel));
            setChangePasswordModel(prev => {
                return {
                    currentPassword: '',
                    newPassword: '',
                    confirmedNewPassword: ''
                }
            });
        } catch (error) {

        }
    }

    return (
        <Style disabled={loadingState} >
            <IMG/>
            <h1>Change Password</h1>
            <form onSubmit={handleSubmit} >
                <Input 
                    id="currentPassword" type="password" value={changePasswordModel.currentPassword} 
                    placeholder="Current Password..." onGetDataChange={e => handleGetDataChange(e, 'currentPassword')} 
                />
                <Input 
                    id="newPassword" type="password" value={changePasswordModel.newPassword} marginTop="1vh"
                    placeholder="New Password..." onGetDataChange={e => handleGetDataChange(e, 'newPassword')} 
                />
                <Input 
                    id="confirmedNewPassword" type="password" value={changePasswordModel.confirmedNewPassword} marginTop="1vh"
                    placeholder="Confirm New Password..." onGetDataChange={e => handleGetDataChange(e, 'confirmedNewPassword')} 
                />

                <span className="text-warn" >Warn: Please ensure before changing anything !</span>

                <button type="submit" disabled={loadingState} >
                    {loadingState ? '...' : 'Confirm'}
                </button>
            </form>
        </Style>
    )
}

const Style = styled.div<{ disabled: boolean }> `
    margin-top: 5vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    opacity: ${(props) => (props.disabled ? 0.6 : 1)};
    pointer-events: ${(props) => (props.disabled ? "none" : "auto")}; 

    h1 {
        color: #6082B6;
        font-style: italic;
        letter-spacing: 1px;
        font-size: 1.8rem;
    }

    form {
        width: 50%;
        text-align: center;
        margin-top: 2vh;
        background-color: #EADDCA;
        padding: 2vh 1vw;

        .text-warn {
            display: block;
            margin-top: 2vh;
            font-size: 0.8rem;
            font-style: italic;
            color: gray;
            font-weight: 700;
        }

        button {
            width: fit-content;
            padding: 5px 15px;
            font-size: 1.2rem;
            border-radius: 5px;
            border: none;
            outline: none;
            margin-top: 0.5vh;

            background: darkred;
            color: #fff;
            opacity: 0.5;

            &:focus {
                opacity: 1;
            }

            &:hover:enabled {
                opacity: 1;
                cursor: pointer;
            }
        }
    }
`