import { useState } from "react";
import styled from "styled-components";
import { useAppDispatch } from "../../../app/store/configureStore";
import { ssignOut } from "../../../app/store/userSlice";
import { Link } from "react-router-dom";
import { setBasket } from "../../../app/store/basketSlice";

interface Props {
    fullname : string;
}

export const UserLoginHeader = ({fullname}: Props) => {
    const [displaySubMenu, setDisplaySubmenu] = useState<boolean>(false);
    const dispatch = useAppDispatch();

    const handleLogOut = () => {
        dispatch(ssignOut(null))
        dispatch(setBasket(null));
    }

    return (
        <Style >
            <p onClick={() => setDisplaySubmenu(!displaySubMenu)} >{fullname}</p>
            {
                displaySubMenu 
                &&
                <ul>
                    <li>
                        <Link to='/profile' onClick={() => setDisplaySubmenu(false)} >View Profile</Link>
                    </li>
                    <li onClick={() => handleLogOut()} >Log - Out</li>
                </ul>         
            }
        </Style>
    )
}

const Style = styled.div `
    position: relative;
    z-index: 10;
    p {
        display: inline-block;
        font-size: 1.1rem;
        font-family: 'Courier New', Courier, monospace;
        font-weight: 700;
        color: #e61d1d;
        cursor: pointer;
    }

    ul {
        position: absolute;
        top: 2vh;
        left: 0;
        list-style: none;
        background-color: #fff;
        border: 1px solid #333;
        color: #333;
        border-radius: 5px;
        overflow: hidden;
        margin-top: 0.5vh;
        width: inherit;

        li {
            width: inherit;
            padding: 5px 10px;
            border-bottom: 1px solid blueviolet;
            
            &:hover {
                cursor: pointer;
                background-color: #EADDCA;
            }

            a {
                text-decoration: none;
                color: #333;
            }
            
        }
    }
`