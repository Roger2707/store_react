import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { ProductList } from "../../components/Products/ProductList";
import { Pagination } from "../../ui/Common/Pagination";
import { Loading } from "../../ui/Common/Loading";
import { SearchData } from "../../ui/Common/SearchData";
import { SortData } from "../../ui/Common/SortData";
import { ProductParams } from "../../../app/models/Product";
import { useProducts } from "../../Hooks/useProducts";
import { CategoryFilter } from "../../components/Products/CategoryFilter";
import { BrandsFilter } from "../../components/Products/BrandsFilter";
import { sortOptions } from "../../../app/utils/helper";

export const ProductPage = () => {
    const scrolltargetRef = useRef<HTMLDivElement>(null);
    const [productParams, setProductParams] = useState<ProductParams>({
        currentPage: 1,
        filterByBrand: '',
        filterByCategory: '',
        orderBy: '',
        searchBy: ''
    });

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
                        !isLoading ? 
                        <div className="products-content" >
                            <ProductList products={data?.dataInCurrentPage} /> 
                            <Pagination totalPage={data?.totalPage || 0} params={productParams} onSetParams={setProductParams}/>
                        </div>            
                        : 
                        <Loading message="Loading Products ..."/>
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
        background-color: #2c2c2c;
        min-height: 90vh;
        width: 100%;
        height: 100%;
        padding-left: 50%;

        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .products-display {
        .products-head {
            margin-top: 2vh;
            width: 100%;
            height: fit-content;
            padding: 0 5%;

            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .products-content {
            padding: 30px 100px 0 50px;
        }
    }
`