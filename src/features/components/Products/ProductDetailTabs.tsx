import styled from "styled-components"
import { Input } from "../../ui/Forms/Input"
import { InputMoney } from "../../ui/Forms/InputMoney"
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Dropdown } from "../../ui/Forms/Dropdown";
import { productStatus } from "../../../app/utils/helper";
import { ProductUpsertDetailDTO, ProductUpsertDTO } from "../../../app/models/Product";
import { MultipleFileImage } from "../../ui/Forms/MultipleFileImage";
import { ImageUploadDTO, ImageUploadResult } from "../../../app/models/ImageUpload";
import agent from "../../../app/api/agent";

interface Props {
    productName: string;
    isSaving: boolean;
    isClearMode: boolean;
    selectedTabIndex: number;
    productDetails: ProductUpsertDetailDTO[];
    onSetProductUpsert: Dispatch<SetStateAction<ProductUpsertDTO>>;
}

export const ProductDetailTabs = ({ productName, isSaving, isClearMode, selectedTabIndex, productDetails, onSetProductUpsert }: Props) => {

    const uploadArray: ImageUploadDTO[] = Array.from({ length: productDetails.length }, () => ({
        files: null,
        folderPath: '',
        publicIds: '',
        imageDisplay: ''
    }));
    const [uploads, setUploads] = useState<ImageUploadDTO[]>(uploadArray);

    useEffect(() => {
        if (isClearMode) setUploads(uploadArray);
        // eslint-disable-next-line
    }, [isClearMode]);

    useEffect(() => {
        const uploadImagesAsync = async () => {
            let uploadResult: ImageUploadResult = await agent.Upload.uploads(uploads!);

            if (!uploadResult) {
                // have to prop parent to set save = false
                return;
            }
        }
        if (isSaving) {
            uploadImagesAsync();
        }
    })

    // Call when start component
    useEffect(() => {
        if (productDetails.some(d => d.imageUrl)) {
            const result: ImageUploadDTO[] = productDetails.map((d, i) => ({
                files: null,
                folderPath: `products/${productName.trim().toLowerCase()}`,
                publicIds: d.publicId,
                imageDisplay: d.imageUrl
            }));
            setUploads(result);
        }
        // eslint-disable-next-line
    }, [productDetails]);

    const handleUploadChange = (e: any) => {
        const newUpload: ImageUploadDTO = {
            files: e,
            folderPath: `products/${productName.trim().toLowerCase()}`,
            publicIds: '',
            imageDisplay: ''
        };

        setUploads(prev => {
            const updatedUploads = [...prev];
            updatedUploads[selectedTabIndex] = newUpload;
            console.log(updatedUploads);
            
            return updatedUploads;
        })
    }

    const handleGetDataChange = (e: any, key: string) => {
        let newValue;
        switch (key) {
            case 'price':
                newValue = e;
                break;
            case 'productStatus':
                newValue = e.target.value;
                break;
            default:
                newValue = e.target.value;
        }

        const updatedProductUpsertDetail: ProductUpsertDetailDTO = {
            ...productDetails[selectedTabIndex],
            [key]: newValue
        };

        onSetProductUpsert(prev => {
            const updatedProductUpsertDetails = [...prev.productDetails];
            updatedProductUpsertDetails[selectedTabIndex] = updatedProductUpsertDetail;
            return {
                ...prev,
                productDetails: updatedProductUpsertDetails
            };
        })
    }

    return (
        <ProductDetailTabItemStyle >
            <InputMoney id='price' value={productDetails[selectedTabIndex].price} placeholder="Price..." type="text"
                onGetDataChange={(e) => handleGetDataChange(e, 'price')}
            />

            <Input id='color' value={productDetails[selectedTabIndex].color} placeholder="Color..." type="text"
                onGetDataChange={(e) => handleGetDataChange(e, 'color')}
            />

            <Input id='extraName' value={productDetails[selectedTabIndex].extraName} placeholder="Extra Name..." type="text"
                onGetDataChange={(e) => handleGetDataChange(e, 'extraName')}
            />

            <Dropdown
                field="productStatus"
                data={productStatus}
                currentSelectedValue={productDetails[selectedTabIndex].status}
                onGetDataChange={e => handleGetDataChange(e, 'productStatus')}
            />

            <MultipleFileImage
                isClearMode={isClearMode}
                value={uploads[selectedTabIndex].imageDisplay}
                onGetDataChange={e => handleUploadChange(e)}
            />
        </ProductDetailTabItemStyle>
    )
}

const ProductDetailTabItemStyle = styled.div`
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-column-gap: 50px;
    grid-row-gap: 10px;
    padding: 0 3vw;
`