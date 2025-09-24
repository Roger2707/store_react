import styled from "styled-components"
import { useState } from "react";
import DataTable from "../../../UI/Data/DataTable";
import { Loading } from "../../../UI/Common/Loading";
import { EmptyData } from "../../../UI/Layout/EmptyData";
import { Modal } from "../../../UI/Layout/Modal";
import { ProductUpsertForm } from "./ProductUpsertForm";
import agent from "../../../../app/api/agent";
import { useProducts } from "../../../CustomHooks/useProducts";
import { ProductParams } from "../../../../app/models/Product";
import { Pagination } from "../../../UI/Common/Pagination";
import { SearchData } from "../../../UI/Common/SearchData";
import { useQueryClient } from "@tanstack/react-query";
import { ButtonCreateAdmin } from "../MainUI/ButtonCreateAdmin";
import { SortData } from "../../../UI/Common/SortData";
import { sortOptions } from "../../../../app/utils/helper";
import { columns } from "./AdminProductsHelper";

export const AdminProduct = () => {
    const [productParams, setProductParams] = useState<ProductParams>({
        currentPage: 1,
        filterByBrand: '',
        filterByCategory: '',
        searchBy: '',
        minPrice: 0,
        maxPrice: 0,
        sortBy: ''
    });
    const { data, isLoading } = useProducts(productParams);
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
            queryClient.invalidateQueries({ queryKey: ['products'] });
        }
        catch (error: any) {
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
                <ButtonCreateAdmin onOpenCreateForm={handleOpenCreateForm} />

                <SearchData
                    searchKey={productParams.searchBy}
                    onSetSearchKey={setProductParams}
                    placeholder="Type to search products..."
                />

                <SortData selectedValue={productParams.sortBy} sortOptions={sortOptions} onSetSelectedValue={setProductParams} />
            </div>

            {
                isLoading ?
                    <Loading message="Loading Products..." />
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
                                <Pagination totalPage={data.totalPage} params={productParams} onSetParams={setProductParams} />
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
    }

    .datatable_container {
        margin-top: 20px;
    }  
`