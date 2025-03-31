import { useRef, useState } from "react"
import styled from "styled-components"
import { Input } from "../../ui/Forms/Input";
import { StockUpsertDTO } from "../../../app/models/Stock";
import { Warehouse } from "../../../app/models/Warehouse";
import { ProductWithDetail } from "../../../app/models/Product";
import axios from "axios";

const defaultStockUpsertDTO : StockUpsertDTO = {
    productDetailId: '',
    stockId: '',
    stockTransactionId: crypto.randomUUID(),
    warehouseId: '',
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

    const getProductDetail = async (productDetailId: string) => {
        try {
            setIsLoadData(true);
            const {data} = await axios.get(`http://localhost:5110/api/products/get-product-with-detail?productDetailId=${productDetailId}`);
            setProductDetail(data);
        } catch (error) {
            productDetailInputRef?.current?.focus();
        }
        finally {
            setIsLoadData(false);
        }
    }

    const getWarehouse = async (wareHouseId: string) => {
        try {
            setIsLoadData(true);
            const {data} = await axios.get(`http://localhost:5110/api/warehouses/get-warehouse-detail?warehouseId=${wareHouseId}`);
            setWareHouse(data);
        } catch (error) {
            productDetailInputRef?.current?.focus();
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
                setStockUpsertDTO(prev => {
                    return {
                        ...prev
                        , [key] : value
                    }
                })
                break;
            case 'wareHouseId':
                setStockUpsertDTO(prev => {
                    return {
                        ...prev
                        , [key] : value
                    }
                })
                break;
            default:
        }
    }

    const handleSubmit = (e: any) => {
        e.preventDefault();
    }

    return (
        <>
            <h1>Stocks:</h1>
            <StockFormStyle disabled={isSaving} onSubmit={handleSubmit} >
                <div className="stocks-header" >
                    <Input
                        id="productDetailId"
                        placeholder="ProductDetailID..."
                        type="text"
                        value={stockUpsertDTO.productDetailId}
                        onGetDataChange={e => handleChangeData(e, 'productDetailId')}
                        onGetDataEnter={(e) => handleLoadDataFromDB(e, 'productDetailId')}
                        ref={productDetailInputRef}
                    />

                    <Input
                        id="wareHouseId"
                        placeholder="WarehouseID..."
                        type="text"
                        value={stockUpsertDTO.warehouseId}
                        onGetDataChange={e => handleChangeData(e, 'wareHouseId')}
                        onGetDataEnter={(e) => handleLoadDataFromDB(e, 'wareHouseId')}
                        ref={wareHouseInputRef}
                    />
                </div>

                <div className="stocks-display">
                    <div className="products" style={{opacity: `${isLoadData ? 0.5 : 1}`}} >
                        <h3>Product Detail:</h3>
                        <div className="product-detail-info" >
                            <Input id="productName" type="text" value={productDetail.productName} readonly />
                            <Input id="color" type="text" value={productDetail.color} readonly />
                            <Input id="categoryName" type="text" value={productDetail.categoryName} readonly />
                            <Input id="brandName" type="text" value={productDetail.brandName} readonly />
                            <Input id="price" type="text" value={productDetail.price} readonly />
                            <img src={productDetail.imageUrl.split(',')[0]} width={80} height={80} alt="product-detail-first-image" />
                        </div>
                    </div>

                    <div className="warehouse" style={{opacity: `${isLoadData ? 0.5 : 1}`}} >
                        <h3>Warehouse:</h3>
                        <div className="warehouse-info" >
                            <Input id="wareHouseName" type="text" value={wareHouse.name} readonly />
                            <Input id="wareHouseLocation" type="text" value={wareHouse.location} readonly />
                        </div>
                    </div>
                </div>

                <div className="stocks-action" >

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

    .stocks-header {
        
    }

    .stocks-display {
        h3 {
            font-size: 1rem;
            font-style: italic;
            letter-spacing: 1px;
            word-spacing: 1px;
            font-weight: 500;
        }
        .products {
            .product-detail-info {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                grid-column-gap: 1vw;
            }
        }

        .warehouse {
            .warehouse-info {

            }
        }
    }
`