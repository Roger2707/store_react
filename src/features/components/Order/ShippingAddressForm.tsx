import { useEffect, useState } from "react";
import styled from "styled-components"
import agent from "../../../app/api/agent";
import { Dropdown, DropdownData } from "../../ui/Forms/Dropdown";
import { ShippingAdressDTO } from "../../../app/models/User";
import { Input } from "../../ui/Forms/Input";
import { OrderProcessing } from "./OrderProcessing";
import { useAppSelector } from "../../../app/store/configureStore";

export const ShippingAddressForm = () => {
    const [userAddress, setUserAddress] = useState<ShippingAdressDTO>({
        city: '',
        district: '',
        ward: '',
        streetAddress: '',
        postalCode: '',
        country: '',
        isSaveAddress: false,
    });
    const [cities, setCities] = useState<DropdownData[]>([]);
    const [districts, setDistricts] = useState<DropdownData[]>([]);
    const [wards, setWards] = useState<DropdownData[]>([]);
    const { activePaymentUI } = useAppSelector(state => state.order);

    useEffect(() => {
        async function fetchCities() {
            try {
                const response = await agent.Location.getCities();
                if (response) {
                    setCities(prevState => {
                        return response.map((d: any) => {
                            return { title: d.name, value: d.code };
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
                if (response) {
                    setDistricts(prevState => {
                        return response.map((d: any) => {
                            return { title: d.name, value: d.code };
                        })
                    });
                }
            }
            catch (error) {
                console.error(error);
            }
        }

        const cityCode = cities.find(c => c.title === userAddress?.city)?.value;

        cityCode && fetchDistricts(+cityCode);

    }, [cities, userAddress?.city]);

    useEffect(() => {
        async function fetchWards(districtCode: number) {
            try {
                const response = await agent.Location.getWards(districtCode);
                if (response) {
                    setWards(prevState => {
                        return response.map((d: any) => {
                            return { title: d.name, value: d.code };
                        })
                    });
                }
            }
            catch (error) {
                console.error(error);
            }
        }

        const districtCode = districts.find(c => c.title === userAddress?.district)?.value;
        districtCode && fetchWards(+districtCode);

    }, [districts, userAddress?.district]);

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
            case 'isSaveAddress':
                newValue = e.target.value === 'on' ? true : false;
                break;
            default:
                newValue = e.target.value;
        }

        setUserAddress(prev => {
            return {
                ...prev,
                [key]: newValue
            }
        })
    }

    return (
        <ShippingStyle disabled={activePaymentUI}>
            <div className="fields" >
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
            </div>
            <div className="btn-container" >
                <div style={{ display: 'flex', alignItems: 'center' }} >
                    <input id='isSaveAddress' type="checkbox" width="1vw" checked={userAddress.isSaveAddress} onChange={e => handleGetDataChange(e, 'isSaveAddress')} />
                    <span style={{ display: 'inline-block', fontSize: '0.8rem', marginLeft: '2px', fontStyle: 'italic' }} >Save Address ?</span>
                </div>
                <OrderProcessing shippingAddress={userAddress} />
            </div>
        </ShippingStyle>
    )
}

const ShippingStyle = styled.div<{ disabled: boolean }> `
    opacity: ${(props) => (props.disabled ? 0.6 : 1)};
    pointer-events: ${(props) => (props.disabled ? "none" : "auto")}; 

    .fields {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        grid-column-gap: 1vw;
        grid-row-gap: 1vh;
    }

    .btn-container {
        width: 100%;
        margin-top: 2vh;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
`