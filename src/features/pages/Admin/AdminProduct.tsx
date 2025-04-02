import styled from "styled-components"
import { FaPlus } from "react-icons/fa";
import { useState } from "react";
import DataTable from "../../ui/Data/DataTable";
import { Loading } from "../../ui/Common/Loading";
import { EmptyData } from "../../ui/Layout/EmptyData";
import { Modal } from "../../ui/Layout/Modal";
import { ProductUpsertForm } from "../../components/Products/ProductUpsertForm";
import agent from "../../../app/api/agent";
import { useProducts } from "../../Hooks/useProducts";
import { ProductParams } from "../../../app/models/Product";
import { Pagination } from "../../ui/Common/Pagination";
import { SearchData } from "../../ui/Common/SearchData";
import { SortData } from "../../ui/Common/SortData";
import { sortOptions } from "../../../app/utils/helper";
import { columns } from "./AdminProductsHelper";
import { useQueryClient } from "@tanstack/react-query";

export const AdminProduct = () => {
    const [productParams, setProductParams] = useState<ProductParams>({
        currentPage: 1,
        filterByBrand: '',
        filterByCategory: '',
        orderBy: '',
        searchBy: ''
    });
    const {data, isLoading} = useProducts(productParams);
    const queryClient = useQueryClient();

    const [productId, setProductId] = useState<string>('');
    const [openForm, setOpenForm] = useState<boolean>(false);
    const [isCreateMode, setIsCreateMode] = useState<boolean>(true);
    
    const handleOpenCreateForm = () => {
        setOpenForm(true);
        setProductId(crypto.randomUUID());
        setIsCreateMode(true);
    }

    const handleDeleteProduct = async (id: string) => {
        try {
            await agent.Product.changeStatus(id);
            queryClient.invalidateQueries({queryKey: ['products']}); 
        }
        catch(error: any) {
            console.error('Error in Changing Product Status ❌');
        }
    }

    return (
        <Style>
            {openForm &&
                <Modal title={isCreateMode ? 'Create' : 'Update'} onSetOpen={setOpenForm} width="80%" height="80%" >
                    <ProductUpsertForm productId={productId} onSetOpenForm={setOpenForm} isCreateMode={isCreateMode} />
                </Modal>
            }

            <h1>Products</h1>
            <div className="heading" >
                <button id='btn-create' onClick={handleOpenCreateForm} >
                    <span className="btn-icon" ><FaPlus/></span>
                    <span className="btn-title" >Create</span>
                </button>

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
                isLoading ?
                <Loading message="Loading Products..."/>
                :
                (
                    data?.dataInCurrentPage ? 
                    <>
                        <DataTable 
                            data={data.dataInCurrentPage} 
                            columns={columns} 

                            onSetCurrentId={setProductId}
                            onSetOpenForm={setOpenForm}
                            onDeleteItem={handleDeleteProduct}
                            onSetIsCreateMode={setIsCreateMode}
                        />
                        <Pagination totalPage={data.totalPage} params={productParams} onSetParams={setProductParams}/>
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