import styled from "styled-components"
import { Dropdown, DropdownData } from "../../ui/Forms/Dropdown";
import { useCallback, useEffect, useState } from "react";
import { Input } from "../../ui/Forms/Input";
import { UserAddressDTO } from "../../../app/models/User";
import { FaMinus } from "react-icons/fa";
import agent from "../../../app/api/agent";
import { useAppDispatch } from "../../../app/store/configureStore";
import { setUserAddresses } from "../../../app/store/userAddressSlice";

interface Props {
    userAddressProps: UserAddressDTO;
    onRemoveRow : (id: number) => void;
}

export const AddressInfo = ({onRemoveRow, userAddressProps} : Props) => {
    const [cities, setCities] = useState<DropdownData[]>([]);
    const [districts, setDistricts] = useState<DropdownData[]>([]);
    const [wards, setWards] = useState<DropdownData[]>([]);

    const [selectedCity, setSelectedCity] = useState<DropdownData | null>(null);
    const [selectedDistrict, setSelectedDistrict] = useState<DropdownData | null>(null);
    const [selectedWard, setSelectedWard] = useState<DropdownData | null>(null);

    const [userAddress, setUserAddress] = useState<UserAddressDTO>({
        city: '',
        district: '',
        ward: '',
        postalCode: '',
        country: '',
        streetAddress: '',
        id: 0
    });

    const dispatch = useAppDispatch();

    //#region  Initial Component

    useEffect(() => {
        initial();
        // eslint-disable-next-line
    }, []);
    
    const initial = useCallback(async () => {
        fetchCities();  
        setUserAddress(prev => {
            return {
                id: userAddressProps.id,
                city: userAddressProps.city,
                district: userAddressProps.district,
                ward: userAddressProps.ward,
                streetAddress: userAddressProps.streetAddress,
                postalCode: userAddressProps.postalCode,
                country: userAddressProps.country,
            }
        });
    }, [userAddressProps]);

    //#endregion
    
    //#region Retrieve UserAddress Existed
    
    useEffect(() => {
        if(userAddressProps.id > 0) {
            const userCity = cities?.find(c => c.title === userAddressProps.city);   
            setSelectedCity(prev => {
                return {title: userCity?.title || '', value: userCity?.value || ''};
            });
        }
    }, [cities, userAddressProps]);

    useEffect(() => {
        if(userAddressProps.id > 0) {
            const userDistrict = districts?.find(c => c.title === userAddressProps.district);   
            setSelectedDistrict(prev => {
                return {title: userDistrict?.title || '', value: userDistrict?.value || ''};
            });
        }
    }, [districts, userAddressProps]);

    useEffect(() => {
        if(userAddressProps.id > 0) {
            const userWard = wards?.find(c => c.title === userAddressProps.ward);   
            setSelectedWard(prev => {
                return {title: userWard?.title || '', value: userWard?.value || ''};
            });
        }
    }, [wards, userAddressProps]);

    //#endregion

    //#region Fetch Effects

    useEffect(() => {
        if(selectedCity) {
            const cityCode = +selectedCity.value;
            if(cityCode === 0) return;    
            fetchDistricts(cityCode);
        }
    }, [selectedCity]);

    useEffect(() => {
        if(selectedDistrict) {
            const districtCode = +selectedDistrict.value;
            if(districtCode === 0) return;
            fetchWards(districtCode);
        }       
    }, [selectedDistrict]);

    //#endregion

    //#region Fetch Functions

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

    //#endregion

    //#region Changed Events
    
    const handleCityChange = (e: any) => {
        
        let title = e.target.options[e.target.selectedIndex].text;
        const cityCode = +e.target.value;

        if(cityCode === 0) return;

        setSelectedDistrict(null);
        setSelectedWard(null);

        setSelectedCity(prev => {
            return {title: title, value: e.target.value};
        });

        setUserAddress(prev => {
            return {
                ...prev, city: title, district: '', ward: ''
            }
        });
    }

    const handleDistrictChange = (e: any) => {
        let title = e.target.options[e.target.selectedIndex].text;
        const districtCode = +e.target.value;

        if(districtCode === 0) return;

        setSelectedWard(null);

        setSelectedDistrict(prev => {
            return {title: title, value: e.target.value};
        });

        setUserAddress(prev => {
            return {
                ...prev, district: title, ward: ''
            }
        });
    }

    const handleWardChange = (e: any) => {
        let title = e.target.options[e.target.selectedIndex].text;
        const wardCode = +e.target.value;

        if(wardCode === 0) return;

        setSelectedWard(prev => {
            return {title: title, value: e.target.value};
        });

        setUserAddress(prev => {
            return {
                ...prev, ward: title
            }
        });
    }

    const handleOnGetDataChange = (e: any, key: string) => {    
        if(key === 'city')  handleCityChange(e);
        else if(key === 'district') handleDistrictChange(e);       
        else if(key === 'wards') handleWardChange(e);
        else {
            setUserAddress(prev => {
                return {
                    ...prev,
                    [key] : e.target.value
                }
            })
        }
    }

    //#endregion

    //#region Submit Form

    const handleBeforeSubmit = () => {
        //console.log(userAddress);
    }

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        handleBeforeSubmit();  

        try {
            await agent.Account.upsertUserAddress(userAddress);
            dispatch(setUserAddresses(null));
        } catch (error) {
            console.error(error);
        }
    }

    //#endregion

    return (
        <Style>
            <button onClick={() => onRemoveRow(userAddress.id)} >
                <FaMinus />
            </button>

            <form onSubmit={handleSubmit} >
                <div className="form_item" >
                    <label>City:</label>
                    <Dropdown field="" data={cities} currentSelectedValue={selectedCity ? selectedCity.value : 0} onGetDataChange={e => handleOnGetDataChange(e, 'city')}/>
                </div>

                <div className="form_item" >
                    <label>District:</label>
                    <Dropdown field="" data={districts} currentSelectedValue={selectedDistrict ? selectedDistrict.value : 0} onGetDataChange={e => handleOnGetDataChange(e, 'district')} />
                </div>

                <div className="form_item" >
                    <label>Ward:</label>
                    <Dropdown field="" data={wards} currentSelectedValue={selectedWard ? selectedWard.value : 0} onGetDataChange={e => handleOnGetDataChange(e, 'wards')} />
                </div>

                <div className="form_item" >
                    <label>Street Address:</label>
                    <Input type="text" id="street" placeholder="Street Address" value={userAddress.streetAddress} onGetDataChange={e => handleOnGetDataChange(e, 'streetAddress')} />
                </div>

                <div className="form_item" >
                    <label>Postal Code:</label>
                    <Input type="text" id="postalCode" placeholder="Postal Code" value={userAddress.postalCode} onGetDataChange={e => handleOnGetDataChange(e, 'postalCode')} />
                </div>

                <div className="form_item" >
                    <label>Country:</label>
                    <Input type="text" id="country" placeholder="Country" value={userAddress.country} onGetDataChange={e => handleOnGetDataChange(e, 'country')} />
                </div>

                <button type="submit" disabled={false} >
                    {userAddressProps.id !== 0 ? 'Edit' : 'Create'}
                </button>
            </form>
        </Style>
    )
}

const Style = styled.div`
    display: grid;
    grid-template-columns: 0.3fr 9.7fr;
    align-items: center;
    padding: 2vh 2vw;
    background-color: #B6D0E2;
    margin: 0 5vw;
    margin-top: 2vh;
    border-radius: 20px;
    border: 3px dashed #333;

    button {
        width: fit-content;
        height: fit-content;
        border-radius: 5px;
        padding: 8px 5px;
        border: none;
        outline: none;
        background-color: #333;
        color: #fff;
        opacity: 0.8;

        display: flex;
        justify-content: center;
        align-items: center;

        &:hover {
            opacity: 1;
            cursor: pointer;
        }
    }

    form {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        column-gap: 2vw;
        row-gap: 1vh;
        margin-top: 2vh;
        
        .form_item {
            label {
                display: inline-block;

                color: #4682B4;
                font-size: 1.2rem;
                font-style: italic;
                font-weight: 500;
            }
        }

        button {
            width: 20%;
            padding: 5px 15px;
            font-size: 1.2rem;
            border-radius: 5px;
            border: none;
            outline: none;

            margin-top: 2vh;

            background: darkred;
            color: #fff;
            opacity: 0.5;

            &:focus {
                opacity: 1;
            }

            &:hover:enabled {
                opacity: 1;
                cursor: pointer;
            }
        }
    }
`