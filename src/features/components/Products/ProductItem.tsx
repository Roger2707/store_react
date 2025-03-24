import { FaRegStar } from "react-icons/fa";
import { Product } from "../../../app/models/Product"
import styled from "styled-components";
import { Link } from "react-router-dom";

interface Props {
    product: Product;
}

export const ProductItem = ({product} : Props) => {
    const {id, name, imageUrl, details} = product;

    return (
        <ProductItemStyle>
            <Link to={`${id}`} className="product-item" >
                <img src={imageUrl.split(',')[0]} alt="img" />
                <div className="product-item-detail" >
                    <div className="product-heading">
                        <p>{name}</p>
                        <span>Id: #{id.toString().padStart(6, '0')}</span>
                    </div>
                    <div className="product-desc">
                        <div className="product-prices" >
                            <p className={`product-price ${details[0].price !== 0 && 'price-line'}`} >{details[0].price.toLocaleString('vi-VN')}</p>
                            {details[0].discountPrice !== 0 && <p className="product-discount">{details[0].discountPrice.toLocaleString('vi-VN')}</p>}
                        </div>

                        <div className="product-ratings" >
                            <span className="rating-icon" ><FaRegStar/></span>
                            <span className="rating-icon" ><FaRegStar/></span>
                            <span className="rating-icon" ><FaRegStar/></span>
                            <span className="rating-icon" ><FaRegStar/></span>
                            <span className="rating-icon" ><FaRegStar/></span>
                        </div>
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
                font-weight: 500;
                color: gray;
                font-style: italic;
                font-size: 1.2rem;

                line-height: 1.2rem;
                height: 1.2rem;
                overflow: hidden;
            }
            margin: 0.3rem 0;

            span {
                display: block;
                font-weight: 500;
                color: gray;
                font-style: italic;

                margin-top: 5px;
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