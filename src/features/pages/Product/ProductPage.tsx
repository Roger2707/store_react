import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { ProductList } from "../../components/Products/ProductList";
import { Pagination } from "../../ui/Common/Pagination";
import { SearchData } from "../../ui/Common/SearchData";
import { SortData } from "../../ui/Common/SortData";
import { ProductParams } from "../../../app/models/Product";
import { useProducts } from "../../Hooks/useProducts";
import { CategoryFilter } from "../../components/Products/CategoryFilter";
import { BrandsFilter } from "../../components/Products/BrandsFilter";
import { sortOptions } from "../../../app/utils/helper";
import { ProductSkeleton } from "../../components/Products/ProductSkeleton";

export const ProductPage = () => {
    const defaultProductParam : ProductParams = {
        currentPage: 1,
        filterByBrand: '',
        filterByCategory: '',
        orderBy: '',
        searchBy: ''
    }
    const scrolltargetRef = useRef<HTMLDivElement>(null);
    const [productParams, setProductParams] = useState<ProductParams>(defaultProductParam);
    const { data, isLoading, isError } = useProducts(productParams);

    useEffect(() => {
        if (scrolltargetRef.current) {
            scrolltargetRef.current.scrollIntoView({ behavior: 'smooth' });
        }     
    }, [data]);
    
    return (
        <>
            <ProductsStyle ref={scrolltargetRef} >
                <div className="products-filter-container" >
                    <CategoryFilter 
                        categoriesFilter={productParams.filterByCategory}
                        onSetCategoriesFilter={setProductParams}
                    />

                    <BrandsFilter
                        brandsFilter={productParams.filterByBrand}
                        onSetBrandsFilter={setProductParams}
                    />

                    <div className="clear-container" >
                        <button onClick={() => setProductParams(defaultProductParam)} >Clear Filter</button>
                    </div>

                </div>
                <div className="products-display" >
                    <div className="products-head" >
                        <SearchData 
                            searchKey={productParams.searchBy} 
                            onSetSearchKey={setProductParams} 
                            placeholder="Type to search products..."
                        />

                        <SortData
                            selectedValue = {productParams.orderBy}
                            onSetSelectedValue = {setProductParams}
                            sortOptions = {sortOptions}
                        />
                    </div>
                    {
                        isLoading || !data ? (
                            <div className="product-skeleton-container">
                                {Array.from({ length: 10 }).map((_, i) => (
                                    <ProductSkeleton key={i} />
                                ))}
                            </div>
                        ) : (
                            <div className="products-content">
                                <ProductList products={data?.dataInCurrentPage} />
                                <Pagination
                                    totalPage={data?.totalPage || 0}
                                    params={productParams}
                                    onSetParams={setProductParams}
                                />
                            </div>
                        )
                    }
                    {isError && <p>Error fetching products ❌</p>}
                </div>
            </ProductsStyle>
        </>
    )
}

const ProductsStyle = styled.div `
    display: grid;
    grid-template-columns: 1.5fr 8.5fr;

    .products-filter-container {
        background-color: #dedbe2;
        min-height: 90vh;
        width: 100%;
        height: 100%;

        display: flex;
        flex-direction: column;
        align-items: center;

        .clear-container {
            position: relative;
            top: 39%;

            button {
                padding: 1vh 1vw;
                border: none;
                outline: none;
                cursor: pointer;
                background-color: #6363f7;
                color: white;
                border-radius: 3px;
                transition: 0.2s;

                &:hover {
                    border: 1px solid #6363f7;
                    background-color: transparent;
                    color: #6363f7;
                }
            }
        }
    }

    .products-display {
        .products-head {
            margin-top: 2vh;
            width: 100%;
            height: fit-content;
            padding-left: 5%;

            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .products-content {
            padding: 30px 0px 0 50px;
        }

        .product-skeleton-container {
            display: grid;
            grid-template-columns: repeat(5, 1fr);
            grid-column-gap: 2vw;
            grid-row-gap: 3vh;
            padding: 30px 0px 0 50px;
        }
    }
`