import styled from "styled-components"
import { EmptyData } from "../../../UI/Layout/EmptyData";
import { Modal } from "../../../UI/Layout/Modal";
import { useEffect, useState } from "react";
import { fetchWarehousesAsync, setWarehousesDelete } from "../../../../app/store/warehouseSlice";
import agent from "../../../../app/api/agent";
import { useAppDispatch, useAppSelector } from "../../../../app/store/configureStore";
import { Loading } from "../../../UI/Common/Loading";
import DataTable from "../../../UI/Data/DataTable";
import { WarehosueUpsertForm } from "./WarehouseUpsertForm";
import { ButtonCreateAdmin } from "../MainUI/ButtonCreateAdmin";

export const AdminWarehouse = () => {
    const {warehouses, status} = useAppSelector(state => state.warehouse);
    const [warehouseId, setWarehouseId] = useState<string>('');
    const [openForm, setOpenForm] = useState<boolean>(false);
    const [isCreateMode, setIsCreateMode] = useState<boolean>(false);
    const dispatch = useAppDispatch();

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
                <ButtonCreateAdmin onOpenCreateForm={handleOpenCreateForm} />
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
    }


    .datatable_container {
        margin-top: 20px;
    }  
`
