import { ReactNode, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../app/store/configureStore";
import agent from "../../../../app/api/agent";
import { fetchPromotionsAsync, setPromotionDelete } from "../../../../app/store/promotionSlice";
import { Modal } from "../../../UI/Layout/Modal";
import { Loading } from "../../../UI/Common/Loading";
import { EmptyData } from "../../../UI/Layout/EmptyData";
import DataTable from "../../../UI/Data/DataTable";
import styled from "styled-components";
import { PromotionUpsertForm } from "./PromotionUpsertForm";
import { ButtonCreateAdmin } from "../MainUI/ButtonCreateAdmin";

export const AdminPromotion = () => {
    const [promotionId, setPromotionId] = useState<string>('');
    const [openForm, setOpenForm] = useState<boolean>(false);
    const [isCreateMode, setIsCreateMode] = useState<boolean>(false);
    const dispatch = useAppDispatch();
    const {promotions, status} = useAppSelector(state => state.promotion);

    const columns = [
        {
            key: 'id',
            title: 'Promotion ID',
        },
        {
            key: 'categoryId',
            title: 'Category ID'
        },
        {
            key: 'categoryName',
            title: 'Category Name'
        },
        {
            key: 'brandId',
            title: 'Brand ID'
        },
        {
            key: 'brandName',
            title: 'Brand Name'
        },
        {
            key: 'startDate',
            title: 'Start Date',
            render: (value: string | number | Date) => {
                const dateValue = new Date(value);
                return <p>{dateValue.toLocaleDateString('vi-VN')}</p> as ReactNode
            }
        },
        {
            key: 'endDate',
            title: 'End Date',
            render: (value: string | number | Date) => {
                const dateValue = new Date(value);
                return <p>{dateValue.toLocaleDateString('vi-VN')}</p> as ReactNode
            }
        },
        {
            key: 'percentageDiscount',
            title: 'Discount (%)'
        },
    ];

    const handleOpenCreateForm = () => {
        setOpenForm(true);
        setPromotionId(crypto.randomUUID());
        setIsCreateMode(true);
    }

    const handleDeletePromotion = async (id: string) => {
        try {
            await agent.Promotions.delete(id);
            dispatch(setPromotionDelete(id));
        }
        catch(error: any) {
            console.error(error);
        }
    }

    useEffect(() => {
        if(!status) dispatch(fetchPromotionsAsync());
    }, [status, dispatch]);

    return (
        <Style>
            {openForm &&
                <Modal title={isCreateMode ? 'Create' : 'Update'} onSetOpen={setOpenForm} >
                    <PromotionUpsertForm id={promotionId} onSetOpenForm={setOpenForm} />
                </Modal>
            }

            <h1>Promotions: </h1>
            <div className="heading" >
                <ButtonCreateAdmin onOpenCreateForm={handleOpenCreateForm} />
            </div>

            {
                !status ?
                <Loading message="Loading..."/>
                :
                (
                    (promotions != null && promotions.length !== 0) ?
                    <>
                        <DataTable 
                            data={promotions}
                            columns={columns} 

                            onSetCurrentId={setPromotionId} 
                            onSetOpenForm={setOpenForm}
                            onDeleteItem={handleDeletePromotion}
                        />
                    </>
                        :
                    <EmptyData message="There are not any Promotions 😥 let 's create new !" />
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