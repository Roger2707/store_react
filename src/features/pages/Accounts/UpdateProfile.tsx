import styled from "styled-components"
import { Input } from "../../ui/Forms/Input"
import { FileImage } from "../../ui/Forms/FileImage"
import { useAppDispatch, useAppSelector } from "../../../app/store/configureStore"
import { useEffect, useState } from "react"
import { UserProfileUpdate } from "../../../app/models/User"
import { updateUserProfile } from "../../../app/store/accountSlice"

export const UpdateProfile = () => {
    const {loadingState} = useAppSelector(state => state.account);
    const [userProfile, setUserProfile] = useState<UserProfileUpdate>({
        fullName: '',
        dob: new Date(),
        phoneNumber: '',
        imageUrl: null,
    });

    const {user} = useAppSelector(state => state.account);
    const dispatch = useAppDispatch();

    useEffect(() => {
        if(user) {
            setUserProfile(prev => {
                return {
                    ...prev,
                    fullName: user.fullName,
                    dob: user.dob,
                    phoneNumber: user.phoneNumber,
                    imageUrl: null,
                }
            });
        }
    }, [user]); 

    const handleGetDataChange = (e: any, key: string) => {

        if(key === 'imageUrl') {
            setUserProfile(prev => {
                return {
                    ...prev,
                    [key]: e
                };
            })
        }
        else {
            setUserProfile(prev => {
                return {
                    ...prev,
                    [key]: e.target.value
                }
            })
        }
    }

    const handleSubmit = (e: any) => {
        e.preventDefault();
        console.log(userProfile);
        dispatch(updateUserProfile(userProfile));
    }

    return (
        <Style>
            <h1>Your Profile Information:</h1>
            <form onSubmit={handleSubmit} >
                <Input id="fullName" placeholder="FullName..." type="text" value={userProfile.fullName || ''} onGetDataChange={e => handleGetDataChange(e, 'fullName')} />
                <Input id="phoneNumber" placeholder="Phone Number..." type="number" value={userProfile.phoneNumber || ''} onGetDataChange={e => handleGetDataChange(e, 'phoneNumber')} />
                <Input id="dob" placeholder="Birthday..." type="date" value={userProfile.dob?.toString().split('T')[0]} onGetDataChange={e => handleGetDataChange(e, 'dob')} />
                <FileImage value={user?.imageUrl || ''} onGetDataChange={e => handleGetDataChange(e, 'imageUrl')}/>

                <button disabled={loadingState} type="submit" >
                    {loadingState ? '...' : 'Update'}
                </button>
            </form>
        </Style>
    )
}

const Style = styled.div `
    
    form {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 2vw;

        button {
            width: fit-content;
            padding: 5px 15px;
            font-size: 1.2rem;
            border-radius: 5px;
            border: none;
            outline: none;

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