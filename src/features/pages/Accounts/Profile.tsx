import styled from "styled-components"
import { Input } from "../../ui/Forms/Input"
import { FileImage } from "../../ui/Forms/FileImage"
import { useAppDispatch, useAppSelector } from "../../../app/store/configureStore"
import { useState } from "react"
import { UserDTO } from "../../../app/models/User"
import { UserAddressRow } from "./UserAdressRow"

export const Profile = () => {
    const {user: currentUser} = useAppSelector(state => state.account);
    const [userDTO, setUserDTO] = useState<UserDTO | null>(currentUser);
    const dispatch = useAppDispatch();

    const handleGetDataChange = (e: any, key: string) => {

    }

    const handleSubmit = (e: any) => {
        e.preventDefault();

        //dispatch(updateUserProfile(userProfile));
    }
    
    return (
        <Style>
            <h1>Profile Information</h1>
            <form onSubmit={handleSubmit} >
                <div className="form_header" >
                    <div className="form_header-wrapper" >
                        <FileImage value={userDTO?.imageUrl || ''} onGetDataChange={e => handleGetDataChange(e, 'imageUrl')}/>
                        <div className="form_header-fields" >
                            <Input 
                                id="fullName" placeholder="FullName..." type="text" width="100%"
                                value={userDTO?.fullName || ''} onGetDataChange={e => handleGetDataChange(e, 'fullName')} 
                            />
                            <Input 
                                id="phoneNumber" placeholder="Phone Number..." type="number" marginTop="1vh" width="100%"
                                value={userDTO?.phoneNumber || ''} onGetDataChange={e => handleGetDataChange(e, 'phoneNumber')} 
                            />
                            <Input id="dob" placeholder="Birthday..." type="date" marginTop="1vh" width="100%"
                                value={userDTO?.dob?.toString().split('T')[0]} onGetDataChange={e => handleGetDataChange(e, 'dob')} 
                            />
                        </div>
                    </div>
                </div>

                <div className="form_details" >
                    <h3>Shipping Address Details:</h3>
                    {
                        userDTO?.userAddresses ?
                        userDTO?.userAddresses?.map((address, index) => {
                            return (
                                <UserAddressRow key={index} userAddress={address} />
                            )
                        })
                        :
                        <p>create address</p>
                    }
                </div>

                {/* <div className="form_footer" >
                    <button disabled={loadingState} type="submit" >
                        {loadingState ? '...' : 'Update'}
                    </button>
                </div> */}
            </form>
        </Style>
    )
}

const Style = styled.div `
    padding: 3vh 2vw;
    h1 {
        color: orangered;
        font-style: italic;
        letter-spacing: 1px;
        word-spacing: 1px;
        margin-bottom: 2vh;
        text-align: center;
    }

    form {     
        .form_header {
            display: flex;
            justify-content: center;
            .form_header-wrapper {
                width: 80%;
                display: grid;
                grid-template-columns: 15% 85%;
                grid-column-gap: 2vw;
    
                .form_header-fields {
                    padding: 4% 2vw 4% 0;
                }
            }
        }

        .form_details {
            h3 {
                margin: 3vh 0;
                color: #acac2c;
                font-style: italic;
                letter-spacing: 1px;
                word-spacing: 1px;
                text-align: center;
                font-size: 1.5rem;
            }
        }

        .form_footer {
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

    }
`