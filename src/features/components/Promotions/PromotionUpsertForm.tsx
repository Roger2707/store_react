import { useEffect, useMemo, useState } from "react";
import styled from "styled-components"
import { Input } from "../../ui/Forms/Input";
import { useAppDispatch, useAppSelector } from "../../../app/store/configureStore";
import { Brand } from "../../../app/models/Brand";
import { Promotion, PromotionUpsert } from "../../../app/models/Promotion";
import { Dropdown, DropdownData } from "../../ui/Forms/Dropdown";
import { Category } from "../../../app/models/Category";
import { setPromotions } from "../../../app/store/promotionSlice";
import { useCategories } from "../../Hooks/useCategories";
import { useBrands } from "../../Hooks/useBrands";
import agent from "../../../app/api/agent";
import { formatDateString } from "../../../app/utils/helper";

interface Props {
    id: string;
    onSetOpenForm: (e: boolean) => void;
}

export const PromotionUpsertForm = ({id, onSetOpenForm} : Props) => {
    const [promotion, setPromotion] = useState<PromotionUpsert>({id: id, brandId: '', categoryId: '', start: '', end: '', percentageDiscount: 0});
    const {promotions} = useAppSelector(state => state.promotion);
    const existedPromoiton = promotions.find(c => c.id === id);
    const dispatch = useAppDispatch();

    // react query
    const {data: categories} = useCategories();
    const {data: brands} = useBrands();
    
    // This function only called when update mode
    useEffect(() => {
        if(existedPromoiton) {      
            setPromotion(prev => {
                return {
                    id: existedPromoiton.id,
                    categoryId: existedPromoiton.categoryId, 
                    brandId: existedPromoiton.brandId,
                    start: existedPromoiton.startDate+'',
                    end: existedPromoiton.endDate+'',
                    percentageDiscount: existedPromoiton.percentageDiscount
                };
            });
        }
    }, [existedPromoiton]);

    const categoryDropdown : DropdownData[] = useMemo(() => {
        return categories?.map((d: Category) => ({ title: d.name, value: d.id })) || [];
    }, [categories]);
    
    useEffect(() => {     
        if (promotion.categoryId === '' && categoryDropdown.length > 0) {
            setPromotion(prev => ({
                ...prev,
                categoryId: categoryDropdown[0].value
            }));
        }
    }, [categoryDropdown, promotion.categoryId]); 
    
    const brandDropdown : DropdownData[] = useMemo(() => {
        return brands?.map((d: Brand) => ({ title: d.name, value: d.id })) || [];
    }, [brands]);
    
    useEffect(() => {     
        if (promotion.brandId === '' && brandDropdown.length > 0) {
            setPromotion(prev => ({
                ...prev,
                brandId: brandDropdown[0].value
            }));
        }
    }, [brandDropdown, promotion.brandId]);
    
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
    }

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        handleBeforeSubmit();
        try{
            let promotionResult : Promotion;
            if(existedPromoiton) {            
                promotionResult = await agent.Promotions.update(
                {
                    id: promotion.id,
                    categoryId: promotion.categoryId,
                    brandId: promotion.brandId,
                    start: promotion.start.split('T')[0].replaceAll('-', ''),
                    end: promotion.end.split('T')[0].replaceAll('-', ''),
                    percentageDiscount: promotion.percentageDiscount
                });
            }
            else {
                promotionResult = await agent.Promotions.create(
                {
                    id: promotion.id,
                    categoryId: promotion.categoryId,
                    brandId: promotion.brandId,
                    start: promotion.start.replaceAll('-', ''),
                    end: promotion.end.replaceAll('-', ''),
                    percentageDiscount: promotion.percentageDiscount
                });

                console.log(promotionResult);
                
                promotionResult = 
                {
                    ...promotionResult
                    , categoryName: categoryDropdown.filter(c => c.value === promotionResult.categoryId)[0].title
                    , brandName: brandDropdown.filter(c => c.value === promotionResult.brandId)[0].title
                    , startDate: new Date(formatDateString(promotionResult.startDate.toString()))
                    , endDate: new Date(formatDateString(promotionResult.endDate.toString()))
                }
                dispatch(setPromotions(promotionResult));
            }
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