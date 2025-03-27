import { useParams } from "react-router-dom"
import styled from "styled-components";
import { ProductImage } from "../../components/ProductDetail/ProductImages";
import { useEffect, useState } from "react";
import { Product, ProductDetail } from "../../../app/models/Product";
import agent from "../../../app/api/agent";
import { Loading } from "../../ui/Common/Loading";
import { FaArrowRight } from "react-icons/fa";
import { ProductCartButtons } from "../../components/ProductDetail/ProductCartButtons";
import { ProductTech } from "../../components/ProductDetail/ProductTech";

export const ProductDetailPage = () => {
    const  [product, setProduct] = useState<Product | null>(null);
    const [productDetail, setProductDetail] = useState<ProductDetail | null>(null);
    const {id} = useParams();

    useEffect(() => {       
        const fetchProductDetailAsync = async () => {
            try {
                if(id == null) return;
                const response = await agent.Product.details(id);              
                setProduct(prev => response);
                setProductDetail(response.details[0] || null);
            } catch (error: any) {
                console.log(error);
            }
        }
        fetchProductDetailAsync();
    }, [id]);

    const handleChangeColor = (e: any) => {
        if (!product?.details) return;
        const selectedDetail = product.details.find(d => d.color === e.target.value);
        setProductDetail(selectedDetail ?? product.details[0]);
    }

    return (
        <Style>
            {
                product && productDetail ?
                    <>
                        <div className="product-detail-layout" >
                            <ProductImage imageUrls={product.imageUrl.split(',')} />
                            <div className="product-detail" >
                                <div className="product-basic-info">
                                    <h1>{`${product.name} - ${productDetail.extraName}`}</h1>
                                    <p>Sku: #{product.id.toString().padStart(6, '0')}</p>
                                    <p>Description: {product.description}</p>
                                    <p>Status: {product.productStatus}</p>
                                    <p>Created: {product.created.toString()}</p>
                                    <p>Category: {product.categoryName}</p>
                                    <p>Brand: {product.brandName}</p>
                                    <p>Imported: {product.brandCountry}</p>               
                                    <p>Inventory: {productDetail.quantityInStock}</p>
                                </div>

                                <div className="product-color" >
                                    {
                                        product.details.map(d => {
                                            return (
                                                <label key={d.id} className="product-color-option" style={{background: `${d.color}`}} >
                                                    <input checked={productDetail.color === d.color} type="radio" name="product-color" value={d.color} onChange={handleChangeColor} />
                                                </label>
                                            )
                                        })
                                    }
                                    
                                </div>

                                <div className="product-price" >
                                    {
                                        productDetail.discountPrice > 0 ?
                                        <div className="has-discount" >
                                            <p className="old-price">{`${productDetail.price.toLocaleString("vi-VN")}`}</p>
                                            <span><FaArrowRight /></span>
                                            <p className="new-price">{`${productDetail.discountPrice.toLocaleString("vi-VN")} VND`}</p>
                                        </div>
                                        :
                                        <p className="price" >{`${productDetail.price.toLocaleString("vi-VN")} VND`}</p>
                                    }
                                </div>

                                {/* <ProductCartButtons productId={product.id} /> */}
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

            .product-color {
                display: flex;
                align-items: center;

                .product-color-option {
                    display: inline-block;
                    padding: 0.5vh 0.5vh;
                    border-radius: 50%;
                    cursor: pointer;
                    border: 2px solid transparent;
                    transition: 0.3s;
                    position: relative;

                    input {
                        position: absolute;
                        opacity: 0;
                        pointer-events: none;
                    }
                }

                .product-color-option:last-child {
                    margin-left: 2vw;
                }

                // Clicked -> add border
                .product-color-option:has(input:checked) {
                    border: 2px solid darkblue;
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