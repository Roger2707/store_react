import { useEffect, useState } from "react";
import { FaMinus, FaPlus } from "react-icons/fa";
import styled from "styled-components"
import { useAppDispatch, useAppSelector } from "../../../app/store/configureStore";
import { getBasket, upsertBasket } from "../../../app/store/basketSlice";
import { BasketUpsertParam } from "../../../app/models/Basket";

interface Props {
    productDetailId: string;
}

export const ProductCartButtons = ({productDetailId}: Props) => {
    const {basket, isLoadBasket} = useAppSelector(state => state.basket);
    const [currentQuantity, setCurrentQuantity] = useState<number>(0);
    const dispatch = useAppDispatch();
    useEffect(() => { 
        if(!isLoadBasket) dispatch(getBasket());
    }, [isLoadBasket, dispatch]);

    useEffect(() => {
        if (basket?.items) {
            const foundItem = basket.items.find(item => item.productDetailId === productDetailId);
            if (foundItem) {
                setCurrentQuantity(prev => foundItem.quantity);
            } 
            else setCurrentQuantity(0);
        }
    }, [basket, productDetailId]);

    const handleUpsertQuantity = (mode: number) => {
        try {
            const basketUpsertParam : BasketUpsertParam = {
                productDetailId: productDetailId,
                quantity: 1,
                mode: mode
            }        
            dispatch(upsertBasket(basketUpsertParam));
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <Style>
            <HandleCartQuantity>
                <button onClick={() => handleUpsertQuantity(2)} >
                    <span><FaMinus /></span>
                </button>
                <p>{currentQuantity}</p>
                <button onClick={() => handleUpsertQuantity(1)} >
                    <span><FaPlus /></span>
                </button>
            </HandleCartQuantity>
        </Style>
    )
}

const Style = styled.div`
    .add-cart {
        margin-top: 2vh;
        button {
            border: none;
            padding: 1.5vh 1vw;
            border-radius: 2px;            
            color: #fff;
            background-color: black;
            font-size: 1rem;
            opacity: 0.7;

            display: flex;
            align-items: center;

            &:hover {
                cursor: pointer;
                opacity: 1;
            }
        
            span {
                display: inline-block;
                &:first-child {
                    margin-right: 0.5vw;
                }
            }

            &:focus {
                    opacity: 1;
            }
    
            &:hover:enabled {
                opacity: 1;
                cursor: pointer;
            }
        }
    }
`

const HandleCartQuantity = styled.div`
    display: inline-flex;
    align-items: center;
    margin-top: 2vh;

    p {
        display: inline-block;
        padding: 10px 1vw;
        background-color: #fff;
        font-style: italic;
    }

    button {
        background-color: #088F8F;
        color: #fff;
        border: none;
        outline: none;
        padding: 10px;
        border-radius: 2px;
        opacity: 0.8;

        &:hover {
            cursor: pointer;
            opacity: 1;
        }

        &:last-child {
            background-color: darkred;
        }
    }
`