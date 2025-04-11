import styled from "styled-components"
import { EmptyData } from "../../ui/Layout/EmptyData";
import { FaPlus } from "react-icons/fa";
import { Modal } from "../../ui/Layout/Modal";
import { useEffect, useState } from "react";
import { fetchWarehousesAsync, setWarehousesDelete } from "../../../app/store/warehouseSlice";
import agent from "../../../app/api/agent";
import { useAppDispatch, useAppSelector } from "../../../app/store/configureStore";
import { Loading } from "../../ui/Common/Loading";
import DataTable from "../../ui/Data/DataTable";
import { WarehosueUpsertForm } from "../../components/Warehouses/WarehouseUpsertForm";

export const AdminWarehouse = () => {
    const {warehouses, status} = useAppSelector(state => state.warehouse);
    const [warehouseId, setWarehouseId] = useState<string>('');
    const [openForm, setOpenForm] = useState<boolean>(false);
    const [isCreateMode, setIsCreateMode] = useState<boolean>(false);
    const dispatch = useAppDispatch();
    const {user} = useAppSelector(state => state.user);

    const columns = [
        {
            key: 'id',
            title: 'Warehouse ID',
        },
        {
            key: 'name',
            title: 'Name'
        },
        {
            key: 'location',
            title: 'location'
        },
    ];

    const handleOpenCreateForm = () => {
        setOpenForm(true);
        setWarehouseId(crypto.randomUUID());
        setIsCreateMode(true);
    }

    const handleDeleteWarehouse = async (id: string) => {
        try {
            await agent.Warehouses.delete(id);
            dispatch(setWarehousesDelete(id));
        }
        catch(error: any) {

        }
    }

    useEffect(() => {
        if(!status) dispatch(fetchWarehousesAsync());
    }, [status, dispatch]);

    return (
        <Style>
            {openForm &&
                <Modal title={isCreateMode ? 'Create' : 'Update'} onSetOpen={setOpenForm} >
                    <WarehosueUpsertForm id={warehouseId} onSetOpenForm={setOpenForm} />
                </Modal>
            }

            <h1>Warehouses</h1>
            <div className="heading" >
                <button disabled={user?.role === 'SuperAdmin' ? false : true} id='btn-create' onClick={handleOpenCreateForm} >
                    <span className="btn-icon" ><FaPlus/></span>
                    <span className="btn-title" >Create</span>
                </button>
            </div>

            {
                !status ?
                <Loading message="Loading..."/>
                :
                (
                    warehouses.length !== 0 ?          
                    <>
                        <DataTable 
                            data={warehouses} 
                            columns={columns} 

                            onSetCurrentId={setWarehouseId} 
                            onSetOpenForm={setOpenForm}
                            onDeleteItem={handleDeleteWarehouse}
                            isPermitAction={user?.role === 'SuperAdmin'}
                        />
                    </>
                        :
                    <EmptyData message="There are not any Warehouse 🏠 😥 let 's create new !" />
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

            &:disabled {
                cursor: not-allowed;
                opacity: 0.2;
            }
        }
    }


    .datatable_container {
        margin-top: 20px;
    }  
`
