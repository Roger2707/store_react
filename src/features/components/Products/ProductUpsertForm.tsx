import styled from "styled-components"
import { Product, ProductUpsert } from "../../../app/models/Product";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/store/configureStore";
import { productSelectors, setProductsAfterPost, setProductsAfterPut } from "../../../app/store/productSlice";
import { Input } from "../../ui/Forms/Input";
import { Textarea } from "../../ui/Forms/Textarea";
import { Dropdown, DropdownData } from "../../ui/Forms/Dropdown";
import { productStatus } from "../../../app/utils/helper";
import { Category } from "../../../app/models/Category";
import { Brand } from "../../../app/models/Brand";
import agent from "../../../app/api/agent";
import { fetchCategoryAsync } from "../../../app/store/categorySlice";
import { fetchBrandsAsync } from "../../../app/store/brandSlice";
import { MultipleFileImage } from "../../ui/Forms/MultipleFileImage";

interface Props {
    id: number;
    onSetOpenForm: (e: boolean) => void;
    onSetProductId: Dispatch<SetStateAction<number>>;
}

export const ProductUpsertForm = ({id, onSetOpenForm, onSetProductId}: Props) => {
    const dispatch = useAppDispatch();

    //#region Get / Init Data Component
    const [product, setProduct] = useState<ProductUpsert>({
        name: '',
        price: 0,
        description: '',
        imageUrl: null,
        quantityInStock: 0,
        productStatus: 1,
        created: new Date().toISOString(),
        categoryId: 1,
        brandId: 1,
    });
    const existedProduct = useAppSelector(state => productSelectors.selectById(state, id));
    
    const [categoriesDropdown, setCategoriesDropdown] = useState<DropdownData[]>([]);
    const [brandsDropdown, setBrandsDropdown] = useState<DropdownData[]>([]);

    const {categories} = useAppSelector(state => state.category);
    const {brands} = useAppSelector(state => state.brand);

        //#region Get api for select option

    useEffect(() => {     
        if(categories === null || categories.length === 0) {
            dispatch(fetchCategoryAsync());
        }

        if(categories.length > 0) {
            setCategoriesDropdown(prev => {
                return categories.map((d: Category) => {
                    return {title: d.name, value: d.id};
                });                
            });
        }

        if(brands === null || brands.length === 0) {
            dispatch(fetchBrandsAsync());
        }

        if(brands.length > 0) {     
            setBrandsDropdown(prev => {
                return brands.map((d: Brand) => {
                    return {title: d.name, value: d.id};
                });                
            })
        }

    }, [categories, brands, dispatch]);

    //#endregion

    useEffect(() => {        
        if(existedProduct !== undefined) {           
            setProduct(prevState => {
                return {
                    name: existedProduct.name,
                    price: existedProduct.price,
                    description: existedProduct.description,
                    imageUrl: null,
                    quantityInStock: existedProduct.quantityInStock,
                    productStatus: existedProduct.productStatus === 'In Stock' ? 1 : 2,
                    created: existedProduct.created+ '',
                    categoryId: existedProduct.categoryId,
                    brandId: existedProduct.brandId,
                }
            })
        }
        
    }, [existedProduct]);

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
        else {       
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
        onSetProductId(0);
    }

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        handleBeforeSubmit();
        
        try {
            let response: Product;

            if(existedProduct) {
                response = await agent.Product.update(existedProduct.id, product);
                dispatch(setProductsAfterPut(response));
            }
            else {
                response = await agent.Product.create(product);
                dispatch(setProductsAfterPost(response));
            }
            
            handleCloseForm();

        } catch (error: any) {      

        }
    }

    //#endregion

    return (
        <ProductUpsertStyle>
            <form onSubmit={handleSubmit} >
                <div className="form_inputs" >
                    <Input id='name' value={product.name} placeholder="Name..." type="text" 
                            onGetDataChange={(e) => handleGetDataChange(e, 'name')} 
                    />
                    <Input id='price' value={product.price} placeholder="Price..." type="number" 
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

                    <MultipleFileImage value={existedProduct?.imageUrl} onGetDataChange={e => handleGetDataChange(e, 'imageUrl')}/>
                </div>
                
                <div className="form_controls" >
                    <button>{id === 0 ? 'Create' : 'Update'}</button>
                </div>
            </form>
        </ProductUpsertStyle>
    )
}

const ProductUpsertStyle = styled.div`
    
    form {

        .form_inputs {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 10%;
            
        }

        .form_controls {
            margin-top: 11vh;
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
    }
`