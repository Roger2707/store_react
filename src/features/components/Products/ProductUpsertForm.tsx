import styled from "styled-components"
import { Product, ProductUpsert } from "../../../app/models/Product";
import { useEffect, useState } from "react";
import { Input } from "../../ui/Forms/Input";
import { Textarea } from "../../ui/Forms/Textarea";
import { Dropdown, DropdownData } from "../../ui/Forms/Dropdown";
import { productStatus } from "../../../app/utils/helper";
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
    const [isSave, setIsSave] = useState<boolean>(false);

    // State Origin -> use when clear form
    const [originState, setOriginState] = useState<ProductUpsert>({
        id : productId,
        name: '',
        description: '',
        imageUrl: '',
        publicId: '',
        productStatus: 1,
        created: new Date().toISOString(),
        categoryId: 1,
        brandId: 1,
        productDetails: [{color: '', price: 0, quantityInStock: 0, id: crypto.randomUUID(), productid: productId, extraName: ''}]
    });

    //#region Get / Init Data Component
    const [product, setProduct] = useState<ProductUpsert>({
        id : productId,
        name: '',
        description: '',
        imageUrl: '',
        publicId: '',
        productStatus: 1,
        created: new Date().toISOString(),
        categoryId: 1,
        brandId: 1,
        productDetails: [{color: '', price: 0, quantityInStock: 0, id: crypto.randomUUID(), productid: productId, extraName: ''}]
    });

    const [upload, setUpload] = useState<ImageUploadDTO>({
        files: null,
        folderPath: '',
        publicIds: '',
        imageDisplay: ''
    });

    const [categoriesDropdown, setCategoriesDropdown] = useState<DropdownData[]>([]);
    const [brandsDropdown, setBrandsDropdown] = useState<DropdownData[]>([]);

    //#region Set Data for dropdown

    useEffect(() => {     
        if(categories && categories.length > 0) {
            setCategoriesDropdown(prev => {
                return categories?.map((d: Category) => {
                    return {title: d.name, value: d.id};
                });                
            });
        }

        if(brands && brands.length > 0) {     
            setBrandsDropdown(prev => {
                return brands.map((d: Brand) => {
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
                setIsSave(true);
                const response : Product = await agent.Product.details(productId);
                const productUpsert : ProductUpsert = {
                    id: productId,
                    name: response.name,
                    description: response.description,
                    imageUrl: response.imageUrl,
                    publicId: response.publicId,
                    productStatus: response.productStatus === 'In Stock' ? 1 : 2,
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
                            quantityInStock: d.quantityInStock
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
            } catch (error: any) {
                
            }
            finally {
                setIsSave(false);
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
        } else if(key === 'categoryId' || key === 'brandId' || key === 'productStatus') {
            setProduct(prev => {
                return {...prev, [key]: +e.target.value };
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

            const newDetail = {color: '', price: 0, quantityInStock: 0, id: crypto.randomUUID(), productid: productId, extraName: ''};
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
                const newDetail = {color: '', price: 0, quantityInStock: 0, id: crypto.randomUUID(), productid: productId, extraName: ''};
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
        setProduct(originState);
    }

    //#endregion

    //#region Submit Form

    const handleBeforeSubmit = () => {
        // console.log(upload);      
        console.log(product);
    }

    const handleCloseForm = () => {
        onSetOpenForm(false);
    }

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        handleBeforeSubmit();  
        try { 

            setIsSave(true);

            let uploadResult : ImageUploadResult = await agent.Upload.upload(upload);
            if (!uploadResult) {
                console.log('Update Image has some problems !');
                return;
            }
            
            // if update as normal, setProduct is not updated in function
            const updatedProduct : ProductUpsert = {
                ...product,
                imageUrl: uploadResult.imageUrl || product.imageUrl,
                publicId: uploadResult.publicId || product.publicId
            };     
            setProduct(updatedProduct);

            if(!isCreateMode) {
                await agent.Product.update(updatedProduct);
            }
            else {
                await agent.Product.create(updatedProduct);
            }

            queryClient.invalidateQueries({queryKey: ['products']});
            handleCloseForm();

        } catch (error: any) {      

        }
        finally {
            setIsSave(false);
        }
    }

    //#endregion

    return (
        <ProductUpsertStyle onSubmit={handleSubmit} disabled={isSave} >
            <div className="product-header-container" >
                <Input id='name' value={product.name} placeholder="Name..." type="text" 
                        onGetDataChange={(e) => handleGetDataChange(e, 'name')} 
                />
                <Dropdown field="productStatus" data={productStatus} currentSelectedValue={product.productStatus} onGetDataChange={e => handleGetDataChange(e, 'productStatus')} />
                <Dropdown field="category" data={categoriesDropdown} currentSelectedValue={product.categoryId} onGetDataChange={e => handleGetDataChange(e, 'categoryId')} />
                <Dropdown field="brand" data={brandsDropdown} currentSelectedValue={product.brandId} onGetDataChange={e => handleGetDataChange(e, 'brandId')} />
                <Textarea id='description' value={product.description} placeholder="Description..." 
                            onGetDataChange={e => handleGetDataChange(e, 'description')}
                />
                <MultipleFileImage value={upload.imageDisplay || ''} onGetDataChange={e => handleGetDataChange(e, 'imageUrl')}/>
            </div>
            <div className="product-detail-container" >
                <div className="label-details-container" >
                    <h3>a</h3>
                    <h3>Price</h3>
                    <h3>Quantity</h3>
                    <h3>Color</h3>
                    <h3>Extra</h3>
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
                <input className="btn-submit" type="submit" value={'Submit'}/>
                <input className="btn-clear" type="button" value={'Clear'} onClick={handleClearData}/>
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
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        grid-column-gap: 10%;   
        grid-row-gap: 1.5vh;
        height: fit-content;    
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
        }

        .btn-clear {
            background-color: #6082B6;
        }
    }
`