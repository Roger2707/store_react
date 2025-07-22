import styled from "styled-components"
import { Input } from "../../ui/Forms/Input"
import { useState } from "react"
import { InputMoney } from "../../ui/Forms/InputMoney"
import { Dropdown } from "../../ui/Forms/Dropdown"
import agent from "../../../app/api/agent"
import { ProductFullDetailDTO, ProductParams } from "../../../app/models/Product"
import { useAppSelector } from "../../../app/store/configureStore"

interface Props {
    onReceiveProps: (data: ProductFullDetailDTO) => void;
}

export const SearchProductDetailStock = ({ onReceiveProps }: Props) => {
    const [productSearch, setProductSearch] = useState<ProductParams>({ minPrice: 0, maxPrice: 0, searchBy: '', filterByBrand: '', filterByCategory: '', currentPage: 0 });
    const { categoriesDropdown } = useAppSelector(state => state.category)
    const { brandsDropdown } = useAppSelector(state => state.brand)

    const [isSearch, setIsSearch] = useState<boolean>(false);
    const [productSearchData, setProductSearchData] = useState<ProductFullDetailDTO[]>([]);

    const handleChangeData = (e: any, key: string) => {
        switch (key) {
            case 'productName':
                setProductSearch(prev => ({ ...prev, [key]: e.target.value }));
                break;
            case 'minPrice':
            case 'maxPrice':
                setProductSearch(prev => ({ ...prev, [key]: +e }));
                break;
            case 'categoryId':
            case 'brandId':
                setProductSearch(prev => ({ ...prev, [key]: e.target.value }));
                break;
            default:
        }
    }

    const handleSearch = async (e: any) => {
        e.preventDefault();

        try {
            setIsSearch(true);
            const data: ProductFullDetailDTO[] = await agent.Product.list(productSearch);
            setProductSearchData(data);
        }
        catch (error: any) {
            console.log(error);
        }
        finally {
            setIsSearch(false);
        }
    }

    const handleClearScreen = () => {
        setProductSearch(prev => ({ minPrice: 0, maxPrice: 0, searchBy: '', filterByBrand: '', filterByCategory: '', currentPage: 0 }));
        setProductSearchData([]);
    }

    const handlePropProductToParent = (product: ProductFullDetailDTO) => {
        onReceiveProps(product);
    }

    return (
        <Styled onSubmit={handleSearch} disabled={isSearch} >
            <div className="search-conditions" >
                <Input
                    id="searchBy"
                    placeholder="Name..."
                    type="text"
                    width="100%"
                    value={productSearch.searchBy}
                    onGetDataChange={e => handleChangeData(e, 'searchBy')}
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
                    <label style={{ display: 'inline-block', textAlign: 'center' }} >~</label>
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
                        data={categoriesDropdown}
                        width="100%"
                        marginTop="1vh"
                        onGetDataChange={e => handleChangeData(e, 'categoryId')}
                        currentSelectedValue={productSearch.filterByCategory}
                    />

                    <Dropdown
                        data={brandsDropdown}
                        width="100%"
                        marginTop="1vh"
                        onGetDataChange={e => handleChangeData(e, 'brandId')}
                        currentSelectedValue={productSearch.filterByBrand}
                    />
                </div>
            </div>

            <div className="search-data" >
                {
                    productSearchData.map((p: ProductFullDetailDTO) => {
                        return (
                            <div className="search-row" key={p.productDetailId} onDoubleClick={handlePropProductToParent.bind(null, p)} >
                                <span>{p.name}</span>
                                <span>{p.originPrice.toLocaleString('vi-VN')}</span>
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
            grid-template-columns: 45% 9.3% 45%;
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
        height: 45vh;
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
            opacity: 0.8;

            &:hover {
                opacity: 1;
            }
            
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