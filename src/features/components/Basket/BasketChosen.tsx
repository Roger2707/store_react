import { useState } from "react";
import styled from "styled-components"
import { useAppDispatch } from "../../../app/store/configureStore";
import { toggleStatusItem } from "../../../app/store/basketSlice";

interface Props {
    basketItemId: string;
    status: boolean;
}

export const BasketChosen = ({basketItemId, status} : Props) => {
    const [currentStatus, setCurrentStatus] = useState<boolean>(status);
    const dispatch = useAppDispatch();

    const handleToggleItem = (itemId: string) => {
        setCurrentStatus(prevState => !prevState);
        try {
            dispatch(toggleStatusItem(itemId));
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <Styled>
            <form>
                <input type="checkbox" checked={currentStatus} onChange={() => handleToggleItem(basketItemId)} />
            </form>
        </Styled>
    ) 
}

const Styled = styled.div `
    
`