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
import { InputMoney } from "../../ui/Forms/InputMoney";

interface Props {
    id: number;
    onSetOpenForm: (e: boolean) => void;
    onSetProductId: Dispatch<SetStateAction<number>>;
}

export const ProductUpsertForm = ({id, onSetOpenForm, onSetProductId}: Props) => {
    const {data: categories} = useCategories();
    const {data: brands} = useBrands();
    const queryClient = useQueryClient();

    //#region Get / Init Data Component
    const [product, setProduct] = useState<ProductUpsert>({
        name: '',
        price: 0,
        description: '',
        imageUrl: null,
        imageProps: '',
        quantityInStock: 0,
        productStatus: 1,
        created: new Date().toISOString(),
        categoryId: 1,
        brandId: 1,
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
                const response : Product = await agent.Product.details(Number(id));
                const productUpsert : ProductUpsert = {
                    name: response.name,
                    price: response.price,
                    description: response.description,
                    imageUrl: null,
                    imageProps: response.imageUrl,
                    quantityInStock: response.quantityInStock,
                    productStatus: response.productStatus === 'In Stock' ? 1 : 2,
                    created: response.created.toString(),
                    categoryId: response.categoryId,
                    brandId: response.brandId,
                }
                //////////////////////////////////////////////////////////////////////////
                setProduct(productUpsert);
            } catch (error: any) {
                console.log(error);
            }
        }
        // If id !== 0 -> Update -> Fetch Existed Product data
        if(id !== 0) fetchProductDetailAsync();
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
        }
        else if(key === 'price') {
            setProduct(prev => {
                return {...prev, [key]: e };
            });
        }
        else {       
            setProduct(prev => {
                return {...prev, [key]: e.target.value };
            });
        }
    }

    //#endregion

    //#region Submit Form

    const handleBeforeSubmit = () => {

    }

    const handleCloseForm = () => {
        onSetOpenForm(false);
        onSetProductId(0);
    }

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        handleBeforeSubmit();
        
        try { 
            if(id !== 0) 
                await agent.Product.update(id, product);
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
            <div className="form_inputs" >
                <Input id='name' value={product.name} placeholder="Name..." type="text" 
                        onGetDataChange={(e) => handleGetDataChange(e, 'name')} 
                />

                <InputMoney id='price' value={product.price} placeholder="Price..." type="text"
                        onGetDataChange={(e) => handleGetDataChange(e, 'price')} 
                />
                <Input id='quantityInStock' value={product.quantityInStock} placeholder="Quantity..." type="number" 
                        onGetDataChange={(e) => handleGetDataChange(e, 'quantityInStock')} 
                />

                <Dropdown field="productStatus" data={productStatus} currentSelectedValue={product.productStatus} onGetDataChange={e => handleGetDataChange(e, 'productStatus')} />
                <Dropdown field="category" data={categoriesDropdown} currentSelectedValue={product.categoryId} onGetDataChange={e => handleGetDataChange(e, 'categoryId')} />
                <Dropdown field="brand" data={brandsDropdown} currentSelectedValue={product.brandId} onGetDataChange={e => handleGetDataChange(e, 'brandId')} />
                <Textarea id='description' value={product.description} placeholder="Description..." 
                            onGetDataChange={e => handleGetDataChange(e, 'description')}
                />

                <MultipleFileImage value={product.imageProps || ''} onGetDataChange={e => handleGetDataChange(e, 'imageUrl')}/>
            </div>
        
            <div className="form_controls" >
                <button>{id === 0 ? 'Create' : 'Update'}</button>
            </div>
        </ProductUpsertStyle>
    )
}

const ProductUpsertStyle = styled.form`   
    height: fit-content;
    min-width: 50vw;
    min-height: 60vh;


    .form_inputs {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        grid-column-gap: 10%;   
        grid-row-gap: 1.5vh;
        height: fit-content;
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