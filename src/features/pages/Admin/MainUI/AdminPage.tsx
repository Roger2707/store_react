import { Outlet, useLocation } from "react-router-dom"
import styled from "styled-components";
import { Sidebar } from "../../../components/Dashboard/Sidebar";
import { useState } from "react";
import { Dashboard } from "../Dashboard";
import { adminSidebars } from "../../../../app/utils/helper";

export const AdminPage = () => {
    const location = useLocation();
    const [page, setPage] = useState<string>(location.pathname);

    return (
        <AdminStyle>
            <Sidebar onSetPage = {setPage} page={page} sidebars={adminSidebars} />
            <div style={{background: '#E6E6FA', padding: '2vh 2vw', overflowX: 'scroll'}} >
                {
                    location.pathname === '/admin' ?
                        <Dashboard/>
                        :
                        <Outlet/>
                }
            </div>
        </AdminStyle>
    )
}

const AdminStyle = styled.div `
    display: grid;
    grid-template-columns: 1.2fr 8.8fr;

    width: 100vw;
    min-height: 100vh;
    h1 {
        letter-spacing: 1px;
        word-spacing: 1px;
        font-size: 2rem;
        text-transform: capitalize;
        color: #4682B4;
    }
`