import styled from "styled-components";
import { EmptyData } from "../../ui/Layout/EmptyData";
import DataTable from "../../ui/Data/DataTable";
import { Loading } from "../../ui/Common/Loading";
import { FaPlus } from "react-icons/fa";
import { Modal } from "../../ui/Layout/Modal";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/store/configureStore";
import agent from "../../../app/api/agent";
import { fetchBrandsAsync, setBrands } from "../../../app/store/brandSlice";
import { BrandUpsertForm } from "../../components/Brands/BrandUpsertForm";

export const AdminBrand = () => {
    const {brands, status} = useAppSelector(state => state.brand);
    const [brandId, setBrandId] = useState<number>(0);
    const [openForm, setOpenForm] = useState<boolean>(false);
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
        setBrandId(0);
    }

    const handleDeleteBrand = async (id: number) => {
        try {
            await agent.Brands.delete(id);
            dispatch(setBrands(undefined));
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
                <Modal title={brandId === 0 ? 'Create' : 'Update'} onSetOpen={setOpenForm} >
                    <BrandUpsertForm id={brandId} onSetOpenForm={setOpenForm} onSetBrandId={setBrandId} />
                </Modal>
            }

            <h1>Brands</h1>
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