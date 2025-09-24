import styled from "styled-components"
import { useAppDispatch, useAppSelector } from "../../../../app/store/configureStore"
import { Loading } from "../../../UI/Common/Loading";
import DataTable from "../../../UI/Data/DataTable";
import { EmptyData } from "../../../UI/Layout/EmptyData";
import { useEffect, useState } from "react";
import { fetchCategoryAsync, setCategoriesDelete } from "../../../../app/store/categorySlice";
import { Modal } from "../../../UI/Layout/Modal";
import agent from "../../../../app/api/agent";
import { ButtonCreateAdmin } from "../MainUI/ButtonCreateAdmin";
import { CategoryUpsertForm } from "./CategoryUpsertForm";

export const AdminCategory = () => {
    const {categories, status} = useAppSelector(state => state.category);
    const [categoryId, setCategoryId] = useState<string>('');
    const [openForm, setOpenForm] = useState<boolean>(false);
    const [isCreateMode, setIsCreateMode] = useState<boolean>(true);
    const dispatch = useAppDispatch();

    const columns = [
        {
            key: 'id',
            title: 'Category ID'
        },
        {
            key: 'name',
            title: 'Name'
        }
    ];

    const handleOpenCreateForm = () => {
        setOpenForm(true);
        setCategoryId(crypto.randomUUID());
        setIsCreateMode(true);
    }

    const handleDeleteCategory = async (id: string) => {
        try {
            await agent.Categories.delete(id);
            dispatch(setCategoriesDelete(id));
        }
        catch(error: any) {

        }
    }

    useEffect(() => {
        if(!status) dispatch(fetchCategoryAsync());
    }, [status, dispatch]);

    return (
        <Style>
            {openForm &&
                <Modal title={isCreateMode ? 'Create' : 'Update'} onSetOpen={setOpenForm} >
                    <CategoryUpsertForm id={categoryId} onSetOpenForm={setOpenForm} />
                </Modal>
            }

            <h1>Categories</h1>
            <div className="heading" >
                <ButtonCreateAdmin onOpenCreateForm={handleOpenCreateForm} />
            </div>

            {
                !status ?
                <Loading message="Loading..."/>
                :
                (
                    categories.length !== 0 ?          
                    <>
                        <DataTable 
                            data={categories} 
                            columns={columns} 

                            onSetCurrentId={setCategoryId} 
                            onSetOpenForm={setOpenForm}
                            onDeleteItem={handleDeleteCategory}
                        />
                    </>
                        :
                    <EmptyData message="There are not any Categories 😥 let 's create new !" />
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