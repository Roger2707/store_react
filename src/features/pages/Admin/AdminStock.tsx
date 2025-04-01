import { useEffect, useRef, useState } from "react"
import styled from "styled-components"
import { Input } from "../../ui/Forms/Input";
import { StockUpsertDTO } from "../../../app/models/Stock";
import { Warehouse } from "../../../app/models/Warehouse";
import { ProductWithDetail } from "../../../app/models/Product";
import { Dropdown } from "../../ui/Forms/Dropdown";
import { transactionType } from "../../../app/utils/helper";
import { SearchProductDetailStock } from "../../components/Stock/SearchProductDetailStock";
import { SearchWareHouseStock } from "../../components/Stock/SearchWareHouseStock";
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

const defaultWarehouse : Warehouse = {
    id: '',
    name: '',
    location: ''
}

// 5F3C3A57-1F41-4E32-9C7A-12D4686DBF8B
export const AdminStock = () => {
    const [stockUpsertDTO, setStockUpsertDTO] = useState<StockUpsertDTO>(defaultStockUpsertDTO);
    const [productDetail, setProductDetail] = useState<ProductWithDetail>(defaultProductDetail);
    const [wareHouse, setWareHouse] = useState<Warehouse>(defaultWarehouse);
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const [isLoadData, setIsLoadData] = useState<boolean>(false);
    const productDetailInputRef = useRef<HTMLInputElement | null>(null);
    const wareHouseInputRef = useRef<HTMLInputElement | null>(null);
    const [isOpenSearchProduct, setIsOpenSearchProduct] = useState<boolean>(false);
    const [isOpenSearchWareHouse, setIsOpenSearchWareHouse] = useState<boolean>(false);
    const [actionEnable, setActionEnable] = useState<boolean>(false);
    
    const getProductDetail = async (productDetailId: string) => {
        try {
            setIsLoadData(true);
            const data = await agent.Product.detail(productDetailId)
            setProductDetail(data);
        } catch (error) {
            setStockUpsertDTO(prev => ({...prev, productDetailId: ''}));
            productDetailInputRef?.current?.focus();
        }
        finally {
            setIsLoadData(false);
        }
    }

    const getWarehouse = async (wareHouseId: string) => {
        try {
            setIsLoadData(true);
            const data = await agent.Warehouse.detail(wareHouseId);
            setWareHouse(data);
        } catch (error) {
            setStockUpsertDTO(prev => ({...prev, wareHouseId: ''}));
            wareHouseInputRef?.current?.focus();
        }
        finally {
            setIsLoadData(false);
        }
    }

    const handleLoadDataFromDB = (e: any, key: string) => {
        e.preventDefault();

        const value = e.target.value;
        switch(key)
        {
            case 'productDetailId':
                getProductDetail(value);
                break;
            case 'wareHouseId':
                getWarehouse(value);
                break;
            default:
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
                    console.log(value);
                    
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

    const handleReceiveWarehouse = (warehouse: Warehouse) => {
        if(warehouse) {
            setIsOpenSearchWareHouse(false);
            setWareHouse(warehouse);
            setStockUpsertDTO(prev => ({...prev, wareHouseId: warehouse.id}));   
        }
    }

    useEffect(() => {
        if(stockUpsertDTO.productDetailId !== '' && stockUpsertDTO.wareHouseId !== '') {
            // Get Stock of products
            const fetchQuantity = async () => {
                try {
                    const quantity = await agent.Stocks.getQuantity(stockUpsertDTO.productDetailId);
                    setStockUpsertDTO(prev => ({...prev, quantity: +quantity}));
                } catch (error) {
                    console.error('Error fetching quantity:', error);
                }
              };
          
            fetchQuantity(); 
     
            // Enable Input Actions
            setActionEnable(true); 
        }
    }, [stockUpsertDTO])

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

        {isOpenSearchWareHouse && (
            <Modal title="Search Warehouse" onSetOpen={setIsOpenSearchWareHouse} ><SearchWareHouseStock onReceiveProps={handleReceiveWarehouse} /></Modal>
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
                            onGetDataEnter={(e) => handleLoadDataFromDB(e, 'productDetailId')}
                            ref={productDetailInputRef}
                            disable={actionEnable}
                        />

                        <button type="button" className="btn-search-product" onClick={() => setIsOpenSearchProduct(true)} >
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
                    <div className="stock-warehouse-header" >
                        <Input
                            id="wareHouseId"
                            placeholder="WarehouseID..."
                            type="text"
                            width="100%"
                            value={stockUpsertDTO.wareHouseId}
                            onGetDataChange={e => handleChangeData(e, 'wareHouseId')}
                            onGetDataEnter={(e) => handleLoadDataFromDB(e, 'wareHouseId')}
                            ref={wareHouseInputRef}
                            disable={actionEnable}
                        />

                        <button type="button" className="btn-search-warehouse" onClick={() => setIsOpenSearchWareHouse(true)} >
                            . . .
                        </button>
                    </div>


                    <div className="warehouse" style={{opacity: `${isLoadData ? 0.5 : 1}`}} >
                        <h3>Warehouse:</h3>
                        <div className="warehouse-info" >
                            <Input id="wareHouseName" type="text" value={wareHouse.name} readonly />
                            <Input id="wareHouseLocation" type="text" value={wareHouse.location} readonly />
                        </div>
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
                            width="50%"
                            value={stockUpsertDTO.quantity}
                            onGetDataChange={e => handleChangeData(e, 'quantity')}
                            disable={!actionEnable}
                        />

                        <Dropdown
                            data={transactionType}
                            width="50%"
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
            .stock-warehouse-header {
                display: grid;
                grid-template-columns: 3.8fr 6fr;
                align-items: center;

                .btn-search-warehouse {
                    margin-left: .3vw;
                    display: inline-block;
                    width: 10%;
                    padding: .5vh 0;
                    border-radius: 10%;
                    border: 1px solid #333;
                    outline: none;
                    cursor: pointer;
                }
            }
            .warehouse {
                margin-top: 3vh;
                .warehouse-info {
                    margin-top: .5vh;

                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    grid-column-gap: 1vw;

                    border: 2px dashed #353935;
                    padding: 1vh 1vw;
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