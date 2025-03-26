import { ReactNode, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/store/configureStore";
import agent from "../../../app/api/agent";
import { fetchPromotionsAsync, setPromotions } from "../../../app/store/promotionSlice";
import { Modal } from "../../ui/Layout/Modal";
import { FaPlus } from "react-icons/fa";
import { Loading } from "../../ui/Common/Loading";
import { EmptyData } from "../../ui/Layout/EmptyData";
import DataTable from "../../ui/Data/DataTable";
import styled from "styled-components";
import { PromotionUpsertForm } from "../../components/Promotions/PromotionUpsertForm";

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
            dispatch(setPromotions(undefined));
        }
        catch(error: any) {

        }
    }

    useEffect(() => {
        if(!status) dispatch(fetchPromotionsAsync({start: '', end: ''}));
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