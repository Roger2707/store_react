import { Dispatch, SetStateAction, useEffect, useState } from "react";
import styled from "styled-components"
import { Input } from "../../ui/Forms/Input";
import { useAppDispatch, useAppSelector } from "../../../app/store/configureStore";
import agent from "../../../app/api/agent";
import { Brand } from "../../../app/models/Brand";
import { fetchBrandsAsync } from "../../../app/store/brandSlice";
import { PromotionUpsert } from "../../../app/models/Promotion";
import { Dropdown, DropdownData } from "../../ui/Forms/Dropdown";
import { Category } from "../../../app/models/Category";
import { fetchCategoryAsync } from "../../../app/store/categorySlice";
import { setPromotions } from "../../../app/store/promotionSlice";

interface Props {
    id: number;
    onSetOpenForm: (e: boolean) => void;
    onSetPromotionId: Dispatch<SetStateAction<number>>;
}

export const PromotionUpsertForm = ({id, onSetOpenForm, onSetPromotionId} : Props) => {
    const [promotion, setPromotion] = useState<PromotionUpsert>({brandId: 1, categoryId: 1, start: '', end: '', percentageDiscount: 0});
    const {promotions} = useAppSelector(state => state.promotion);
    const {categories, status: categoryStatus} = useAppSelector(state => state.category);
    const {brands, status: brandStatus} = useAppSelector(state => state.brand);
    const [categoryDropdown, setCategoryDropdown] = useState<DropdownData[]>([]);
    const [brandDropdown, setBrandDropdown] = useState<DropdownData[]>([]);
    const dispatch = useAppDispatch();
    const existedPromoiton = promotions.find(c => c.id === id);

    useEffect(() => {
        if(existedPromoiton !== undefined) {      
            setPromotion(prev => {
                return {    
                    categoryId: existedPromoiton.categoryId, 
                    brandId: existedPromoiton.brandId,
                    start: existedPromoiton.startDate+'',
                    end: existedPromoiton.endDate+'',
                    percentageDiscount: existedPromoiton.percentageDiscount
                };
            });
        }

        // Handle Dropdown Data
        if(!categoryStatus) dispatch(fetchCategoryAsync());
        setCategoryDropdown(prev => {
            return categories.map((c: Category) => {
                return {title: c.name, value: c.id};
            });
        });

        if(!brandStatus) dispatch(fetchBrandsAsync());
        setBrandDropdown(prev => {
            return brands.map((c: Brand) => {
                return {title: c.name, value: c.id};
            });
        });

    }, [existedPromoiton, dispatch, categories, brands, brandStatus, categoryStatus]);


    const handleGetDataChange = (e: any, key: string) => {
        setPromotion(prev => {
            return {...prev, [key] : e.target.value};
        });
    }

    const handleBeforeSubmit = () => {
        console.log(promotion);
        
    }

    const handleCloseForm = () => {
        onSetOpenForm(false);
        onSetPromotionId(0);
    }

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        handleBeforeSubmit();

        try{
            if(existedPromoiton) {            
                await agent.Promotions.update(existedPromoiton.id, 
                    {
                        categoryId: promotion.categoryId,
                        brandId: promotion.brandId,
                        start: promotion.start.split('T')[0].replaceAll('-', ''),
                        end: promotion.end.split('T')[0].replaceAll('-', ''),
                        percentageDiscount: promotion.percentageDiscount
                    }); 
            }
            else await agent.Promotions.create(
                    {
                        categoryId: promotion.categoryId,
                        brandId: promotion.brandId,
                        start: promotion.start.replaceAll('-', ''),
                        end: promotion.end.replaceAll('-', ''),
                        percentageDiscount: promotion.percentageDiscount
                    });

            dispatch(setPromotions(undefined));
            handleCloseForm();
        }
        catch(error: any) {
            console.log(error);
        }
    }

    return (
        <Style>
            <form onSubmit={handleSubmit} >
                <Dropdown field="categoryId" data={categoryDropdown} currentSelectedValue={promotion.categoryId} onGetDataChange={e => handleGetDataChange(e, 'categoryId')} />
                <Dropdown field="brandId" data={brandDropdown} currentSelectedValue={promotion.brandId} onGetDataChange={e => handleGetDataChange(e, 'brandId')} />

                <Input id='startDate' placeholder="Start Date..." type="date" value={promotion.start.split('T')[0]} onGetDataChange = {(e) => handleGetDataChange(e, 'start')}  />
                <Input id='endDate' placeholder="End Date..." type="date" value={promotion.end.split('T')[0]} onGetDataChange = {(e) => handleGetDataChange(e, 'end')}  />

                <Input id='percentageDiscount' placeholder="% Discount" type="number" value={promotion.percentageDiscount} onGetDataChange = {(e) => handleGetDataChange(e, 'percentageDiscount')}  />

                <div className="form_controls" >
                    <button>{id === 0 ? 'Create' : 'Update'}</button>
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