import styled from "styled-components"
import { Input } from "../../ui/Forms/Input"
import { FileImage } from "../../ui/Forms/FileImage"
import { useAppDispatch, useAppSelector } from "../../../app/store/configureStore"
import { useEffect, useState } from "react"
import { UserAddressDTO, UserDTO } from "../../../app/models/User"
import { UserAddressRow } from "./UserAdressRow"
import { ImageUploadResult, SingleImageUploadDTO } from "../../../app/models/ImageUpload"
import { updateUser } from "../../../app/store/userSlice"
import agent from "../../../app/api/agent"
import { Link } from "react-router-dom"

const defaultUserDTO : UserDTO = {
    userName: '',
    fullName: '',
    email: '',
    token: '',
    role: '',
    publicId: '',
    dob: new Date(),
    phoneNumber: '',
    imageUrl: '',
    basketId: 0,
    userAddresses: [],
}

const defaultUserAdressDTO : UserAddressDTO = {
    id: 0,
    city: '',
    district: '',
    ward: '',
    streetAddress: '',
    country: '',
    postalCode: '',

    guidId: crypto.randomUUID(),
}

const initUpload : SingleImageUploadDTO = {
    file: null,
    folderPath: '',
    publicId: '',
    imageDisplay: ''
}

export const UserProfile = () => {
    const {user: currentUser} = useAppSelector(state => state.user);
    const [userDTO, setUserDTO] = useState<UserDTO>(defaultUserDTO);
    const [upload, setUpload] = useState<SingleImageUploadDTO>(initUpload);
    const dispatch = useAppDispatch();
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    useEffect(() => {
        if(currentUser) {
            setUserDTO(currentUser);
            setUpload(prev => {
                return {
                    ...prev
                    , folderPath: `users/${currentUser.userName.trim().toLowerCase()}`
                    , publicIds: currentUser.publicId

                    // reference for UploadComponent
                    , imageDisplay: currentUser.imageUrl
                }
            });
        }
    }, [currentUser]);

    const handleAddRow = (indexRow: number) => {
        setUserDTO(prev => {
            if(prev.userAddresses.length === 10) return {...prev};   
            const newDetail = defaultUserAdressDTO;
            let updatedUserAddresses = [
                ...prev.userAddresses.slice(0, indexRow + 1),
                newDetail, 
                ...prev.userAddresses.slice(indexRow + 1)
            ];

            return {
                ...prev,
                userAddresses: updatedUserAddresses
            }
        });
        
    }

    const handleRemoveRow = (indexRow: number) => {
        setUserDTO(prev => {
            if(prev.userAddresses.length === 1) {
                const newDetail = defaultUserAdressDTO;
                return {...prev, userAddresses: [newDetail]};   
            }

            let updatedUserAddresses = [
                ...prev.userAddresses.slice(0, indexRow),
                ...prev.userAddresses.slice(indexRow + 1)
            ];

            return {
                ...prev,
                userAddresses: updatedUserAddresses
            }
        });
    }

    const handleGetDataChange = (e: any, key: string) => {
        switch(key) {
            case 'imageUrl':
                setUpload(prev => {
                    return {...prev, file: e };
                });
                break;
            case 'fullName':
            case 'dob':
            case 'phoneNumber':
                setUserDTO(prev => {
                    return {
                        ...prev
                        , [key]: e.target.value
                    }
                })
                break;
            default:
        }
    }

    const handleSubmit = async (e: any) => {
        e.preventDefault();    
        try {
            setIsSubmitting(true);
            let uploadResult : ImageUploadResult = await agent.Upload.uploadSingle(upload);
            if (!uploadResult) {
                console.log('Update Image has some problems !');
                setIsSubmitting(false);
                return;
            }
            const updateUserDTO : UserDTO = {
                ...userDTO
                , imageUrl: uploadResult.imageUrl || userDTO.imageUrl
                , publicId: uploadResult.publicId || userDTO.publicId
            }
            dispatch(updateUser(updateUserDTO));
        } catch (error) {
            console.log(error);
        } finally {
            setIsSubmitting(false);
        }
    }
    
    return (
        <Style disabled={isSubmitting}>
            <h1>Profile Information</h1>
            <form onSubmit={handleSubmit} >
                <div className="form_header" >
                    <div className="form_header-wrapper" >
                        <FileImage value={upload.imageDisplay} 
                                    onGetDataChange={e => handleGetDataChange(e, 'imageUrl')}
                        />
                        <div className="form_header-fields" >
                            <Input 
                                id="fullName" placeholder="FullName..." type="text" width="100%"
                                value={userDTO.fullName} onGetDataChange={e => handleGetDataChange(e, 'fullName')} 
                            />
                            <Input 
                                id="phoneNumber" placeholder="Phone Number..." type="number" marginTop="1vh" width="100%"
                                value={userDTO.phoneNumber || ''} onGetDataChange={e => handleGetDataChange(e, 'phoneNumber')} 
                            />
                            <Input id="dob" placeholder="Birthday..." type="date" marginTop="1vh" width="100%"
                                value={userDTO.dob.toString().split('T')[0]} onGetDataChange={e => handleGetDataChange(e, 'dob')} 
                            />
                        </div>
                    </div>
                </div>

                <div className="form_details" >
                    <h3>Shipping Address Details:</h3>
                    <div className="user_address-details" >
                    {
                        // userDTO?.userAddresses ?
                        // userDTO?.userAddresses?.map((address, index) => {
                        //     return (
                        //         <UserAddressRow key={index} userAddress={address} 
                        //             indexRow={index} onSetUser={setUserDTO}
                        //             onAddRow={handleAddRow} onRemoveRow={handleRemoveRow}
                        //         />
                        //     )
                        // })
                        // :
                        // <UserAddressRow userAddress={defaultUserAdressDTO} 
                        //     indexRow={0} onSetUser={setUserDTO}
                        //     onAddRow={handleAddRow} onRemoveRow={handleRemoveRow}
                        // />
                        userDTO?.userAddresses?.map((address, index) => {
                            return (
                                <UserAddressRow key={index} userAddress={address} 
                                    indexRow={index} onSetUser={setUserDTO}
                                    onAddRow={handleAddRow} onRemoveRow={handleRemoveRow}
                                />
                            )
                        })
                    }
                    </div>
                </div>

                <div className="form_footer" >
                    <Link type="button" to='/change-password' >
                        Change Password
                    </Link>
                    <Link type="button" to='/orders' >
                        Show Orders
                    </Link>
                    <button type="submit" disabled={isSubmitting} >
                        Save
                    </button>
                </div>
            </form>
        </Style>
    )
}

const Style = styled.div<{ disabled: boolean }> `
    padding: 3vh 2vw;
    opacity: ${(props) => (props.disabled ? 0.6 : 1)};
    pointer-events: ${(props) => (props.disabled ? "none" : "auto")};

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

            .user_address-details {
                background-color: #C4A484;
                width: 100%;
                min-height: 30vh;
                border: 3px solid #ccc;
                border-radius: 3px;
            }
        }

        .form_footer {
            width: 100%;
            display: flex;
            justify-content: right;
            margin-top: 1vh;

            &:disabled {
                cursor: block;
            }

            button {
                width: fit-content;
                padding: 5px 15px;
                font-size: 1.2rem;
                border-radius: 5px;
                border: none;
                outline: none;
    
                color: #fff;
                opacity: 0.5;
                min-width: 25vw;
                margin-left: 1vw;
                background: darkred;
    
                &:focus {
                    opacity: 1;
                }
    
                &:hover:enabled {
                    opacity: 1;
                    cursor: pointer;
                }
            }

            a {
                text-decoration: none;
                display: inline-block;
                width: fit-content;
                padding: 5px 15px;
                font-size: 1.2rem;
                border-radius: 5px;
                border: none;
                outline: none;
    
                color: #fff;
                opacity: 0.5;
                min-width: 25vw;
                text-align: center;

                &:hover {
                    opacity: 1;
                    cursor: pointer;
                }

                &:first-child {
                    background: #acac2c;
                    margin-right: 1vw;
                }

                &:nth-child(2) {
                    background: green;
                }
            }
        }

    }
`