import styled from "styled-components"
import { useAppSelector } from "../../../app/store/configureStore"
import { BasketTable } from "../../components/Basket/BasketTable";
import { BasketSummary } from "../../components/Basket/BasketSummary";
import { BasketEmpty } from "../../components/Basket/BasketEmpty";
import { BasketUserAddresses } from "../../components/Basket/BasketUserAddresses";

export const BasketPage = () => {
    const { basket } = useAppSelector(state => state.basket);
    return (
        <Styled>
            {
                basket?.items && basket?.items.length > 0 ?
                    <>
                        <h2>Basket Details</h2>
                        <div className="grid-container" >
                            <BasketTable basket={basket} />

                            <div className="basket-summary" >
                                <BasketSummary />
                                <BasketUserAddresses />
                            </div>
                        </div>
                    </>
                    :
                    <BasketEmpty />
            }

        </Styled>
    )
}

const Styled = styled.div`
    padding: 5vh 0;
    h2 {
        font-size: 2rem;
        font-weight: 500;
        color: #722F37;
        font-style: italic;
        letter-spacing: 1px;
        margin-bottom: 2vh;
    }

    .grid-container {
        display: grid;
        grid-template-columns: 6.5fr 3.5fr;
        grid-column-gap: 3vw;

        min-height: 50vh;

        .basket-summary {
            
        }
    }
`