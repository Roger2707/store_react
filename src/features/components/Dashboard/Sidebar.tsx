import styled from "styled-components"
import { Link } from "react-router-dom";
import { ReactNode } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/store/configureStore";
import { MdLogout } from "react-icons/md";
import { logOutAsync } from "../../../app/store/userSlice";

interface Props {
    onSetPage: (path: string) => void;
    page: string;
    sidebars: {id: number, title: string, path: string, icon: ReactNode}[];
}

export const Sidebar = ({onSetPage, page, sidebars} : Props) => {
    const {user} = useAppSelector(state => state.user);
    const dispatch = useAppDispatch();
    
    return (
        <SidebarStyle>
            <div className="account_info" >
                <div className="account_photo" style={{backgroundImage: `url(${user?.imageUrl || require(`../../assets/images/user-empty.png`)})`}}></div>
                <p>{user?.fullName}</p>
            </div>
            <div className="menus" >
                {
                    sidebars.map(s => {
                        const {id, title, icon, path} = s;
                        return (
                            <Link key={id} to={path} onClick={() => onSetPage(path)} className={`${page === path ? 'active' : ''}`}  >
                                <span className="icon" >{icon}</span>
                                <span className="title" >{title}</span>
                            </Link>
                        )
                    })
                }
            </div>
            <button type="button" onClick={() => dispatch(logOutAsync())} >
                <MdLogout />
            </button>
        </SidebarStyle>
    )
}

const SidebarStyle = styled.div`
    background-color: #36454F;
    color: #fff;
    border-right: 3px solid #BDB5D5;
    padding: 10% 0;
    height: 100%;

    display: flex;
    flex-direction: column;
    align-items: center;

    .account_info {
        width: 100%;
        text-align: center;
        padding: 0 10%;
        .account_photo {
            width: 100%;
            height: 20vh;
            border-radius: 50%;
            background-position: top center;
            background-repeat: no-repeat;
            background-size: cover;
        }

        p {
            font-size: 1.3rem;
            margin: 10px 0;
            font-style: italic;
            text-transform: capitalize;
        }
    }

    .menus {
        margin-top: 5vh;
        a {
            color: #fff;
            text-decoration: none;
            display: flex;
            align-items: center;
            margin: 10px 0;
            font-size: 1.5rem;
            padding: 5px 10px;
    
            span {
                display: inline-block;
                padding: 0;
            }
    
            .icon {
                margin-right: 10px;
            }
    
            .title {
                letter-spacing: 1px;
            }
        }

        .active {
            background-color: #6F8FAF;
        }
    }

    button {
        display: flex;
        justify-content: center;

        padding: 1.8vh 2.5vw;
        border-radius: 10px;
        border: none;
        outline: none;
        opacity: 0.6;
        background-color: #E97451;
        color: #fff;
        font-size: 1.2rem;

        &:hover {
            opacity: 1;
            transition: 0.3s;
            cursor: pointer;
        }
    }

`