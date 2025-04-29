import { ProductDetailDisplayDTO } from "../../../app/models/Product"
import styled from "styled-components";
import { Link } from "react-router-dom";
import { ProductRatings } from "../Rating/ProductRatings";

interface Props {
    product: ProductDetailDisplayDTO;
}

export const ProductItem = ({product} : Props) => {
    const { productId, productName, imageUrl, price, discountPrice, stars} = product;

    return (
        <ProductItemStyle>
            <Link to={`${productId}`} className="product-item" >
                <img src={imageUrl.split(',')[0]} alt="img" />
                <div className="product-item-detail" >
                    <div className="product-heading">
                        <p>{productName}</p>
                    </div>
                    <div className="product-desc">
                        <div className="product-prices" >
                            <p className={`product-price ${price !== 0 && 'price-line'}`} >{price.toLocaleString('vi-VN')}</p>
                            {discountPrice !== 0 && <p className="product-discount">{discountPrice.toLocaleString('vi-VN')}</p>}
                        </div>

                        <ProductRatings stars = {stars} />
                    </div>
                </div>
            </Link>
        </ProductItemStyle>
    )
}

const ProductItemStyle = styled.div `
    width: 100%;
    box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.5);
    border-radius: 5px;
    height: 42vh;
    background: #FAF9F6;
    overflow: hidden;

    a {
        text-decoration: none;
        color: #333;
    }

    img {
        width: 100%;
        height: 25vh;

        display: block;
        background-color: #ccc;
    }

    .product-item-detail {
        padding: 5px 10px;

        .product-heading {
            p {
                text-align: center;
                font-style: italic;
                font-size: 1.2rem;
                font-family: Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif;
                overflow: hidden;
                height: 1.2rem;
                margin: 0.3rem 0;
            }
        }

        .product-desc {         
            .product-prices {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin: 0.3rem 0;

                .product-price {
                    font-size: 0.8rem;
                    color: #ccc;
                }
    
                .price-line {
                    font-size: 0.9rem;
                    text-decoration: line-through;
                }
    
                .product-discount {
                    color: red;
                    font-size: 1.1rem;
                    font-weight: 700;

                    padding: 3px;
                    background-color: #eb4c0e;
                    color: #fff;
                    border-radius: 3px;

                    animation: rotateDiscountPrice linear 1.2s infinite;
                    margin: 0.3rem 0;
                }

                @keyframes rotateDiscountPrice {
                    0% {
                        transform: rotate(0);
                    }
                    50% {
                        transform: rotate(-10deg);
                    }
                    100% {
                        transform: rotate(0);
                    }
                }
            }
        }
    }
`