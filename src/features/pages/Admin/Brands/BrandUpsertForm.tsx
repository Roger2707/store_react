import { useEffect, useState } from "react";
import styled from "styled-components"
import { Brand } from "../../../../app/models/Brand";
import { useAppDispatch, useAppSelector } from "../../../../app/store/configureStore";
import agent from "../../../../app/api/agent";
import { setBrandsCreate, setBrandsUpdate } from "../../../../app/store/brandSlice";
import { Input } from "../../../UI/Forms/Input";


interface Props {
    id: string;
    onSetOpenForm: (e: boolean) => void;
}

export const BrandUpsertForm = ({id, onSetOpenForm} : Props) => {
    const [brand, setBrand] = useState<Brand>({id: id, name: '', country: ''});
    const {brands} = useAppSelector(state => state.brand);
    const dispatch = useAppDispatch();
    const existedBrand = brands.find(c => c.id === id);
    const [saving, setSaving] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        setLoading(true);
        if(existedBrand !== undefined) {
            setBrand(prev => {
                return {id: existedBrand.id, name: existedBrand.name, country: existedBrand.country};
            });
        }
        setLoading(false);
    }, [existedBrand, dispatch])

    const handleGetDataChange = (e: any, key: string) => {
        setBrand(prev => {
            return {...prev, [key] : e.target.value};
        });
    }

    const handleCloseForm = () => {
        onSetOpenForm(false);
    }

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        let brandResponse : Brand;
        try{
            setSaving(true);
            if(existedBrand) {
                brandResponse = await agent.Brands.update(brand); 
                dispatch(setBrandsUpdate(brandResponse));
            }
            else {
                brandResponse = await agent.Brands.create(brand);
                dispatch(setBrandsCreate(brandResponse));
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
            <Input id='name' placeholder="Brand Name..." type="text" value={brand.name} onGetDataChange = {(e) => handleGetDataChange(e, 'name')}  />
            <div style={{margin: '1vh'}} ></div>
            <Input id='country' placeholder="Brand Country..." type="text" value={brand.country} onGetDataChange = {(e) => handleGetDataChange(e, 'country')}  />
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
        margin-top: 25vh;
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