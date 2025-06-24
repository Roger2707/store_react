import styled from "styled-components"
import { Product, ProductUpsert, ProductUpsertDetail } from "../../../app/models/Product";
import { useEffect, useRef, useState } from "react";
import { Input } from "../../ui/Forms/Input";
import { Textarea } from "../../ui/Forms/Textarea";
import { Dropdown, DropdownData } from "../../ui/Forms/Dropdown";
import { Category } from "../../../app/models/Category";
import { Brand } from "../../../app/models/Brand";
import { MultipleFileImage } from "../../ui/Forms/MultipleFileImage";
import { useCategories } from "../../Hooks/useCategories";
import { useBrands } from "../../Hooks/useBrands";
import agent from "../../../app/api/agent";
import { useQueryClient } from "@tanstack/react-query";
import { ProductDetailRow } from "./ProductDetailRow";
import { ImageUploadDTO, ImageUploadResult } from "../../../app/models/ImageUpload";

interface Props {
    productId: string;
    isCreateMode: boolean;
    onSetOpenForm: (e: boolean) => void;
}

export const ProductUpsertForm = ({productId, isCreateMode, onSetOpenForm}: Props) => {
    const {data: categories} = useCategories();
    const {data: brands} = useBrands();
    const queryClient = useQueryClient();
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isClearMode, setIsClearMode] = useState<boolean>(false);
    const colorRefs = useRef<(HTMLInputElement | null)[]>([]);
    const [error, setError] = useState<string>('');

    const initProduct : ProductUpsert = {
        id : productId,
        name: '',
        description: '',
        imageUrl: '',
        publicId: '',
        created: new Date().toISOString(),
        categoryId: crypto.randomUUID(),
        brandId: crypto.randomUUID(),
        productDetails: [{color: '', price: 0, id: crypto.randomUUID(), productid: productId, extraName: '', status: 1}]
    }

    const initUpload : ImageUploadDTO = {
        files: null,
        folderPath: '',
        publicIds: '',
        imageDisplay: ''
    }

    // State Origin -> use when clear form
    const [originState, setOriginState] = useState<ProductUpsert>(initProduct)
    const [originUpload, setOriginUpload] = useState<ImageUploadDTO>(initUpload);

    //#region Get / Init Data Component
    const [product, setProduct] = useState<ProductUpsert>(initProduct);
    const [upload, setUpload] = useState<ImageUploadDTO>(initUpload);

    const [categoriesDropdown, setCategoriesDropdown] = useState<DropdownData[]>([]);
    const [brandsDropdown, setBrandsDropdown] = useState<DropdownData[]>([]);

    //#region Set Data for dropdown

    useEffect(() => {     
        if(categories && categories.length > 0) {
            const defaultCategory : Category = {
                id: '',
                name: ''
            }
            let newCategories : Category[] = [defaultCategory, ...categories];

            setCategoriesDropdown(prev => {
                return newCategories?.map((d: Category) => {
                    return {title: d.name, value: d.id};
                });                
            });
        }

        if(brands && brands.length > 0) {     
            const defaultBrand : Brand = {
                id: '',
                name: '',
                country: ''
            }
            let newBrands : Brand[] = [defaultBrand, ...brands];

            setBrandsDropdown(prev => {
                return newBrands.map((d: Brand) => {
                    return {title: d.name, value: d.id};
                });                
            })
        }

    }, [categories, brands]);

    //#endregion

    useEffect(() => {
        const fetchProductDetailAsync = async () => {
            try {
                if(isCreateMode) return;
                setIsLoading(true);
                const response : Product = await agent.Product.singleDTO(productId);
                
                const productUpsert : ProductUpsert = {
                    id: productId,
                    name: response.name,
                    description: response.description,
                    imageUrl: response.imageUrl,
                    publicId: response.publicId,
                    created: response.created.toString(),
                    categoryId: response.categoryId,
                    brandId: response.brandId,

                    // details
                    productDetails: response.details.map(d => {
                        return {
                            id: d.id,
                            productid: productId,
                            color: d.color,
                            extraName: d.extraName,
                            price: d.price,
                            status: d.status === 'Active' ? 1 : 0,
                        }
                    })
                }
                //////////////////////////////////////////////////////////////////////////
                setProduct(productUpsert);
                setUpload(prev => {
                    return {
                        ...prev
                        , folderPath: `products/${productUpsert.name.trim().toLowerCase()}`
                        , publicIds: productUpsert.publicId
                        // reference for UploadComponent
                        , imageDisplay: productUpsert.imageUrl
                    }
                });

                // Set State Origin
                setOriginState(productUpsert);
                setOriginUpload(prev => {
                    return {
                        ...prev
                        , folderPath: `products/${productUpsert.name.trim().toLowerCase()}`
                        , publicIds: productUpsert.publicId
                        // reference for UploadComponent
                        , imageDisplay: productUpsert.imageUrl
                    }
                });
            } catch (error: any) {
                
            }
            finally {
                setIsLoading(false);
            }
        }
        // If id !== 0 -> Update -> Fetch Existed Product data
        if(!isCreateMode) fetchProductDetailAsync();
        
    }, [isCreateMode, productId]);

    //#endregion

    //#region Change Events

    const handleGetDataChange = (e: any, key: string) => {    
        if (key === 'imageUrl') {  
            // Set FILE State
            setUpload(prev => {
                return {...prev, files: e };
            });
        } else {       
            setProduct(prev => {
                return {...prev, [key]: e.target.value };
            });
        }
    }

    //#endregion

    //#region Events Buttons

    const handleAddRow = (indexRow: number) => {
        setProduct(prev => {
            if(prev.productDetails.length === 99) return {...prev};

            const newDetail = {color: '', price: 0, quantityInStock: 0, id: crypto.randomUUID(), productid: productId, extraName: '', status: 1};
            let updatedProductDetails = [
                ...prev.productDetails.slice(0, indexRow + 1),
                newDetail, 
                ...prev.productDetails.slice(indexRow + 1)
            ];

            return {
                ...prev,
                productDetails: updatedProductDetails
            }
        });
    }

    const handleRemoveRow = (indexRow: number) => {
        setProduct(prev => {
            if(prev.productDetails.length === 1) {
                const newDetail = {color: '', price: 0, quantityInStock: 0, id: crypto.randomUUID(), productid: productId, extraName: '', status: 1};
                return {
                    ...prev,
                    productDetails: [newDetail]
                }
            }

            let updatedProductDetails = [
                ...prev.productDetails.slice(0, indexRow),
                ...prev.productDetails.slice(indexRow + 1)
            ];
            return {
                ...prev,
                productDetails: updatedProductDetails
            }
        });
    }

    const handleClearData = () => {
        setIsClearMode(true);
        setProduct(originState);
        setUpload(originUpload);
    }

    //#endregion

    //#region Submit Form

    const handleCloseForm = () => {
        onSetOpenForm(false);
    }

    const validateData = () => {
        if(!checkRequired()) return false;
        if(!checkDuplicateColor()) return false;
        return true;
    }

    const checkRequired = () => {
        for(let i = 0; i < product.productDetails.length; i ++) {
            const currentRow : ProductUpsertDetail = product.productDetails[i];
            if(isEmptyRow(currentRow)) continue;

            const currentPrice = +currentRow.price;

            if(currentPrice === 0) {
                setError(`Row index ${i} has empty price`);
                return false;
            }
        }
        return true;
    }

    const checkDuplicateColor = () => {
        for(let i = 0; i < product.productDetails.length; i ++) {
            const currentRow : ProductUpsertDetail = product.productDetails[i];
            const currentColor = currentRow.color;

            // CurrentRow is Empty Row => Next Row
            if(isEmptyRow(currentRow)) continue;

            for(let j = 0; j < product.productDetails.length; j ++) {
                if(j === i) continue;
                const compareLoopRow : ProductUpsertDetail = product.productDetails[j];
                const compareLoopColor = compareLoopRow.color;
                if(isEmptyRow(compareLoopRow)) continue;

                if(compareLoopColor === currentColor) {
                    setError(`Duplicate Color at row_index: ${j}, value: ${compareLoopColor}`);
                    
                    // Focus vào input bị lỗi
                    setTimeout(() => {
                        colorRefs.current[j]?.focus();
                    }, 0);
                    return false;
                }
            }
        }
        return true;
    }

    const isEmptyRow = (currentRow: ProductUpsertDetail) => {
        if(+currentRow.price !== 0) return false;
        if(currentRow.color !== '') return false;
        if(currentRow.extraName !== '') return false;

        return true;
    }

    useEffect(() => {
        error && console.log(error);
    }, [error])

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        if(!validateData()) return;

        setIsSaving(true);
        try { 
            let uploadResult : ImageUploadResult = await agent.Upload.upload(upload);
            if (!uploadResult) {
                console.log('Update Image has some problems !');
                setIsSaving(false);
                return;
            }
                     
            const updatedProduct : ProductUpsert = {
                ...product
                , imageUrl: uploadResult.imageUrl || product.imageUrl
                , publicId: uploadResult.publicId || product.publicId
                , productDetails: product.productDetails.filter(p => !isEmptyRow(p))
            }
            
            if(!isCreateMode) {
                await agent.Product.update(updatedProduct);
            }
            else {
                await agent.Product.create(updatedProduct);
            }
            queryClient.invalidateQueries({queryKey: ['products']});
            handleCloseForm();

        } catch (error: any) {      
            setIsSaving(false);
        }
    }

    //#endregion

    return (
        <ProductUpsertStyle onSubmit={handleSubmit} disabled={isSaving || isLoading} >
            <div className="product-header-container" >
                <div className="product-fields-group-1" >
                    <Input id='name' value={product.name} placeholder="Name..." type="text" 
                            onGetDataChange={(e) => handleGetDataChange(e, 'name')} 
                    />
                    <Dropdown field="category" data={categoriesDropdown} currentSelectedValue={product.categoryId} onGetDataChange={e => handleGetDataChange(e, 'categoryId')} />
                    <Dropdown field="brand" data={brandsDropdown} currentSelectedValue={product.brandId} onGetDataChange={e => handleGetDataChange(e, 'brandId')} />
                </div>

                <div className="product-fields-group-2">
                    <Textarea id='description' value={product.description} placeholder="Description..." 
                                onGetDataChange={e => handleGetDataChange(e, 'description')}
                    />
                    <MultipleFileImage 
                        isClearMode = {isClearMode}
                        value={upload.imageDisplay} 
                        onGetDataChange={e => handleGetDataChange(e, 'imageUrl')}
                    />
                </div>
            </div>
            <div className="product-detail-container" >
                <div className="label-details-container" >
                    <h3>a</h3>
                    <h3>Price</h3>
                    <h3>Color</h3>
                    <h3>Extra</h3>
                    <h3>Status</h3>
                </div>
                <div className="rows-container" >
                    {product.productDetails.map((d, i) => 
                        <ProductDetailRow 
                            key={d.id} 
                            productDetail={d} 
                            onSetProduct={setProduct} 
                            indexRow={i} 
                            onAddRow={handleAddRow} onRemoveRow={handleRemoveRow} 
                        />)
                    } 
                </div>
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
            grid-template-columns: repeat(2, 1fr);
            grid-column-gap: 10%;   
            height: fit-content;   
            margin-top: 1vh;
        }
    }

    .product-detail-container {
        width: 100%;
        height: 25vh;
        padding: 0vh 0vw 1vh .1vw;
        background-color: #EADDCA;
        margin-top: 2vh;

        .label-details-container {
            display: grid;
            grid-template-columns: 4% 23.5% 23.5% 23.5% 23.5%;
            grid-column-gap: .2vw;
            align-items: center;
            margin-bottom: .5vh;

            h3 {
                text-align: center;
                background-color: #E1C16E;
                color: white;
                font-weight: 500;
                font-style: italic;
                letter-spacing: 1px;
                padding: 0.3vh 0vw;

                &:first-child {
                    background-color: transparent;
                    color: transparent;
                }
            }
        }

        .rows-container {
            padding: 1vh 0;
            height: 100%;
            overflow-y: scroll;
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