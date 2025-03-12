import { BrandStore } from "../../components/Header/BrandStore"

import styled from "styled-components"
import { Navs } from "../../components/Header/Navs"
import { NavAuth } from "../../components/Header/NavAuth"
import { BasketHeader } from "../../components/Header/BasketHeader"
import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"

export const Header = () => {
    const location = useLocation();
    const [page, setPage] = useState(location.pathname);

    const handleSetPage = (path: string) => {    
        setPage(prev => path);
    }

    // Run when log-out, the active nav will be changed
    useEffect(() => {
        if(location.pathname === '/') setPage(prev => '/');
    }, [location.pathname]);

    return(
        <Head>
            <BrandStore handleSetPage = {handleSetPage}/>
            <Navs onSetPage = {handleSetPage} currentPage = {page} />
            <NavAuth onSetPage = {handleSetPage} currentPage = {page} />
            <BasketHeader onSetPage = {handleSetPage} currentPage = {page} />
        </Head>
    )
}

const Head = styled.header `
    width: 100vw;
    padding: 2vh 0;

    background-color: #28282B;
    color: white;
    padding: 0.6% 10%;

    display: flex;
    justify-content: space-between;
    align-items: center;
`