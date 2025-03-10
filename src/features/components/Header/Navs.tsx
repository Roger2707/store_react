import styled from "styled-components"
import { navs } from "../../../app/utils/helper"
import { Link } from "react-router-dom";

interface Props {
    onSetPage: (path: string) => void;
    currentPage: string;
}

export const Navs = ({onSetPage, currentPage} : Props) => {
    return (
        <NavContainer>
            {
                navs.map(navItem => {
                    const {id, path, title, icon} = navItem;
                    return (
                        <Link key={id} to={path} onClick={() => onSetPage(path)} className={`${path === currentPage && 'nav-active'}`} >
                            <span>{icon}</span> 
                            <p>{title}</p>
                        </Link>
                    )
                })
            }
        </NavContainer>
    )
}

const NavContainer = styled.div`
    width: fit-content;
    height: fit-content;

    display: flex;
    justify-content: space-between;
    align-items: center;

    a {
        display: flex;
        justify-content: space-between;
        align-items: center;

        text-decoration: none;
        color: white;

        margin: 0 10px;

        span {
            font-size: 25px;
            margin-right: 2px;
        }

        p {

        }
    }

    .nav-active {
        color: goldenrod;
    }
`