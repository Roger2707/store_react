import styled from "styled-components"
import { Input } from "../../ui/Forms/Input"
import { useState } from "react"
import { ChangePasswordDTO } from "../../../app/models/User"
import { useAppDispatch, useAppSelector } from "../../../app/store/configureStore"
import { changePassword } from "../../../app/store/userSlice"

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

    const handleSubmit = (e: any) => {
        e.preventDefault();
        try {
            dispatch(changePassword(changePasswordModel));
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
        <Style>
            <h1>Change Password:</h1>
            <div className="form_container" >
                <form onSubmit={handleSubmit} >
                    <Input id="currentPassword" type="password" value={changePasswordModel.currentPassword} placeholder="Current Password..." onGetDataChange={e => handleGetDataChange(e, 'currentPassword')} />
                    <Input id="newPassword" type="password" value={changePasswordModel.newPassword} placeholder="New Password..." onGetDataChange={e => handleGetDataChange(e, 'newPassword')} />
                    <Input id="confirmedNewPassword" type="password" value={changePasswordModel.confirmedNewPassword} placeholder="Confirm New Password..." onGetDataChange={e => handleGetDataChange(e, 'confirmedNewPassword')} />

                    <button type="submit" disabled={loadingState} >
                        {loadingState ? '...' : 'Change Password'}
                    </button>
                </form>
            </div>
        </Style>
    )
}

const Style = styled.div `
    .form_container {
        margin-top: 5vh;

        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        form {
    
            width: 80%;
            text-align: center;
    
            button {
                width: fit-content;
                padding: 5px 15px;
                font-size: 1.2rem;
                border-radius: 5px;
                border: none;
                outline: none;
    
                margin-top: 2vh;
    
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
    }
`