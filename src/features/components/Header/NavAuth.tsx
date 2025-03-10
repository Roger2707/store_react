import styled from "styled-components"
import { navAuth } from "../../../app/utils/helper"
import { Link } from "react-router-dom"
import { useAppSelector } from "../../../app/store/configureStore";
import { UserLoginHeader } from "./UserLoginHeader";

interface Props {
    onSetPage: (path: string) => void;
    currentPage: string;
}

export const NavAuth = ({onSetPage, currentPage} : Props) => {
    const {user} = useAppSelector(state => state.account);
    return (
        <NavAuthStyles>
            {
                user != null ?
                <UserLoginHeader fullname={user.fullName} />
                :
                navAuth.map(item => {
                    const {id, path, title} = item;
                    return (
                        <Link key={id} to={path} onClick={() => onSetPage(path)} className={`${path === currentPage && 'nav-active'}`} >
                            {title}
                        </Link>
                    )
                })
            }
        </NavAuthStyles>
    )
}

const NavAuthStyles = styled.div`
    a {
        color: white;
        text-decoration: none;
        span {
            display: inline-block;
            color: white;
            text-transform: lowercase;
            font-size: 15px;
            font-style: italic;
            letter-spacing: 0.5px;
            word-spacing: 1px;
            margin: 0 5px;
        }
    }

    .nav-active {
        color: goldenrod;
        font-size: 20px;
    }

`

