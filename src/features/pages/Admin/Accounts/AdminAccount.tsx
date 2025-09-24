import styled from "styled-components";
import { EmptyData } from "../../../UI/Layout/EmptyData";
import DataTable from "../../../UI/Data/DataTable";
import { ButtonCreateAdmin } from "../MainUI/ButtonCreateAdmin";
import { Loading } from "../../../UI/Common/Loading";
import { Modal } from "../../../UI/Layout/Modal";
import { useAppDispatch, useAppSelector } from "../../../../app/store/configureStore";
import { ReactNode, useEffect, useState } from "react";
import { fetchAllUsers } from "../../../../app/store/userSlice";

export const AdminAccount = () => {
    const {users, isLoadedUsers} = useAppSelector(state => state.user);
    const [userId, setUserId] = useState<number>(0);
    const [openForm, setOpenForm] = useState<boolean>(false);
    const [isCreateMode, setIsCreateMode] = useState<boolean>(true);
    const dispatch = useAppDispatch();

    const columns = [
        {
            key: 'id',
            title: 'User ID'
        },
        {
            key: 'userName',
            title: 'Username'
        },
        {
            key: 'fullName',
            title: 'Fullname'
        },
        {
            key: 'email',
            title: 'Email'
        },
        {
            key: 'phoneNumber',
            title: 'Phone Number'
        },
        {
            key: 'dob',
            title: 'Date Of Birth',
            render: (value: any) => {
                const dateValue = new Date(value);
                return isNaN(dateValue.getTime()) ? <p>Invalid Date</p> : <p>{dateValue.toLocaleDateString('vi-VN')}</p> as ReactNode
            }
        },
    ];

    const handleOpenCreateForm = () => {
        setOpenForm(true);
        setUserId(100);
        setIsCreateMode(true);
    }

    const handleDeleteUser = async (id: string) => {
        try {
            console.log(userId);
        }
        catch(error: any) {

        }
        finally {
            setUserId(0);
        }
    }

    useEffect(() => {
        if(!isLoadedUsers) dispatch(fetchAllUsers());
    }, [isLoadedUsers, dispatch]);

    return (
        <Style>
            {openForm &&
                <Modal title={isCreateMode ? 'Create' : 'Update'} onSetOpen={setOpenForm} >
                    <></>
                </Modal>
            }

            <h1>Accounts</h1>
            <div className="heading" >
                <ButtonCreateAdmin onOpenCreateForm={handleOpenCreateForm} />
            </div>

            {
                !isLoadedUsers ?
                <Loading message="Loading..."/>
                :
                (
                    users && users.length !== 0 ?          
                    <>
                        <DataTable 
                            data={users} 
                            columns={columns} 

                            onSetCurrentId={setUserId} 
                            onSetOpenForm={setOpenForm}
                            onDeleteItem={handleDeleteUser}
                            onSetIsCreateMode={setIsCreateMode}
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