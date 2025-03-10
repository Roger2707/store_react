import { useCallback, useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/store/configureStore";
import { fetchProductsAsync, setProductParams } from "../../../app/store/productSlice";
import styled from "styled-components";
import { ProductList } from "../../components/Products/ProductList";
import { ProductFilter } from "../../components/Products/ProductFilter";
import { Pagination } from "../../ui/Common/Pagination";
import { Container } from "../../ui/Layout/Container";
import { Loading } from "../../ui/Common/Loading";
import { SearchData } from "../../ui/Common/SearchData";
import { SortData } from "../../ui/Common/SortData";

export const Product = () => {
    const [searchKey, setSearchKey] = useState<string>('');
    const [selectedValue, setSelectedValue] = useState<string>('');
    const sortOptions = [
        {
            title: '-- Choose --',
            value: '',
        },
        {
            title: 'Name DESC',
            value: 'NameDesc',
        },
        {
            title: 'Price ASC',
            value: 'priceASC',
        },
        {
            title: 'Price DESC',
            value: 'priceDESC',
        },
    ];

    const scrolltargetRef = useRef<HTMLDivElement>(null);
    const {productsLoaded, productsPageLoaded, productParams, totalPage} = useAppSelector(state => state.product);
    const dispatch = useAppDispatch();

    useEffect(() => {      
        if (scrolltargetRef.current) {
            scrolltargetRef.current.scrollIntoView({ behavior: 'smooth' });
        }
        if(!productsLoaded) {
            dispatch(fetchProductsAsync());
        }

    }, [dispatch, productsLoaded]);

    const handleSetSearchParams = () => {
        dispatch(setProductParams({searchBy: searchKey}));  
    }

    const handleSetSortParams = useCallback(() => {
        dispatch(setProductParams({orderBy: selectedValue}));
    }, [dispatch, selectedValue]);

    return (
        <Container>
            <ProductsStyle ref={scrolltargetRef} >
                <ProductFilter />
                <div className="products-display" >
                    <div className="products-head" >
                        <SearchData 
                            searchKey={searchKey} 
                            onSetSearchKey={setSearchKey} 
                            onSubmitSearch={handleSetSearchParams} 
                            placeholder="Type to search products..."
                        />

                        <SortData
                            selectedValue = {selectedValue}
                            onSetSelectedValue = {setSelectedValue}
                            onSubmitSort={handleSetSortParams}
                            sortOptions = {sortOptions}
                        />
                    </div>
                    {
                        productsLoaded ? 
                        <>
                            <ProductList products={productsPageLoaded.find(o => o.currentPage === productParams.currentPage)?.dataInCurrentPage} /> 
                            <Pagination totalPage={totalPage} />
                        </>            
                        : 
                        <Loading message="Loading Products ..."/>
                    }
                </div>
            </ProductsStyle>
        </Container>
    )
}

const ProductsStyle = styled.div `
    display: grid;
    grid-template-columns: 2fr 8fr;

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