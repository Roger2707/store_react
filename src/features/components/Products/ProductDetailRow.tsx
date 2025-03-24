import styled from "styled-components"
import { Input } from "../../ui/Forms/Input"
import { InputMoney } from "../../ui/Forms/InputMoney"
import { ProductUpsert, ProductUpsertDetail } from "../../../app/models/Product"
import { Dispatch, SetStateAction } from "react";

interface Props {
    productDetail : ProductUpsertDetail;
    onSetProduct: Dispatch<SetStateAction<ProductUpsert>>;
}

export const ProductDetailRow = ({productDetail, onSetProduct}: Props) => {

    const handleGetDataChange = (e: any, key: string) => {
        const newValue = e.target.value;

        const updatedProductDetail = { 
            ...productDetail, 
            [key]: newValue 
        };
        
        onSetProduct(prev => {
            let index = prev.productDetails.findIndex(p => p.id === productDetail.id);
            const updatedProductDetails = [...prev.productDetails];
            updatedProductDetails[index] = updatedProductDetail;

            return {
                ...prev,
                productDetails: updatedProductDetails
            };
        })
    }

    return (
        <Row>
            <div className="handle-row-action" >
                <button>+</button>
                <button>-</button>
            </div>
            <InputMoney id='price' value={productDetail.price} placeholder="Price..." type="text"
                onGetDataChange={(e) => handleGetDataChange(e, 'price')} 
            />
            <Input id='quantityInStock' value={productDetail.quantityInStock} placeholder="Quantity..." type="number" 
                onGetDataChange={(e) => handleGetDataChange(e, 'quantityInStock')} 
            />
            <Input id='color' value={productDetail.color} placeholder="Color..." type="text" 
                onGetDataChange={(e) => handleGetDataChange(e, 'color')} 
            />
            <Input id='extraName' value={productDetail.extraName} placeholder="Extra Name..." type="text" 
                onGetDataChange={(e) => handleGetDataChange(e, 'extraName')} 
            />
        </Row>
    )
}

const Row = styled.div`
    display: grid;
    grid-template-columns: 4% 23.5% 23.5% 23.5% 23.5%;
    grid-column-gap: .2vw;
    align-items: center;

    border: 1px solid black;
    padding: 0.3vh 0;
    margin-bottom: .1vh;
    border-radius: 5px;

    .handle-row-action {
        text-align: center;
        button {
            display: inline-block;
            padding: 0px 2px;
            min-width: 15px;
            cursor: pointer;

            &:last-child {
                margin-left: 2px;
            }
        }
    }
`