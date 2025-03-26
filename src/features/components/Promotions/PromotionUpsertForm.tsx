import { useEffect, useMemo, useState } from "react";
import styled from "styled-components"
import { Input } from "../../ui/Forms/Input";
import { useAppDispatch, useAppSelector } from "../../../app/store/configureStore";
import { Brand } from "../../../app/models/Brand";
import { Promotion, PromotionUpsert } from "../../../app/models/Promotion";
import { Dropdown, DropdownData } from "../../ui/Forms/Dropdown";
import { Category } from "../../../app/models/Category";
import { setPromotionsCreate, setPromotionUpdate } from "../../../app/store/promotionSlice";
import { useCategories } from "../../Hooks/useCategories";
import { useBrands } from "../../Hooks/useBrands";
import agent from "../../../app/api/agent";

interface Props {
    id: string;
    onSetOpenForm: (e: boolean) => void;
}

export const PromotionUpsertForm = ({id, onSetOpenForm} : Props) => {
    const [promotion, setPromotion] = useState<PromotionUpsert>({id: id, brandId: '', categoryId: '', startDate: new Date(), endDate: new Date(), percentageDiscount: 0});
    const {promotions} = useAppSelector(state => state.promotion);
    const existedPromoiton = promotions.find(c => c.id === id);
    const dispatch = useAppDispatch();
    const [loading, setLoading] = useState<boolean>(false);
    const [saving, setSaving] = useState<boolean>(false);

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
                    startDate: new Date(existedPromoiton.startDate),
                    endDate: new Date(existedPromoiton.endDate),
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
    
    const handleGetDataChange = (e: React.ChangeEvent<HTMLInputElement>, key: string) => {
        let value: string | Date;;
        switch(key){
            case "startDate":
            case "endDate":
                value = new Date(e.target.value);
                break;
            default:
                value = e.target.value;
                break;          
        }

        setPromotion(prev => {
            return {...prev, [key] : value};
        });        
    }

    const handleCloseForm = () => {
        onSetOpenForm(false);
    }

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        try{
            let promotionResult : Promotion;
            let objectParam = {
                id: promotion.id,
                categoryId: promotion.categoryId,
                brandId: promotion.brandId,
                startDate: promotion.startDate.toISOString(),
                endDate: promotion.endDate.toISOString(),
                percentageDiscount: promotion.percentageDiscount
            }
            console.log(objectParam);
            
            if(existedPromoiton) {            
                promotionResult = await agent.Promotions.update(objectParam);
                dispatch(setPromotionUpdate(promotionResult));
            }
            else {
                promotionResult = await agent.Promotions.create(objectParam);
                dispatch(setPromotionsCreate(promotionResult));          
            }
            handleCloseForm();
        }
        catch(error: any) {
            console.log(error);
        }
    }

    return (
        <Style onSubmit={handleSubmit} >
            <div className="form_inputs" >
                <Dropdown field="categoryId" data={categoryDropdown} currentSelectedValue={promotion.categoryId} onGetDataChange={e => handleGetDataChange(e, 'categoryId')} />
                <Dropdown field="brandId" data={brandDropdown} currentSelectedValue={promotion.brandId} onGetDataChange={e => handleGetDataChange(e, 'brandId')} />
                <Input id='startDate' placeholder="Start Date..." type="date" value={promotion.startDate instanceof Date ? promotion.startDate.toISOString().split("T")[0] : ''} onGetDataChange = {(e) => handleGetDataChange(e, 'startDate')}  />
                <Input id='endDate' placeholder="End Date..." type="date" value={promotion.startDate instanceof Date ? promotion.endDate.toISOString().split("T")[0] : ''} onGetDataChange = {(e) => handleGetDataChange(e, 'endDate')}  />
                <Input id='percentageDiscount' placeholder="% Discount" type="number" value={promotion.percentageDiscount} onGetDataChange = {(e) => handleGetDataChange(e, 'percentageDiscount')}  />
            </div>

            <div className="form_controls" >
                <button>Save</button>
            </div>
        </Style>
    )
}

const Style = styled.form`
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
`