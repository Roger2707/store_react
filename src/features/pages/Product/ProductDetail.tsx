import { useParams } from "react-router-dom"
import styled from "styled-components";
import { ProductImage } from "../../components/ProductDetail/ProductImages";
import { useEffect, useState } from "react";
import { Product } from "../../../app/models/Product";
import agent from "../../../app/api/agent";
import { Loading } from "../../ui/Common/Loading";
import { FaArrowRight } from "react-icons/fa";
import { ProductCartButtons } from "../../components/ProductDetail/ProductCartButtons";
import { ProductTech } from "../../components/ProductDetail/ProductTech";

export const ProductDetail = () => {
    const  [product, setProduct] = useState<Product | null>(null);
    const {id} = useParams();

    useEffect(() => {       
        const fetchProductDetailAsync = async () => {
            try {
                const response = await agent.Product.details(Number(id));              
                setProduct(prev => response);      
            } catch (error: any) {
                console.log(error);
            }
        }
        fetchProductDetailAsync();
    }, [id]);

    return (
        <Style>
            {
                product ?
                    <>
                        <div className="product-detail-layout" >
                            <ProductImage imageUrls={product.imageUrl.split(',')} />
                            <div className="product-detail" >
                                <div className="product-basic-info">
                                    <h1>{product?.name}</h1>
                                    <p>Sku: #{product?.id.toString().padStart(6, '0')}</p>
                                    <p>Description: {product?.description}</p>
                                    <p>Status: {product?.productStatus}</p>
                                    <p>Quantity: {product?.quantityInStock}</p>
                                    <p>Created: {product?.created.toString()}</p>
                                    <p>Category: {product?.categoryName}</p>
                                    <p>Brand: {product?.brandName}</p>
                                    <p>Imported: {product?.brandCountry}</p>               
                                </div>

                                <div className="product-price" >
                                    {
                                        product.discountPrice > 0  ?
                                        <div className="has-discount" >
                                            <p className="old-price">{`${product.price.toLocaleString("vi-VN")}`}</p>
                                            <span><FaArrowRight /></span>
                                            <p className="new-price">{`${product.discountPrice.toLocaleString("vi-VN")} VND`}</p>
                                        </div>
                                        :
                                        <p className="price" >{`${product.price.toLocaleString("vi-VN")} VND`}</p>
                                    }
                                </div>

                                <ProductCartButtons productId={product.id} />
                            </div>
                        </div>    

                        <ProductTech productId={product.id} />   
                    </>
                :
                    <Loading message="Loading..." />

            }
        </Style>
    )
}

const Style = styled.div`
    padding: 10vh 10vw;
    width: 100%;

    .product-detail-layout {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        grid-column-gap: 5vw;

        .product-detail {
            .product-basic-info {
                h1 {
                    font-family: 'Courier New', Courier, monospace;
                }
        
                p {
                    font-size: 1.2rem;
                    font-style: italic;
                    color: gray;
                    word-spacing: 1.5px;
                    margin: 0.8vh 0;
                }
            }

            .product-price {
                .price {
                    color: #FF4433;
                    font-size: 2rem;
                    font-weight: 600;
                    letter-spacing: 1px;
                }

                .has-discount {
                    margin-top: 1vh;
                    display: flex;
                    align-items: center;
                    .old-price {
                        color: darkgray;
                        font-size: 1.2rem;
                        text-decoration: line-through;
                    }

                    span {
                        display: inline-block;
                        margin-left: 1vw;
                        font-size: 1.5rem;
                    }
    
                    .new-price {
                        color: #FF4433;
                        font-size: 2rem;
                        font-weight: 600;
                        letter-spacing: 1px;
                        margin-left: 1.5vw;
                    }
                }
            }
        }
    }

`