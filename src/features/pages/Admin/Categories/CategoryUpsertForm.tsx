import { useEffect, useState } from "react";
import styled from "styled-components"
import { Category } from "../../../../app/models/Category";
import { useAppDispatch, useAppSelector } from "../../../../app/store/configureStore";
import agent from "../../../../app/api/agent";
import { setCategoriesCreate, setCategoriesUpdate } from "../../../../app/store/categorySlice";
import { Input } from "../../../UI/Forms/Input";


interface Props {
    id: string;
    onSetOpenForm: (e: boolean) => void;
}

export const CategoryUpsertForm = ({id, onSetOpenForm} : Props) => {
    const [category, setCategory] = useState<Category>({id: id, name: ''});
    const {categories} = useAppSelector(state => state.category);
    const dispatch = useAppDispatch();
    const existedCategory = categories.find(c => c.id === id);
    const [saving, setSaving] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        setLoading(true);
        if(existedCategory !== undefined) {
            setCategory(prev => {
                return {id: existedCategory.id, name: existedCategory.name};
            });
        }
        setLoading(false);
    }, [existedCategory, dispatch])

    const handleGetDataChange = (e: any, key: string) => {
        setCategory(prev => {
            return {...prev, [key] : e.target.value};
        });
    }

    const handleCloseForm = () => {
        onSetOpenForm(false);
    }

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        let categoryResponse : Category;
        try{
            setSaving(true);
            if(existedCategory) {
                categoryResponse = await agent.Categories.update(category); 
                dispatch(setCategoriesUpdate(categoryResponse));
            }
            else {
                categoryResponse = await agent.Categories.create(category);
                dispatch(setCategoriesCreate(categoryResponse));
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
            <Input id='name' placeholder="Category Name..." type="text" value={category.name} onGetDataChange = {(e) => handleGetDataChange(e, 'name')}  />
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