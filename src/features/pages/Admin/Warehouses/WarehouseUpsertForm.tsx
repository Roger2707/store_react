import styled from "styled-components";
import { Input } from "../../../UI/Forms/Input";
import { useEffect, useState } from "react";
import { Warehouse } from "../../../../app/models/Warehouse";
import { useAppDispatch, useAppSelector } from "../../../../app/store/configureStore";
import { setWarehousesCreate, setWarehousesUpdate } from "../../../../app/store/warehouseSlice";
import agent from "../../../../app/api/agent";

interface Props {
    id: string;
    onSetOpenForm: (e: boolean) => void;
}

export const WarehosueUpsertForm = ({id, onSetOpenForm}: Props) => {
    const [warehouse, setwarehouse] = useState<Warehouse>({id: id, name: '', location: '', isSuperAdminOnly: false});
    const {warehouses} = useAppSelector(state => state.warehouse);
    const dispatch = useAppDispatch();
    const existedwarehouse = warehouses.find(c => c.id === id);
    const [saving, setSaving] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        setLoading(true);
        if(existedwarehouse !== undefined) {
            setwarehouse(prev => {
                return {id: existedwarehouse.id, name: existedwarehouse.name, location: existedwarehouse.location, isSuperAdminOnly: existedwarehouse.isSuperAdminOnly};
            });            
        }
        setLoading(false);
    }, [existedwarehouse, dispatch])

    const handleGetDataChange = (e: any, key: string) => {
        let changeValue = e.target.value;
        switch(key) {
            case 'isSuperAdminOnly':
                setwarehouse(prev => {
                    return {...prev, isSuperAdminOnly: !warehouse.isSuperAdminOnly};
                });
                break;
            default:
                setwarehouse(prev => {
                    return {...prev, [key] : changeValue};
                });
        }
    }

    const handleCloseForm = () => {
        onSetOpenForm(false);
    }

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        let warehouseResponse : Warehouse;
        try{
            setSaving(true);
            if(existedwarehouse) {        
                warehouseResponse = await agent.Warehouses.update(warehouse); 
                dispatch(setWarehousesUpdate(warehouseResponse));
            }
            else {
                warehouseResponse = await agent.Warehouses.create(warehouse);
                dispatch(setWarehousesCreate(warehouseResponse));
            }
            handleCloseForm();
        }
        catch(error: any) {
            console.log(error);
        }
        finally {
            setSaving(false);
        }
    }

    return (
        <Style onSubmit={handleSubmit} disabled={saving || loading}>
            <Input 
                id='name' placeholder="Warehouse Name..." type="text" 
                value={warehouse.name} onGetDataChange = {(e) => handleGetDataChange(e, 'name')}  
            />
            <Input 
                id='location' placeholder="Warehouse Location..." type="text" 
                value={warehouse.location} onGetDataChange = {(e) => handleGetDataChange(e, 'location')} marginTop="1vh"  
            />
            <Input 
                id='isSuperAdminOnly' type="checkbox" 
                value={warehouse.isSuperAdminOnly} onGetDataChange = {(e) => handleGetDataChange(e, 'isSuperAdminOnly')} marginTop="1vh" 
                forCheckboxTitle="superAdmin check?" width="10%" 
            />

            <div className="form_controls" >
                <button>Save</button>
            </div>
        </Style>
    )
}

const Style = styled.form<{ disabled: boolean }>` 
    height: fit-content;
    min-width: 55vw;

    opacity: ${(props) => (props.disabled ? 0.6 : 1)};
    pointer-events: ${(props) => (props.disabled ? "none" : "auto")}; 

    .form_controls {
        margin-top: 20vh;
        display: flex;
        justify-content: right;

        border-top: 2px solid #6082B6;
        padding-top: 1vh;

        button {
            padding: 10px 20px;
            font-size: 1.1rem;
            border-radius: 10px;
            border: none;
            outline: none;
            background-color: #EE4B2B;
            color: white;
            opacity: 0.8;

            &:hover {
                cursor: pointer;
                opacity: 1;
                transition: 0.5s;
            }
        }
    }
`