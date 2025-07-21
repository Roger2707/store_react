import styled from "styled-components"
import { useEffect, useState } from "react";
import { Input } from "../../ui/Forms/Input";
import { Textarea } from "../../ui/Forms/Textarea";
import { Dropdown, DropdownData } from "../../ui/Forms/Dropdown";
import { Category } from "../../../app/models/Category";
import { Brand } from "../../../app/models/Brand";
import { useCategories } from "../../Hooks/useCategories";
import { useBrands } from "../../Hooks/useBrands";
import agent from "../../../app/api/agent";
import { useQueryClient } from "@tanstack/react-query";
import { ProductDTO, ProductUpsertDTO } from "../../../app/models/Product";
import { ProductDetailTabs } from "./ProductDetailTabs";

interface Props {
    productId: string;
    isCreateMode: boolean;
    onSetOpenForm: (e: boolean) => void;
}

export const ProductUpsertForm = ({ productId, isCreateMode, onSetOpenForm }: Props) => {
    const { data: categories } = useCategories();
    const { data: brands } = useBrands();
    const queryClient = useQueryClient();
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isClearMode, setIsClearMode] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [selectedTab, setSelectedTab] = useState<number>(0);

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
    const [categoriesDropdown, setCategoriesDropdown] = useState<DropdownData[]>([]);
    const [brandsDropdown, setBrandsDropdown] = useState<DropdownData[]>([]);

    //#region Set Data for dropdown

    useEffect(() => {
        if (categories && categories.length > 0) {
            const defaultCategory: Category = {
                id: '',
                name: ''
            }
            let newCategories: Category[] = [defaultCategory, ...categories];

            setCategoriesDropdown(prev => {
                return newCategories?.map((d: Category) => {
                    return { title: d.name, value: d.id };
                });
            });
        }

        if (brands && brands.length > 0) {
            const defaultBrand: Brand = {
                id: '',
                name: '',
                country: ''
            }
            let newBrands: Brand[] = [defaultBrand, ...brands];

            setBrandsDropdown(prev => {
                return newBrands.map((d: Brand) => {
                    return { title: d.name, value: d.id };
                });
            })
        }

    }, [categories, brands]);

    //#endregion

    useEffect(() => {
        const fetchProductDetailAsync = async () => {
            try {
                if (isCreateMode) return;
                setIsLoading(true);
                const response: ProductDTO = await agent.Product.singleDTO(productId);

                const productUpsert: ProductUpsertDTO = {
                    id: productId,
                    name: response.name,
                    description: response.description,
                    created: response.created.toString(),
                    categoryId: categoriesDropdown.find(dropdown => dropdown.title === response.categoryName)?.value,
                    brandId: brandsDropdown.find(dropdown => dropdown.title === response.brandName)?.value,

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
                            publicId: '',
                        }
                    })
                }
                //////////////////////////////////////////////////////////////////////////
                setProductUpsert(productUpsert);

                // Set State Origin
                setProductUpsertOrigin(productUpsert);

                // setOriginUpload(prev => {
                //     return {
                //         ...prev
                //         , folderPath: `products/${productUpsert.name.trim().toLowerCase()}`
                //         , publicIds: productUpsert.publicId
                //         // reference for UploadComponent
                //         , imageDisplay: productUpsert.imageUrl
                //     }
                // });
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

    //#endregion


    const handleClearData = () => {
        setIsClearMode(true);
        setProductUpsert(productUpsertOrigin);
    }

    //#endregion

    //#region Submit Form

    const handleCloseForm = () => {
        onSetOpenForm(false);
    }

    useEffect(() => {
        error && console.log(error);
    }, [error])

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const updatedProduct: ProductUpsertDTO = {
                ...productUpsert
                , productDetails: productUpsert.productDetails
            }

            if (!isCreateMode) {
                await agent.Product.update(updatedProduct);
            }
            else {
                await agent.Product.create(updatedProduct);
            }
            queryClient.invalidateQueries({ queryKey: ['products'] });
            handleCloseForm();

        } catch (error: any) {
            setIsSaving(false);
        }
    }

    //#endregion

    const handleChangeTab = (index: number) => {
        setSelectedTab(index);
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
                    {
                        productUpsert.productDetails.map((_, index) => {
                            return (
                                <button key={index} type="button" className={`product-header-item ${selectedTab === index ? 'active' : ''}`} onClick={() => handleChangeTab(index)} >
                                    {`Item-${index}`}
                                </button>
                            )
                        })
                    }
                </div>

                <ProductDetailTabs productName={productUpsert.name} isSaving={isSaving} isClearMode={isClearMode}
                    selectedTabIndex={selectedTab} onSetProductUpsert={setProductUpsert} productDetails={productUpsert.productDetails}
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
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: #6082B6;
            padding: 1vh 10%;
            margin-bottom: 2vh;

            .product-header-item {
                padding: 5px 20px;
                background-color: #fff;
                border: 1px solid #ccc;
                border: none;
                outline: none;
                border-radius: 2px;

                &:hover {
                    cursor: pointer;
                    background-color: lightgrey;
                    transition: 0.5s;
                }

                &:first-child {
                    margin-right: 1vw;
                }

            }
            .active {
                background-color: lightgrey;
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