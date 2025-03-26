import { useEffect, useState } from "react";
import styled from "styled-components"
import { Input } from "../../ui/Forms/Input";
import { useAppDispatch, useAppSelector } from "../../../app/store/configureStore";
import { Category } from "../../../app/models/Category";
import agent from "../../../app/api/agent";
import { setCategories } from "../../../app/store/categorySlice";

interface Props {
    id: string;
    onSetOpenForm: (e: boolean) => void;
}

export const CategoryUpsertForm = ({id, onSetOpenForm} : Props) => {
    const [category, setCategory] = useState<Category>({id: id, name: ''});
    const {categories} = useAppSelector(state => state.category);
    const dispatch = useAppDispatch();
    const existedCategory = categories.find(c => c.id === id);

    useEffect(() => {
        if(existedCategory !== undefined) {
            setCategory(prev => {
                return {id: existedCategory.id, name: existedCategory.name};
            });
        }
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
        try{
            if(existedCategory) await agent.Categories.update(category); 
            else await agent.Categories.create(category);

            dispatch(setCategories(undefined));
            handleCloseForm();
        }
        catch(error: any) {
            console.log(error);
        }
    }

    return (
        <Style>
            <form onSubmit={handleSubmit} >
                <Input id='name' placeholder="Category Name..." type="text" value={category.name} onGetDataChange = {(e) => handleGetDataChange(e, 'name')}  />
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