import { FaPlus } from "react-icons/fa"
import styled from "styled-components";
import { useAppSelector } from "../../../../app/store/configureStore";

interface Props {
    onOpenCreateForm: () => void;
}

export const ButtonCreateAdmin = ({onOpenCreateForm}: Props) => {
    const {user} = useAppSelector(state => state.user);
    return (
        <ButtonStyle id='btn-create' onClick={onOpenCreateForm} disabled={user?.role === 'SuperAdmin' ? false : true} >
            <span className="btn-icon" ><FaPlus/></span>
            <span className="btn-title" >Create</span>
        </ButtonStyle>
    )
}

const ButtonStyle = styled.button`
    padding: 15px 15px;
    border-radius: 20px;
    border: none;
    outline: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    color: #fff;
    background-color: #F88379;
    margin-right: 10vw;

    .btn-icon {
        display: inline-block;
        margin-right: 5px;
    }

    .btn-title {
        font-size: 1.2rem;
        text-transform: capitalize;
        line-height: 1rem;
        letter-spacing: 1px;
        word-spacing: 1px;
    }      

    &:disabled {
        cursor: not-allowed;
        display: none;
    }
`