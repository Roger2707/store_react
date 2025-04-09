import styled from "styled-components"
import { useAppDispatch, useAppSelector } from "../../../app/store/configureStore"
import { useEffect } from "react";
import { getBasket } from "../../../app/store/basketSlice";
import { BasketTable } from "../../components/Basket/BasketTable";
import { BasketSummary } from "../../components/Basket/BasketSummary";
import { BasketEmpty } from "../../components/Basket/BasketEmpty";

export const BasketPage = () => {
    const { isLoadBasket, basket } = useAppSelector(state => state.basket);
    const dispatch = useAppDispatch();

    useEffect(() => {
        if(!isLoadBasket) dispatch(getBasket());
    }, [isLoadBasket, dispatch]);

    return (
        <Styled>
            {
                basket?.items && basket?.items.length > 0 ?
                <>
                    <h2>Basket Details</h2>
                    <div className="grid-container" >
                        <BasketTable basket={basket} />

                        <div className="basket-summary" >
                            <BasketSummary/>
                            {/* <ConfirmAddress/> */}
                        </div>
                    </div>
                </>
                :
                <BasketEmpty/>
            }

        </Styled>
    )
}

const Styled = styled.div`
    padding: 5vh 10%;
    h2 {
        font-size: 2rem;
        font-weight: 500;
        color: #7F00FF;
        font-style: italic;
        letter-spacing: 1px;
        margin-bottom: 2vh;
    }

    .grid-container {
        display: grid;
        grid-template-columns: 6.5fr 3.5fr;
        grid-column-gap: 3vw;

        .basket-summary {
            
        }
    }
`