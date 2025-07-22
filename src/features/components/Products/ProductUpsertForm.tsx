import styled from "styled-components"
import { useEffect, useRef, useState } from "react";
import { Input } from "../../ui/Forms/Input";
import { Textarea } from "../../ui/Forms/Textarea";
import { Dropdown } from "../../ui/Forms/Dropdown";
import agent from "../../../app/api/agent";
import { useQueryClient } from "@tanstack/react-query";
import { ProductDTO, ProductUpsertDetailDTO, ProductUpsertDTO } from "../../../app/models/Product";
import { ProductDetailTabs, UploadsRef } from "./ProductDetailTabs";
import { ImageUploadDTO, ImageUploadResult } from "../../../app/models/ImageUpload";
import { useAppSelector } from "../../../app/store/configureStore";

interface Props {
    productId: string;
    isCreateMode: boolean;
    onSetOpenForm: (e: boolean) => void;
}

export const ProductUpsertForm = ({ productId, isCreateMode, onSetOpenForm }: Props) => {
    const { categoriesDropdown } = useAppSelector(state => state.category);
    const { brandsDropdown } = useAppSelector(state => state.brand);

    const queryClient = useQueryClient();
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isClearMode, setIsClearMode] = useState<boolean>(false);
    const [selectedTab, setSelectedTab] = useState<number>(0);
    const childRef = useRef<UploadsRef>(null);

    const initProduct: ProductUpsertDTO = {
        id: productId,
        name: '',
        description: '',
        created: new Date().toISOString(),
        categoryId: crypto.randomUUID(),
        brandId: crypto.randomUUID(),
        productDetails: [{ color: '', price: 0, id: crypto.randomUUID(), productid: productId, extraName: '', status: 1, imageUrl: '', publicId: '' }]
    }

    // State Origin -> use when clear form
    const [productUpsertOrigin, setProductUpsertOrigin] = useState<ProductUpsertDTO>(initProduct);

    //#region Get / Init Data Component
    const [productUpsert, setProductUpsert] = useState<ProductUpsertDTO>(initProduct);

    useEffect(() => {
        const fetchProductDetailAsync = async () => {
            try {
                if (isCreateMode) return;

                setIsLoading(true);
                const response: ProductDTO = await agent.Product.singleDTO(productId);
                const categoryId = categoriesDropdown.find(dropdown => dropdown.title === response.categoryName)?.value;
                const brandId = brandsDropdown.find(dropdown => dropdown.title === response.brandName)?.value;

                const productUpsert: ProductUpsertDTO = {
                    id: productId,
                    name: response.name,
                    description: response.description,
                    created: response.created.toString(),
                    categoryId,
                    brandId,

                    // details
                    productDetails: response.details.map(d => {
                        return {
                            id: d.id,
                            productid: productId,
                            price: d.originPrice,
                            color: d.color,
                            extraName: d.extraName,
                            status: d.status === 'Active' ? 1 : 0,
                            imageUrl: d.imageUrl,
                            publicId: d.publicId,
                        }
                    })
                }
                //////////////////////////////////////////////////////////////////////////
                setProductUpsert(productUpsert);

                // Set State Origin
                setProductUpsertOrigin(productUpsert);
            } catch (error: any) {

            }
            finally {
                setIsLoading(false);
            }
        }
        // If id !== 0 -> Update -> Fetch Existed Product data
        if (!isCreateMode) fetchProductDetailAsync();

        // eslint-disable-next-line
    }, [isCreateMode, productId]);

    //#endregion

    //#region Change Events

    const handleGetDataChange = (e: any, key: string) => {
        setProductUpsert(prev => {
            return { ...prev, [key]: e.target.value };
        });
    }

    const handleClearData = () => {
        setIsClearMode(true);
        setProductUpsert(productUpsertOrigin);
    }

    //#endregion

    //#region Submit Form

    const handleCloseForm = () => {
        onSetOpenForm(false);
    }

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setIsSaving(true);

        // get uploads 
        const uploads = childRef.current?.getUploads();
        try {
            const uploadTasks = uploads.map(async (upload: ImageUploadDTO) => {
                try {
                    const result = await agent.Upload.uploads(upload);
                    return result as ImageUploadResult;
                } catch (error) {
                    console.error("Upload error:", error);
                }
            });

            const results: (ImageUploadResult)[] = await Promise.all(uploadTasks);
            if (results.length > 0) {
                let newProductDetails = productUpsert.productDetails;
                let i = 0;
                for (var item of newProductDetails) {
                    if (results[i].messages.includes('success')) {
                        item.imageUrl = results[i].imageUrl;
                        item.publicId = results[i].publicId;
                    }
                    i++;
                }
                const updatedProduct: ProductUpsertDTO = {
                    ...productUpsert
                    , productDetails: newProductDetails
                }

                if (isCreateMode) await agent.Product.create(updatedProduct);
                else await agent.Product.update(updatedProduct);

                queryClient.invalidateQueries({ queryKey: ['products'] });
                handleCloseForm();
            }

        } catch (err) {
            console.error(err);
        }
        finally {
            setIsSaving(false);
        }
    }

    //#endregion

    const handleChangeTab = (index: number) => {
        setSelectedTab(index);
    }

    const handleAddTab = () => {
        const newTab: ProductUpsertDetailDTO = { color: '', price: 0, id: crypto.randomUUID(), productid: productId, extraName: '', status: 1, imageUrl: '', publicId: '' }
        setProductUpsert(prev => {
            return {
                ...prev,
                productDetails: [...prev.productDetails, newTab]
            }
        })
    }

    const handleRemoveTab = () => {
        const id = productUpsert.productDetails[selectedTab].id;
        const updatedProductDetails = productUpsert.productDetails.filter(d => d.id !== id);
        setSelectedTab(0);
        setProductUpsert(prev => {
            return {
                ...prev,
                productDetails: updatedProductDetails
            }
        })
    }

    return (
        <ProductUpsertStyle onSubmit={handleSubmit} disabled={isSaving || isLoading} >
            <div className="product-header-container" >
                <div className="product-fields-group-1" >
                    <Input id='name' value={productUpsert.name} placeholder="Name..." type="text"
                        onGetDataChange={(e) => handleGetDataChange(e, 'name')}
                    />
                    <Dropdown field="category" data={categoriesDropdown} currentSelectedValue={productUpsert.categoryId} onGetDataChange={e => handleGetDataChange(e, 'categoryId')} />
                    <Dropdown field="brand" data={brandsDropdown} currentSelectedValue={productUpsert.brandId} onGetDataChange={e => handleGetDataChange(e, 'brandId')} />
                </div>

                <div className="product-fields-group-2">
                    <Textarea id='description' value={productUpsert.description} placeholder="Description..."
                        onGetDataChange={e => handleGetDataChange(e, 'description')}
                    />
                </div>
            </div>
            <div className="product-detail-container" >
                <div className="product-detail-tab-header" >
                    <div className="product-detail-add-remove">
                        <button className="btn-new-tab" type="button" onClick={handleAddTab} >+</button>
                        <button className="btn-remove-tab" type="button" onClick={handleRemoveTab} >-</button>
                    </div>
                    <div className="product-detail-tab-page" >
                        {
                            productUpsert.productDetails.map((_, index) => {
                                return (
                                    <button key={index} type="button" className={`product-header-item ${selectedTab === index ? 'active' : ''}`} onClick={() => handleChangeTab(index)} >
                                        {index}
                                    </button>
                                )
                            })
                        }
                    </div>
                </div>

                <ProductDetailTabs productName={productUpsert.name} isClearMode={isClearMode}
                    selectedTabIndex={selectedTab} onSetProductUpsert={setProductUpsert} productDetails={productUpsert.productDetails}
                    ref={childRef}
                />

            </div>

            <div className="form_controls" >
                <button className="btn-submit" type="submit">Submit</button>
                <button className="btn-clear" type="button" onClick={handleClearData}>Clear</button>
            </div>
        </ProductUpsertStyle>
    )
}

const ProductUpsertStyle = styled.form<{ disabled: boolean }>`   
    height: fit-content;
    min-width: 55vw;

    opacity: ${(props) => (props.disabled ? 0.6 : 1)};
    pointer-events: ${(props) => (props.disabled ? "none" : "auto")};

    .product-header-container {
        
        .product-fields-group-1 {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            grid-column-gap: 1vw; 
            height: fit-content;   
        }

        .product-fields-group-2 {
            display: grid;
            grid-template-columns: repeat(1, 1fr);
            grid-column-gap: 10%;   
            height: fit-content;
            margin-top: 1vh;
        }
    }

    .product-detail-container {
        width: 100%;
        height: fit-content;
        padding: 0vh 0vw 1vh .1vw;
        background-color: #93a2b8;
        margin-top: 2vh;

        .product-detail-tab-header {
            display: grid;
            grid-template-columns: 0.3fr 9.7fr;
            background-color: #6082B6;
            height: 5vh;

            .product-detail-add-remove {
                display: flex;
                flex-direction: column;
                height: fit-content;
                margin-right: 5px;
                padding: 3px;
                button {
                    padding: 1px;
                    border: none;
                    outline: none;
                    min-width: 25px;
                    margin-bottom: 5px;
                    cursor: pointer;
                    border-radius: 3px;

                    &:hover {
                        background-color: #93a2b8;
                        color: #fff;
                        transition: 0.5s;
                    }
                }
            }

            .product-detail-tab-page {
                display: flex;
                justify-content: center;
                align-items: center;
                padding: 1vh 10%;
                margin-bottom: 2vh;
    
                .product-header-item {
                    padding: 5px 20px;
                    background-color: #fff;
                    border: 1px solid #ccc;
                    border: none;
                    outline: none;
                    border-radius: 2px;
                    margin-right: 1vw;
    
                    &:hover {
                        cursor: pointer;
                        background-color: #e2734a;
                        color: #fff;
                        transition: 0.5s;
                    }
                }
                .active {
                    background-color: orangered;
                    color: #fff;
                }
            }
        }
    }

    .form_controls {
        margin-top: 3vh;
        display: flex;
        justify-content: right; 
        border-top: 2px solid #6082B6;
        padding-top: 1vh;

        .btn-submit,
        .btn-clear {
            padding: 10px 20px;
            font-size: 1.1rem;
            border-radius: 10px;
            border: none;
            outline: none;
            background-color: #EE4B2B;
            color: white;
            opacity: 0.8;

            &:hover {
                cursor: pointer;
                opacity: 1;
                transition: 0.5s;
            }

            &:first-child {
                margin-right: 1vw;
            }
        }

        .btn-clear {
            background-color: #6082B6;
        }
    }
`