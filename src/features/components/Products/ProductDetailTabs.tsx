import styled from "styled-components"
import { Input } from "../../ui/Forms/Input"
import { InputMoney } from "../../ui/Forms/InputMoney"
import { Dispatch, forwardRef, SetStateAction, useEffect, useImperativeHandle, useState } from "react";
import { Dropdown } from "../../ui/Forms/Dropdown";
import { productStatus } from "../../../app/utils/helper";
import { ProductUpsertDetailDTO, ProductUpsertDTO } from "../../../app/models/Product";
import { MultipleFileImage } from "../../ui/Forms/MultipleFileImage";
import { ImageUploadDTO } from "../../../app/models/ImageUpload";

interface Props {
    productName: string;
    isClearMode: boolean;
    selectedTabIndex: number;
    productDetails: ProductUpsertDetailDTO[];
    onSetProductUpsert: Dispatch<SetStateAction<ProductUpsertDTO>>;
}

export type UploadsRef = {
    getUploads: () => any;
};

export const ProductDetailTabs = forwardRef<UploadsRef, Props>(({ productName, isClearMode, selectedTabIndex, productDetails, onSetProductUpsert }, ref) => {
    const uploadArray: ImageUploadDTO[] = Array.from({ length: productDetails.length }, () => ({
        files: null,
        folderPath: '',
        publicIds: '',
        imageDisplay: ''
    }));
    const [uploads, setUploads] = useState<ImageUploadDTO[]>(uploadArray);
    const [uploadsOrigin, setUploadsOrigin] = useState<ImageUploadDTO[]>(uploadArray);
    const [value, setValue] = useState<any>();

    useEffect(() => {
        if (isClearMode) {
            console.log(uploadsOrigin);
            console.log(selectedTabIndex);

            setUploads(uploadsOrigin);
            setValue(uploadsOrigin[selectedTabIndex].imageDisplay !== '' ? uploadsOrigin[selectedTabIndex].imageDisplay : uploadsOrigin[selectedTabIndex].files);
        }
        // eslint-disable-next-line
    }, [isClearMode]);

    // ref
    useImperativeHandle(ref, () => ({
        getUploads: () => uploads
    }));

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
            setUploadsOrigin(result);
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
            return updatedUploads;
        })
    }

    useEffect(() => {
        setValue(uploads[selectedTabIndex].imageDisplay !== '' ? uploads[selectedTabIndex].imageDisplay : uploads[selectedTabIndex].files);
    }, [uploads, selectedTabIndex])

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
                value={value}
                onGetDataChange={e => handleUploadChange(e)}
            />
        </ProductDetailTabItemStyle>
    )
})

const ProductDetailTabItemStyle = styled.div`
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-column-gap: 50px;
    grid-row-gap: 10px;
    padding: 1.5vh 2vw;
`