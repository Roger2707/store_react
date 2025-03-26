import { useEffect, useState } from "react";
import styled from "styled-components"
import { Input } from "../../ui/Forms/Input";
import { useAppDispatch, useAppSelector } from "../../../app/store/configureStore";
import agent from "../../../app/api/agent";
import { Brand } from "../../../app/models/Brand";
import { setBrands } from "../../../app/store/brandSlice";

interface Props {
    id: string;
    onSetOpenForm: (e: boolean) => void;
}

export const BrandUpsertForm = ({id, onSetOpenForm} : Props) => {
    const [brand, setBrand] = useState<Brand>({id: id, name: '', country: ''});
    const {brands} = useAppSelector(state => state.brand);
    const dispatch = useAppDispatch();
    const existedBrand = brands.find(c => c.id === id);

    useEffect(() => {
        if(existedBrand !== undefined) {
            setBrand(prev => {
                return {id: existedBrand.id, name: existedBrand.name, country: existedBrand.country};
            });
        }
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

        try{
            if(existedBrand) await agent.Brands.update(brand); 
            else await agent.Brands.create(brand);

            dispatch(setBrands(undefined));
            handleCloseForm();
        }
        catch(error: any) {
            console.log(error);
        }
    }

    return (
        <Style>
            <form onSubmit={handleSubmit} >
                <Input id='name' placeholder="Brand Name..." type="text" value={brand.name} onGetDataChange = {(e) => handleGetDataChange(e, 'name')}  />

                <Input id='country' placeholder="Brand Country..." type="text" value={brand.country} onGetDataChange = {(e) => handleGetDataChange(e, 'country')}  />

                <div className="form_controls" >
                    <button>Save</button>
                </div>
            </form>
        </Style>
    )
}

const Style = styled.div`
    form {

        .form_inputs {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 10%;
            
        }

        .form_controls {
            margin-top: 11vh;
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
    }
`