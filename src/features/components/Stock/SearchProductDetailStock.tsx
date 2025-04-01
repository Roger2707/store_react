import styled from "styled-components"
import { Input } from "../../ui/Forms/Input"
import { useMemo, useState } from "react"
import { ProductSearch, ProductWithDetail } from "../../../app/models/Product"
import { InputMoney } from "../../ui/Forms/InputMoney"
import { Dropdown, DropdownData } from "../../ui/Forms/Dropdown"
import { useCategories } from "../../Hooks/useCategories"
import { useBrands } from "../../Hooks/useBrands"
import { Category } from "../../../app/models/Category"
import { Brand } from "../../../app/models/Brand"
import agent from "../../../app/api/agent"

interface Props {
    onReceiveProps: (data: ProductWithDetail) => void;
}

export const SearchProductDetailStock = ({onReceiveProps}: Props) => {
    const [productSearch, setProductSearch] = useState<ProductSearch>({productName: '', minPrice: 0, maxPrice: 0, categoryId: '', brandId: ''});
    const {data: categories} = useCategories();
    const {data: brands} = useBrands();

    const categoryDropdown : DropdownData[] = useMemo(() => {
        const defaultCategory : Category = {name: '', id: ''};
        const categoriesData = categories && [defaultCategory, ...categories];
        return categoriesData?.map((d: Category) => ({ title: d.name, value: d.id })) || [];
    }, [categories]);

    const brandDropdown : DropdownData[] = useMemo(() => {
        const defaultbrand : Brand = {name: '', id: '', country: ''};
        const brandsData = brands && [defaultbrand, ...brands];
        return brandsData?.map((d: Brand) => ({ title: d.name, value: d.id })) || [];
    }, [brands]);

    const [isSearch, setIsSearch] = useState<boolean>(false);
    const [productSearchData, setProductSearchData] = useState<ProductWithDetail[]>([]);

    const handleChangeData = (e: any, key: string) => {
        switch(key) {
            case 'productName':
                setProductSearch(prev => ({...prev, [key]: e.target.value}));
                break;
            case 'minPrice':
            case 'maxPrice':
                setProductSearch(prev => ({...prev, [key]: +e}));
                break;
            case 'categoryId':
            case 'brandId':
                setProductSearch(prev => ({...prev, [key]: e.target.value}));
                break;
            default:            
        }
    }

    const handleSearch = async (e: any) => {
        e.preventDefault();

        try {
            setIsSearch(true);
            const data : ProductWithDetail[] = await agent.Product.details(productSearch);
            setProductSearchData(data);
        }
        catch(error: any) {
            console.log(error);
        }
        finally {
            setIsSearch(false);
        }
    }

    const handleClearScreen = () => {        
        setProductSearch(prev => ({productName: '', minPrice: 0, maxPrice: 0, categoryId: '', brandId: ''}));
        setProductSearchData([]);
    }

    const handlePropProductToParent = (product: ProductWithDetail) => {
        onReceiveProps(product);
    }

    return (
        <Styled onSubmit={handleSearch} disabled={isSearch} >
            <div className="search-conditions" >
                <Input
                    id="productName"
                    placeholder="Name..."
                    type="text"
                    width="100%"
                    value={productSearch.productName}
                    onGetDataChange={e => handleChangeData(e, 'productName')}
                />
                <div className="product-prices" >
                    <InputMoney
                        id="minPrice"
                        placeholder="Min Price"
                        type="text"
                        width="100%"
                        value={productSearch.minPrice}
                        onGetDataChange={e => handleChangeData(e, 'minPrice')}
                    />
                    <label style={{display: 'inline-block', textAlign: 'center'}} >~</label>
                    <InputMoney
                        id="maxPrice"
                        placeholder="Max Price"
                        type="text"
                        width="100%"
                        value={productSearch.maxPrice}
                        onGetDataChange={e => handleChangeData(e, 'maxPrice')}
                    />
                </div>
                <div className="dropdowns" >
                    <Dropdown
                        data={categoryDropdown}
                        width="100%"
                        marginTop="1vh"
                        onGetDataChange={e => handleChangeData(e, 'categoryId')}
                        currentSelectedValue={productSearch.categoryId}
                    />

                    <Dropdown
                        data={brandDropdown}
                        width="100%"
                        marginTop="1vh"
                        onGetDataChange={e => handleChangeData(e, 'brandId')}
                        currentSelectedValue={productSearch.brandId}
                    />
                </div>
            </div>

            <div className="search-data" >
                {
                    productSearchData.map((p: ProductWithDetail) => {
                        return (
                            <div className="search-row" key={p.productDetailId} onDoubleClick={handlePropProductToParent.bind(null, p)} >
                                <span>{p.productName}</span>
                                <span>{p.price.toLocaleString('vi-VN')}</span>
                                <span>{p.categoryName}</span>
                                <span>{p.brandName}</span>
                            </div>
                        )
                    })
                }
            </div>

            <div className="search-actions" >
                <button type="submit" >Search</button>
                <button type="button" onClick={handleClearScreen} >Clear</button>
            </div>
        </Styled>
    )
}

const Styled = styled.form<{ disabled: boolean }>`   
    height: fit-content;
    min-width: 55vw;

    opacity: ${(props) => (props.disabled ? 0.6 : 1)};
    pointer-events: ${(props) => (props.disabled ? "none" : "auto")};

    margin-top: 2vh;
    .search-conditions {
        .product-prices {
            display: grid;
            grid-template-columns: 45% 10% 45%;
            grid-column-gap: .2vw;
            align-items: center;
        }

        .dropdowns {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            grid-column-gap: 2vw;
        }
    }

    .search-data {
        margin-top: 2vh;
        margin-bottom: 2vh;
        width: 100%;
        height: 30vh;
        background-color: #ccc;
        overflow: scroll;

        .search-row {
            background-color: white;
            width: 100%;
            padding: 0 .5vw;

            display: grid;
            grid-template-columns: 40% 30% 15% 15%;
            grid-column-gap: .1vw;
            align-items: center;

            span {
                display: inline-block;
                border-bottom: 1px solid #ccc;
                padding: 0.8vh 0;

                &:last-child {
                    border-right: none;
                }
            }

            &:hover {
                cursor: pointer;
                background-color: #FA5F55;
                color: #ccc;
                transition: all .1s;
            }
        }
    }

    .search-actions {
        display: flex;
        justify-content: right;
        align-items: center;
        button {
            padding: 1vh 1vw;
            font-size: 1rem;
            width: 18%;
            border-radius: 5px;
            border: none;
            outline: none;
            cursor: pointer;
            color: #fff;
            
            &:first-child {
                background-color: orangered;
            }

            &:last-child {
                background-color: #FF4433;
                margin-left: 1vw;
            }
        }
    }
`