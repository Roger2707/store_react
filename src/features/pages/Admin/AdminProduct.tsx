import styled from "styled-components"
import { FaPlus } from "react-icons/fa";
import { useAppDispatch, useAppSelector } from "../../../app/store/configureStore";
import { ReactNode, useCallback, useEffect, useState } from "react";
import { fetchProductsAsync, setProductParams, setProductsAfterPost } from "../../../app/store/productSlice";
import DataTable from "../../ui/Data/DataTable";
import { Pagination } from "../../ui/Common/Pagination";
import { Loading } from "../../ui/Common/Loading";
import { EmptyData } from "../../ui/Layout/EmptyData";
import { SearchData } from "../../ui/Common/SearchData";
import { SortData } from "../../ui/Common/SortData";
import { Modal } from "../../ui/Layout/Modal";
import { ProductUpsertForm } from "../../components/Products/ProductUpsertForm";
import agent from "../../../app/api/agent";

export const AdminProduct = () => {
    const [openForm, setOpenForm] = useState<boolean>(false);
    const [productId, setProductId] = useState<number>(0);

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

    const dispatch = useAppDispatch();
    const {productsPageLoaded, productsLoaded, productParams, totalPage} = useAppSelector(state => state.product);

    const columns = [
        { key: 'id', title: 'Id'}, 
        { key: 'name', title: 'Name'}, 
        { key: 'price', title: 'Price'}, 
        { key: 'discountPrice', title: 'Discount Price'}, 
        { 
            key: 'imageUrl',
            title: 'Photo', 
            render: (link: string | number | Date) => {
                let src = link.toString().split(',')[0];
                return <img width={50} height={50} src={String(src)} alt="img" /> as ReactNode;
            }
        }, 
        { key: 'quantityInStock', title: 'Quantity'}, 
        { key: 'productStatus', title: 'Status'}, 
        { 
            key: 'created',
            title: 'Created',
            render: (value: string | number | Date) => {
                const dateValue = new Date(value);
                return <p>{dateValue.toLocaleDateString('vi-VN')}</p> as ReactNode
            }
        }, 
        { key: 'categoryName', title: 'Category'},
        { key: 'brandName', title: 'Brand'},
        { key: 'brandCountry', title: 'Origin'},
    ];

    useEffect(() => {
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

    const handleOpenCreateForm = () => {
        setOpenForm(true);
        setProductId(0);
    }
    
    const handleDeleteProduct = (id: number) => {
        try {
            agent.Product.changeStatus(id);      
            dispatch(setProductsAfterPost(undefined));
        }
        catch(error: any) {

        }
    }

    return (
        <Style>
            {openForm &&
                <Modal title={productId === 0 ? 'Create' : 'Update'} onSetOpen={setOpenForm} >
                    <ProductUpsertForm id={productId} onSetOpenForm={setOpenForm} onSetProductId={setProductId} />
                </Modal>
            }

            <h1>Products</h1>
            <div className="heading" >
                <button id='btn-create' onClick={handleOpenCreateForm} >
                    <span className="btn-icon" ><FaPlus/></span>
                    <span className="btn-title" >Create</span>
                </button>

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
                !productsLoaded ?
                <Loading message="Loading..."/>
                :
                (
                    productsPageLoaded.find(o => o.currentPage === productParams.currentPage)?.dataInCurrentPage ?          
                    <>
                        <DataTable 
                            data={productsPageLoaded.find(o => o.currentPage === productParams.currentPage)?.dataInCurrentPage} 
                            columns={columns} 

                            onSetCurrentId={setProductId} 
                            onSetOpenForm={setOpenForm}
                            onDeleteItem={handleDeleteProduct}
                        />
                        <Pagination totalPage={totalPage}/>
                    </>
                        :
                    <EmptyData message="Can not find Products 😥 Try again !" />
                )
            }
        </Style>
    )
}

const Style = styled.div`
    .heading {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: 3vh;

        #btn-create {
            padding: 15px 15px;
            border-radius: 20px;
            border: none;
            outline: none;
            cursor: pointer;
            display: flex;
            align-items: center;
            color: #fff;
            background-color: #F88379;
            margin-right: 10vw;

            .btn-icon {
                display: inline-block;
                margin-right: 5px;
            }

            .btn-title {
                font-size: 1.2rem;
                text-transform: capitalize;
                line-height: 1rem;
                letter-spacing: 1px;
                word-spacing: 1px;
            }
        }
    }


    .datatable_container {
        margin-top: 20px;
    }  
`