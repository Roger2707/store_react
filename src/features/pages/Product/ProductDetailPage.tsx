import { useParams } from "react-router-dom"
import styled from "styled-components";
import { ProductImage } from "../../components/ProductDetail/ProductImages";
import { useEffect, useState } from "react";
import agent from "../../../app/api/agent";
import { Loading } from "../../ui/Common/Loading";
import { FaArrowRight } from "react-icons/fa";
import { ProductTech } from "../../components/ProductDetail/ProductTech";
import { ProductCartButtons } from "../../components/ProductDetail/ProductCartButtons";
import { ProductDetailDTO, ProductDTO } from "../../../app/models/Product";

export const ProductDetailPage = () => {
    const [product, setProduct] = useState<ProductDTO | null>(null);
    const [productDetail, setProductDetail] = useState<ProductDetailDTO | null>(null);
    const { productId, productDetailId } = useParams();

    useEffect(() => {
        if (product) return;

        const fetchProductDetailAsync = async () => {
            try {
                if (productId == null || productDetailId == null) return;

                const response: ProductDTO = await agent.Product.singleDTO(productId);

                setProduct(prev => response);
                setProductDetail(response.details.find(d => d.id === productDetailId) || null);

            } catch (error: any) {
                console.log(error);
            }
        }

        fetchProductDetailAsync();
        // eslint-disable-next-line
    }, []);

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
                            <ProductImage imageUrls={product.details[0].imageUrl.split(',')} />
                            <div className="product-detail" >
                                <div className="product-basic-info">
                                    <h1>{`${product.name} - ${productDetail.extraName}`}</h1>
                                    <p>DetailId: #{productDetail.id}</p>
                                    <p>Description: {product.description}</p>
                                    <p>Created: {product.created.toString()}</p>
                                    <p>Category: {product.categoryName}</p>
                                    <p>Brand: {product.brandName}</p>
                                    <p>Imported: {product.brandCountry}</p>
                                </div>

                                <div className="product-color" >
                                    {
                                        product.details.map(d => {
                                            return (
                                                <label key={d.id} className="product-color-option" style={{ background: `${d.color}` }} >
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
                                                <p className="old-price">{`${productDetail.originPrice.toLocaleString("vi-VN")}`}</p>
                                                <span><FaArrowRight /></span>
                                                <p className="new-price">{`${productDetail.discountPrice.toLocaleString("vi-VN")} VND`}</p>
                                            </div>
                                            :
                                            <p className="price" >{`${productDetail.originPrice.toLocaleString("vi-VN")} VND`}</p>
                                    }
                                </div>

                                <ProductCartButtons productDetailId={productDetail.id} />
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
    padding: 10vh 0;
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