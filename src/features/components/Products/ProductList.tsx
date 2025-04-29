import styled from "styled-components";
import { ProductDetailDisplayDTO } from "../../../app/models/Product"
import { ProductItem } from "./ProductItem";
import { EmptyData } from "../../ui/Layout/EmptyData";

interface Props {
    products: ProductDetailDisplayDTO[] | undefined;
}

export const ProductList = ({products} : Props) => {     
    return (
        <>
        {
            products === undefined ? 
            <EmptyData message="Can not find Products 😥 Try again !" />
            :
            <ProductGridContainerStyle>
                {products.map(p => {
                    return <ProductItem key={p.productDetailId} product={p}/>
                })}
            </ProductGridContainerStyle>
        }
        </>
    )
}



const ProductGridContainerStyle = styled.div`
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    grid-column-gap: 2vw;
    grid-row-gap: 3vh;
    padding-bottom: 30px;
`