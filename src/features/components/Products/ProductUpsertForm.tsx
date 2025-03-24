import styled from "styled-components"
import { Product, ProductUpsert } from "../../../app/models/Product";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
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

interface Props {
    id: string;
    onSetOpenForm: (e: boolean) => void;
    onSetProductId: Dispatch<SetStateAction<string>>;
}

export const ProductUpsertForm = ({id, onSetOpenForm, onSetProductId}: Props) => {
    const {data: categories} = useCategories();
    const {data: brands} = useBrands();
    const queryClient = useQueryClient();

    //#region Get / Init Data Component
    const [product, setProduct] = useState<ProductUpsert>({
        name: '',
        description: '',
        imageUrl: null,
        imageProps: '',
        productStatus: 1,
        created: new Date().toISOString(),
        categoryId: 1,
        brandId: 1,
        productDetails: []
    });

    const [categoriesDropdown, setCategoriesDropdown] = useState<DropdownData[]>([]);
    const [brandsDropdown, setBrandsDropdown] = useState<DropdownData[]>([]);

    //#region Get api for select option

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
                if(id === null || id === '') return;

                const response : Product = await agent.Product.details(id);
                const productUpsert : ProductUpsert = {
                    id: id,
                    name: response.name,
                    description: response.description,
                    imageUrl: null,
                    imageProps: response.imageUrl,
                    productStatus: response.productStatus === 'In Stock' ? 1 : 2,
                    created: response.created.toString(),
                    categoryId: response.categoryId,
                    brandId: response.brandId,

                    // details
                    productDetails: response.details.map(d => {
                        return {
                            id: d.id,
                            productid: d.productid,
                            color: d.color,
                            extraName: d.extraName,
                            price: d.price,
                            quantityInStock: d.quantityInStock
                        }
                    })
                }
                //////////////////////////////////////////////////////////////////////////
                setProduct(productUpsert);
            } catch (error: any) {
                console.log(error);
            }
        }
        // If id !== 0 -> Update -> Fetch Existed Product data
        if(id !== '') fetchProductDetailAsync();
        console.log(id);
        
    }, [id]);

    //#endregion

    //#region Change Events

    const handleGetDataChange = (e: any, key: string) => {    
        if (key === 'imageUrl') {
            console.log(e);
            
            setProduct(prev => {
                return {...prev, [key]: e };
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

    //#region Submit Form

    const handleBeforeSubmit = () => {
        console.log(product);
    }

    const handleCloseForm = () => {
        onSetOpenForm(false);
        onSetProductId('');
    }

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        //handleBeforeSubmit();
        
        try { 
            if(id !== '') 
                await agent.Product.update(product);
            else 
                await agent.Product.create(product);

            queryClient.invalidateQueries({queryKey: ['products']});
            handleCloseForm();

        } catch (error: any) {      

        }
    }

    //#endregion

    return (
        <ProductUpsertStyle onSubmit={handleSubmit}>
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
                <MultipleFileImage value={product.imageProps || ''} onGetDataChange={e => handleGetDataChange(e, 'imageUrl')}/>
            </div>
            <div className="product-detail-container" >
                <div className="label-details-container" >
                    <h3>a</h3>
                    <h3>Price</h3>
                    <h3>Quantity</h3>
                    <h3>Color</h3>
                    <h3>Extra</h3>
                </div>
                <>
                    {product.productDetails.map((d, i) => <ProductDetailRow key={i} productDetail={d} onSetProduct={setProduct} />)}       
                </>
            </div>
        
            <div className="form_controls" >
                <button>{id === '' ? 'Create' : 'Update'}</button>
            </div>
        </ProductUpsertStyle>
    )
}

const ProductUpsertStyle = styled.form`   
    height: fit-content;
    min-width: 50vw;
    min-height: 60vh;

    .product-header-container {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        grid-column-gap: 10%;   
        grid-row-gap: 1.5vh;
        height: fit-content;    
    }

    .product-detail-container {
        width: 100%;
        height: 20vh;
        padding: 0vh 0vw 1vh .1vw;
        overflow-y: scroll;
        background-color: #EADDCA;

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
    }

    .form_controls {
        margin-top: 3vh;
        display: flex;
        justify-content: right; 
        border-top: 2px solid #6082B6;
        padding-top: 1vh;

        button {
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
    }
`