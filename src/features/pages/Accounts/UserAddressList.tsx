import styled from "styled-components"
import { useAppDispatch, useAppSelector } from "../../../app/store/configureStore"
import { useEffect } from "react";
import { fetchUserAddressAsync, addEmptyUserAddresses, removeEmptyUserAddress, setUserAddresses } from "../../../app/store/userAddressSlice";
import { AddressInfo } from "./AddressInfo";
import { FaPlus } from "react-icons/fa";
import { toast } from "react-toastify";
import { icons } from "../../../app/utils/helper";
import agent from "../../../app/api/agent";

export const UserAddressList = () => {
    const {loadingUser, userAddresses} = useAppSelector(state => state.userAddress);
    const dispatch = useAppDispatch();

    useEffect(() => {
        if(loadingUser) dispatch(fetchUserAddressAsync());
    }, [loadingUser, dispatch]);

    const handleAddRow = () => {
        if(userAddresses.filter(u => u.id === 0).length > 0) {
            toast.error('There is one address not being saved !', {icon: icons.error});
            return;
        }
        if(userAddresses.length === 3) {
            toast.error('You only can have 3 addresses !', {icon: icons.error});
            return;
        }
        dispatch(addEmptyUserAddresses(null));
    }

    const handleRemoveRow = async (id: number) => {
        if(id === 0) {
            dispatch(removeEmptyUserAddress(null));
        } else {
            try {
                await agent.Account.deleteUserAddress(id);
                dispatch(setUserAddresses(null));
            } catch (error) {
                console.error(error);
            }
        }
    }

    return (
        <Style>
            <h1>Shipping Addresses Details: </h1>
            <button className="btn-create" onClick={handleAddRow} >
                <FaPlus/>
            </button>
            
            {
                userAddresses.map((userAddress, index) => {
                    return <AddressInfo userAddressProps={userAddress} key={index} onRemoveRow={handleRemoveRow} />
                })
            }
        </Style>
    )
}

const Style = styled.div`
    .btn-create {
        margin-top: 2vh;
        padding: 10px 15px;
        width: 5vw;
        border-radius: 20px;
        border: none;
        outline: none;
        background-color: darkblue;
        opacity: 0.6;
        color: #fff;
        &:hover {
            cursor: pointer;
            opacity: 0.8;
            transition: all 0.8s;
        }
    }
`