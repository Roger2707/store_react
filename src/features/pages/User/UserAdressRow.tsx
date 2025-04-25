import styled from "styled-components"
import { UserAddressDTO, UserDTO } from "../../../app/models/User"
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Dropdown, DropdownData } from "../../ui/Forms/Dropdown";
import agent from "../../../app/api/agent";
import { Input } from "../../ui/Forms/Input";

interface Props {
    userAddress : UserAddressDTO
    onSetUser: Dispatch<SetStateAction<UserDTO>>;
    indexRow: number;
    onAddRow: (index: number) => void;
    onRemoveRow: (index: number) => void;
}

export const UserAddressRow = ({userAddress, onSetUser, indexRow, onAddRow, onRemoveRow} : Props) => {
    const [cities, setCities] = useState<DropdownData[]>([]);
    const [districts, setDistricts] = useState<DropdownData[]>([]);
    const [wards, setWards] = useState<DropdownData[]>([]);
    
    useEffect(() => {
        async function fetchCities() {
            try {
                const response = await agent.Location.getCities();
                if(response) {
                    setCities(prevState => {
                        return response.map((d: any) => {
                            return {title: d.name, value: d.code};
                        })
                    });
                }
            } 
            catch (error) {
                console.error(error);
            }
        }
        fetchCities();
    }, []);

    useEffect(() => {
        async function fetchDistricts(cityCode: number) {
            try {
                const response = await agent.Location.getDistricts(cityCode);
                if(response) {
                    setDistricts(prevState => {
                        return response.map((d: any) => {
                            return {title: d.name, value: d.code};
                        })
                    });
                }
            }
            catch (error) {
                console.error(error);
            }
        }

        const cityCode = cities.find(c => c.title === userAddress.city)?.value;
        
        cityCode && fetchDistricts(+cityCode);

    }, [cities, userAddress.city]);

    useEffect(() => {
        async function fetchWards(districtCode: number) {
            try {
                const response = await agent.Location.getWards(districtCode);
                if(response) {
                    setWards(prevState => {
                        return response.map((d: any) => {
                            return {title: d.name, value: d.code};
                        })
                    });
                }
            } 
            catch (error) {
                console.error(error);
            }
        }

        const districtCode = districts.find(c => c.title === userAddress.district)?.value;
        districtCode && fetchWards(+districtCode);

    }, [districts, userAddress.district]);
    
    const handleGetDataChange = (e: any, key: string) => {
        let newValue = e.target.value;
        
        switch (key) {
            case 'city':
                const cityName = cities.find(c => c.value === +newValue)?.title;
                newValue = cityName;
                break;
            case 'district':
                const districtName = districts.find(c => c.value === +newValue)?.title;                
                newValue = districtName;
                break;
            case 'ward':
                const wardName = wards.find(c => c.value === +newValue)?.title;                
                newValue = wardName;
                break;
            case 'streetAddress':
            case 'postalCode':
            case 'country':
                newValue = e.target.value;
                break;
            default:
                newValue = e.target.value;
        }
        
        const updatedUserAddress : UserAddressDTO = { 
            ...userAddress
            , [key]: newValue
        };

        console.log(updatedUserAddress);
        
        
        onSetUser(prev => {
            let index = prev.userAddresses.findIndex(p => p.guidId === userAddress.guidId);
            const updatedUserAddresses = [...prev.userAddresses];
            updatedUserAddresses[index] = updatedUserAddress;

            return {
                ...prev,
                userAddresses: updatedUserAddresses
            };
        });
    }
    
    return (
        <Row>
            <div className="row-actions" >
                <button type="button" onClick={() => onAddRow(indexRow)} >+</button>
                <button type="button" onClick={() => onRemoveRow(indexRow)} >-</button>
            </div>
            
            <Dropdown 
                field="city" 
                data={cities} 
                currentSelectedValue={cities.find(c => c.title === userAddress.city)?.value} 
                onGetDataChange={e => handleGetDataChange(e, 'city')}
            />

            <Dropdown 
                field="district" 
                data={districts} 
                currentSelectedValue={districts.find(c => c.title === userAddress.district)?.value} 
                onGetDataChange={e => handleGetDataChange(e, 'district')}
            />

            <Dropdown 
                field="ward" 
                data={wards} 
                currentSelectedValue={wards.find(c => c.title === userAddress.ward)?.value} 
                onGetDataChange={e => handleGetDataChange(e, 'ward')}
            />

            <Input id='streetAddress' value={userAddress.streetAddress || ''} placeholder="Street..." type="text" 
                onGetDataChange={(e) => handleGetDataChange(e, 'streetAddress')} 
            />            
            <Input id='postalCode' value={userAddress.postalCode || ''} placeholder="Postal Code City..." type="text" 
                onGetDataChange={(e) => handleGetDataChange(e, 'postalCode')} 
            />            
            <Input id='country' value={userAddress.country || ''} placeholder="Country..." type="text" 
                onGetDataChange={(e) => handleGetDataChange(e, 'country')} 
            />
        </Row>
    )
}

const Row = styled.div`
    display: grid;
    grid-template-columns: 2% 16% 16% 16% 16% 16% 16%;
    grid-column-gap: .2vw;
    align-items: center;

    border: 1px solid black;
    padding: 0.5vh 0;
    margin-bottom: .1vh;
    border-radius: 5px;

    .row-action {
        text-align: center;
        button {
            display: inline-block;
            padding: 0px 1px;
            min-width: 12px;
            cursor: pointer;

            &:last-child {
                margin-left: 2px;
            }
        }
    }
`