import styled from "styled-components";

interface Props {
    children: any;
}

export const Container = ({children} : Props) => {
    return <ContainerStyle>{children}</ContainerStyle>
}

const ContainerStyle = styled.div`
    width: 100vw;

    padding: 0 10%;

    overflow-x: hidden;

    padding-bottom: 100px;
`