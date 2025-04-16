import styled from "styled-components";
import { EmptyData } from "../../ui/Layout/EmptyData";
import DataTable from "../../ui/Data/DataTable";
import { Loading } from "../../ui/Common/Loading";
import { Modal } from "../../ui/Layout/Modal";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/store/configureStore";
import agent from "../../../app/api/agent";
import { fetchBrandsAsync, setBrandsDelete } from "../../../app/store/brandSlice";
import { BrandUpsertForm } from "../../components/Brands/BrandUpsertForm";
import { ButtonCreateAdmin } from "./UI/ButtonCreateAdmin";

export const AdminBrand = () => {
    const {brands, status} = useAppSelector(state => state.brand);
    const [brandId, setBrandId] = useState<string>('');
    const [openForm, setOpenForm] = useState<boolean>(false);
    const [isCreateMode, setIsCreateMode] = useState<boolean>(false);
    const dispatch = useAppDispatch();

    const columns = [
        {
            key: 'id',
            title: 'Brand ID',
        },
        {
            key: 'name',
            title: 'Name'
        },
        {
            key: 'country',
            title: 'Country'
        },
    ];

    const handleOpenCreateForm = () => {
        setOpenForm(true);
        setBrandId(crypto.randomUUID());
        setIsCreateMode(true);
    }

    const handleDeleteBrand = async (id: string) => {
        try {
            await agent.Brands.delete(id);
            dispatch(setBrandsDelete(id));
        }
        catch(error: any) {

        }
    }

    useEffect(() => {
        if(!status) dispatch(fetchBrandsAsync());
    }, [status, dispatch]);

    return (
        <Style>
            {openForm &&
                <Modal title={isCreateMode ? 'Create' : 'Update'} onSetOpen={setOpenForm} >
                    <BrandUpsertForm id={brandId} onSetOpenForm={setOpenForm} />
                </Modal>
            }

            <h1>Brands</h1>
            <div className="heading" >
                <ButtonCreateAdmin onOpenCreateForm={handleOpenCreateForm} />
            </div>

            {
                !status ?
                <Loading message="Loading..."/>
                :
                (
                    brands.length !== 0 ?          
                    <>
                        <DataTable 
                            data={brands} 
                            columns={columns} 

                            onSetCurrentId={setBrandId} 
                            onSetOpenForm={setOpenForm}
                            onDeleteItem={handleDeleteBrand}
                        />
                    </>
                        :
                    <EmptyData message="There are not any Brands 😥 let 's create new !" />
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