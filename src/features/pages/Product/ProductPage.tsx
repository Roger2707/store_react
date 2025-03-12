import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { ProductList } from "../../components/Products/ProductList";
import { Pagination } from "../../ui/Common/Pagination";
import { Container } from "../../ui/Layout/Container";
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
        <Container>
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
                        <>
                            <ProductList products={data?.dataInCurrentPage} /> 
                            <Pagination totalPage={data?.totalPage || 0} params={productParams} onSetParams={setProductParams}/>
                        </>            
                        : 
                        <Loading message="Loading Products ..."/>
                    }
                    {isError && <p>Error fetching products ❌</p>}
                </div>
            </ProductsStyle>
        </Container>
    )
}

const ProductsStyle = styled.div `
    display: grid;
    grid-template-columns: 2fr 8fr;

    .products-filter-container {
        background-color: #343434;
        width: 100%;
        height: 100%;

        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .products-display {
        .products-head {
            width: 100%;
            height: 10vh;
            background-color: #7393B3;
            padding: 0 5%;

            display: flex;
            justify-content: space-between;
            align-items: center;
        }
    }
`