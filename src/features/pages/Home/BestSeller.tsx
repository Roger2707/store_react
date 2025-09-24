import { useEffect, useState } from "react";
import styled from "styled-components";
import agent from "../../../app/api/agent";
import { ProductItem } from "../Products/ProductItem";
import { ProductFullDetailDTO } from "../../../app/models/Product";

export const BestSeller = () => {
    const [products, setProducts] = useState<ProductFullDetailDTO[]>([]);

    useEffect(() => {
        const fetchProductBestSeller = async () => {
            const data: ProductFullDetailDTO[] = await agent.Product.bestSeller();
            if (data) setProducts(data);
            else setProducts([]);
        }
        fetchProductBestSeller();
    }, []);

    return (
        <BestSellerStyle>
            <h1>Best Ratings Products ⭐⭐⭐</h1>
            <div className="best-seller-container" >
                {
                    products && products.map((item, index) => {
                        return (
                            <ProductItem key={index} product={item} />
                        )
                    })
                }
            </div>
        </BestSellerStyle>
    )
}

const BestSellerStyle = styled.div`
    margin-top: 5vh;
    h1 {
        text-align: center;
        font-size: 2.5rem;
        letter-spacing: 3px;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        text-decoration: underline;
    }

    .best-seller-container {
        margin-top: 3vh;
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        grid-column-gap: 5vw;
    }
`