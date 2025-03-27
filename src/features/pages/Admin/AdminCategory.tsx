import styled from "styled-components"
import { useAppDispatch, useAppSelector } from "../../../app/store/configureStore"
import { Loading } from "../../ui/Common/Loading";
import DataTable from "../../ui/Data/DataTable";
import { EmptyData } from "../../ui/Layout/EmptyData";
import { FaPlus } from "react-icons/fa";
import { useEffect, useState } from "react";
import { fetchCategoryAsync, setCategoriesDelete } from "../../../app/store/categorySlice";
import { Modal } from "../../ui/Layout/Modal";
import { CategoryUpsertForm } from "../../components/Categories/CategoryUpsertForm";
import agent from "../../../app/api/agent";

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
                <button id='btn-create' onClick={handleOpenCreateForm} >
                    <span className="btn-icon" ><FaPlus/></span>
                    <span className="btn-title" >Create</span>
                </button>
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