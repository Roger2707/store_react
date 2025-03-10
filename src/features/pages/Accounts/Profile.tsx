import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import styled from "styled-components"
import { Sidebar } from "../../components/Dashboard/Sidebar";
import { accountSidebars } from "../../../app/utils/helper";
import { Dashboard } from "../Admin/Dashboard";

export const Profile = () => {
    const location = useLocation();
    const [page, setPage] = useState<string>(location.pathname);
    return (
        <Style>
            <div className="profile-container" >
                <Sidebar onSetPage = {setPage} page={page} sidebars={accountSidebars} />
                <div style={{background: '#E6E6FA', padding: '2vh 2vw', width: '100%'}} >
                    {
                        location.pathname === '/admin' ?
                            <Dashboard/>
                            :
                            <Outlet/>
                    }
                </div>
            </div>
        </Style>
    )
}

const Style = styled.div `
    height: 90vh;
    .profile-container {
        display: grid;
        grid-template-columns: 1.5fr 8.5fr;
    
        width: 100vw;
        height: 100%;
    
        h1 {
            letter-spacing: 1px;
            word-spacing: 1px;
            font-size: 2rem;
            text-transform: capitalize;
            color: #4682B4;
        }

    }

`