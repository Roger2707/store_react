import { useEffect, useState } from "react";
import { FaMinus, FaPlus } from "react-icons/fa";
import styled from "styled-components"
import { useAppDispatch } from "../../../app/store/configureStore";
import { upsertBasket } from "../../../app/store/basketSlice";

interface Props {
    quantity: number;
    productId: string;
}

export const BasketDetailQuantity = ({quantity, productId}: Props) => {
    const [currentQuantity, setCurrentQuantity] = useState<number>(quantity);
    const dispatch = useAppDispatch();

    const handleUpsertQuantity = (mode: number) => {
        try {
            dispatch(upsertBasket({productId: productId, mode: mode}));
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        setCurrentQuantity(prev => quantity);
    }, [quantity]);

    return (
        <Style>
            <button onClick={() => handleUpsertQuantity(0)} >
                <span><FaMinus/></span>     
            </button>
            <span className="current-quantity" >{currentQuantity}</span>
            <button onClick={() => handleUpsertQuantity(1)} >  
                <span><FaPlus/></span>
            </button>
        </Style>
    )
}

const Style = styled.div`
    display: flex;
    align-items: center;

    button {
        border: none;
        color: white;
        padding: 0.5vh 0.5vw;
        border-radius: 3px;
        font-size: 0.6rem;
        cursor: pointer;

        &:first-child {
            background-color: darkred;
        }

        &:last-child {
            background-color: cadetblue;
        }
    }

    span {
        display: inline-block;

        &:nth-child(2) {
            background-color: antiquewhite;
            padding: 0 1.5vw;
        }
    }
`