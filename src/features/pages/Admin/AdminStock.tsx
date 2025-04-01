import { useEffect, useRef, useState } from "react"
import styled from "styled-components"
import { Input } from "../../ui/Forms/Input";
import { StockUpsertDTO } from "../../../app/models/Stock";
import { Warehouse, WarehouseProductQuantity } from "../../../app/models/Warehouse";
import { ProductWithDetail } from "../../../app/models/Product";
import { Dropdown } from "../../ui/Forms/Dropdown";
import { transactionType } from "../../../app/utils/helper";
import { SearchProductDetailStock } from "../../components/Stock/SearchProductDetailStock";
import { Modal } from "../../ui/Layout/Modal";
import agent from "../../../app/api/agent";

const defaultStockUpsertDTO : StockUpsertDTO = {
    productDetailId: '',
    stockTransactionId: crypto.randomUUID(),
    wareHouseId: '',
    quantity: 0,
    transactionType: 1,
}

const defaultProductDetail : ProductWithDetail = {
    productDetailId: '',
    imageUrl: '',
    color: '',
    categoryName: '',
    brandName: '',
    price: 0,
    productName: ''
}

// 5F3C3A57-1F41-4E32-9C7A-12D4686DBF8B
export const AdminStock = () => {
    const [stockUpsertDTO, setStockUpsertDTO] = useState<StockUpsertDTO>(defaultStockUpsertDTO);
    const [productDetail, setProductDetail] = useState<ProductWithDetail>(defaultProductDetail);
    const [wareHouses, setWareHouses] = useState<WarehouseProductQuantity[]>([]);

    const [isSaving, setIsSaving] = useState<boolean>(false);
    const [isLoadData, setIsLoadData] = useState<boolean>(false);
    const productDetailInputRef = useRef<HTMLInputElement | null>(null);
    const [isOpenSearchProduct, setIsOpenSearchProduct] = useState<boolean>(false);
    const [actionEnable, setActionEnable] = useState<boolean>(false);
    
    const getProductDetail = async (productDetailId: string) => {
        try {
            setIsLoadData(true);
            const data = await agent.Product.detail(productDetailId)
            setProductDetail(data);

            getQuantityInWarehouse(stockUpsertDTO.productDetailId);
        } catch (error) {
            setStockUpsertDTO(prev => ({...prev, productDetailId: ''}));
            productDetailInputRef?.current?.focus();
        }
        finally {
            setIsLoadData(false);
        }
    }

    const getQuantityInWarehouse = async (productDetailId: string) => {
        try {
            setIsLoadData(true);
            const data = await agent.Warehouse.productQuantity(productDetailId);
            setWareHouses(data);
        } catch (error) {
            
        }
        finally {
            setIsLoadData(false);
        }
    }

    const handleChangeData = (e: any, key: string) => {
        const value = e.target.value;
        switch(key)
        {
            case 'productDetailId':
            case 'wareHouseId':
                setStockUpsertDTO(prev => {
                    return {
                        ...prev
                        , [key] : value
                    }
                })
                break;

            case "quantity":
            case "transactionType":
                setStockUpsertDTO(prev => {
                    return {
                        ...prev
                        , [key] : +value
                    }
                })
                break;
            default:
        }
    }

    const handleReceiveProduct = (product: ProductWithDetail) => {
        if(product) {
            setIsOpenSearchProduct(false);
            setProductDetail(product);
            setStockUpsertDTO(prev => ({...prev, productDetailId: product.productDetailId}));   
        }
    }
    
    useEffect(() => {
        if(productDetail.productDetailId !== '') {
            // Enable Input Actions
            setActionEnable(true); 
        }
    }, [productDetail.productDetailId])

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        
        try {
            setIsSaving(true);

            if(stockUpsertDTO.transactionType === 1) {
                const newStockUpsert : StockUpsertDTO = {
                    ...stockUpsertDTO
                }

                console.log(newStockUpsert);
                
                //await agent.Stocks.upsertStock(newStockUpsert);
            } else {

            }
            
        } catch (error) {
            console.log(error);
        } finally {
            setIsSaving(false);
        }
    }

    return (
        <>
        {isOpenSearchProduct && (
            <Modal title="Search Product:" onSetOpen={setIsOpenSearchProduct} ><SearchProductDetailStock onReceiveProps={handleReceiveProduct} /></Modal>
        )}

        <h1>Stocks:</h1>
        <StockFormStyle disabled={isSaving || isOpenSearchProduct} onSubmit={handleSubmit} >
            <div className="stocks-header" >
                <div className="stock-products" >
                    <div className="stock-products-header" >
                        <Input
                            id="productDetailId"
                            placeholder="ProductDetailID..."
                            type="text"
                            width="100%"
                            value={stockUpsertDTO.productDetailId}
                            onGetDataChange={e => handleChangeData(e, 'productDetailId')}
                            onGetDataEnter={(e) => getProductDetail(e.target.value)}
                            ref={productDetailInputRef}
                            disable={actionEnable}
                        />

                        <button type="button" className="btn-search-product" disabled={actionEnable}
                                onClick={() => setIsOpenSearchProduct(true)} >
                            . . .
                        </button>
                    </div>

                    <div className="products" style={{opacity: `${isLoadData ? 0.5 : 1}`}} >
                        <h3>Product Detail:</h3>
                        <div className="product-detail-info" >
                            <Input id="productName" type="text" value={productDetail.productName} readonly />
                            <Input id="color" type="text" value={productDetail.color} readonly />
                            <Input id="categoryName" type="text" value={productDetail.categoryName} readonly />
                            <Input id="brandName" type="text" value={productDetail.brandName} readonly />
                            <Input id="price" type="text" value={productDetail.price} readonly />
                            <img src={productDetail.imageUrl.split(',')[0]} alt="product-detail-first-image" />
                        </div>
                    </div>
                </div>

                <div className="stock-warehouse" >
                    <h2>Inventory Detail:</h2>
                    <div className="warehouse-detail" >
                        {
                            wareHouses?.map(w => {
                                return (
                                    <div className="warehouse-item" key={w.warehouseId} >
                                        <span>{w.warehouseName}</span>
                                        <span>{w.quantity}</span>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </div>

            <div className="stocks-management" >
                <h3>Stocks Quantity:</h3>
                <div className="stocks-quantity" >
                    <div className="stocks-quantity-input" >
                        <Input
                            id="quantity"
                            placeholder="Quantity..."
                            type="number"
                            width="60%"
                            value={stockUpsertDTO.quantity}
                            onGetDataChange={e => handleChangeData(e, 'quantity')}
                            disable={!actionEnable}
                        />

                        <Dropdown
                            data={transactionType}
                            width="60%"
                            marginTop="1vh"
                            onGetDataChange={e => handleChangeData(e, 'transactionType')}
                            currentSelectedValue={stockUpsertDTO.transactionType}
                            disable={!actionEnable}
                        />

                        <Dropdown
                            data={transactionType}
                            width="60%"
                            marginTop="1vh"
                            onGetDataChange={e => handleChangeData(e, 'transactionType')}
                            currentSelectedValue={stockUpsertDTO.transactionType}
                            disable={!actionEnable}
                        />
                    </div>

                    <div className="stocks-quantity-actions" >
                        <button type="button" >Clear Data</button>
                        <button type="button" disabled={!actionEnable} >Show Transactions</button>
                        <button type="submit" disabled={!actionEnable} >Save</button>
                    </div>
                </div>
            </div>
        </StockFormStyle>
        </>
    )
}

const StockFormStyle = styled.form<{ disabled: boolean }>`   
    height: fit-content;
    min-width: 55vw;

    opacity: ${(props) => (props.disabled ? 0.6 : 1)};
    pointer-events: ${(props) => (props.disabled ? "none" : "auto")};

    margin-top: 2vh;

    .stocks-header {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        grid-column-gap: 3vw;

        h3 {
            font-size: 1rem;
            font-style: italic;
            letter-spacing: 1px;
            word-spacing: 1px;
            font-weight: 500;
        }

        .stock-products {
            .stock-products-header {
                display: grid;
                grid-template-columns: 3.8fr 6fr;
                align-items: center;

                .btn-search-product {
                    margin-left: .3vw;
                    display: inline-block;
                    width: 10%;
                    padding: .5vh 0;
                    border-radius: 10%;
                    border: 1px solid #333;
                    outline: none;
                    cursor: pointer;
                }

                button:disabled {
                    cursor: not-allowed;
                    opacity: 0.6;
                }
            }
            .products {
                margin-top: 3vh;
                .product-detail-info {
                    margin-top: .5vh;

                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    grid-column-gap: 1vw;

                    border: 2px dashed #353935;
                    padding: 1vh 1vw;

                    img {
                        margin-top: 1vh;
                        width: 100%;
                        height: 20vh;
                        background-color: #ccc;
                        color: transparent;
                    }
                }
            }
        }

        .stock-warehouse {
            width: 100%;
            h2 {
                font-size: 1.5rem;
                font-weight: 500;
                font-style: italic;
                margin-bottom: 1vh;
                text-decoration: underline;
                color: #6495ED;
            }
            .warehouse-detail {
                width: 100%;
                height: 90%;
                background-color: #CCCCFF;
                padding: 0.5vh .2vw;
                border-radius: 5px;
                .warehouse-item {
                    display: grid;
                    grid-template-columns: 90% 10%;
                    grid-column-gap: 1vw;

                    padding: .8vh .5vw;
                    background-color: #F0FFFF;
                    margin-top: .2vh;
                    cursor: pointer;
                }
            }
        }
    }

    .stocks-management {
        margin-top: 5vh;
        width: 100%;
        height: 35vh;
        background-color: #B6D0E2;
        padding: 1vh 1vw;
        h3 {
            font-size: 1.5rem;
            color: #353935;
            font-style: italic;
            letter-spacing: 1px;
            word-spacing: 1px;
            margin-bottom: 1.5vh;
            text-decoration: underline;
        }

        .stocks-quantity {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            grid-column-gap: 3vw;

            .stocks-quantity-input {
                
            }

            .stocks-quantity-actions {
                display: grid;
                grid-template-columns: 1fr;
                grid-row-gap: 1vh;
                justify-items: end;

                button {
                    padding: 1.5vh 1vw;
                    font-size: 1.2rem;
                    width: 28%;
                    border-radius: 5px;
                    border: none;
                    outline: none;
                    cursor: pointer;
                    color: #fff;
                    background-color: #FFAC1C;

                    &:first-child {
                        background-color: #40B5AD;
                    }

                    &:last-child {
                        background-color: #FF4433;
                    }
    
                    &:disabled {
                        color: #666; 
                        cursor: not-allowed; 
                        opacity: 0.6;
                        border: 1px solid #aaa; 
                    }
    
                    &:disabled:hover {
                        background-color: #e0e0e0;
                    }
                }
            }
        }
    }
`