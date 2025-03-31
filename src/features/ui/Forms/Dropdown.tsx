import styled from "styled-components";

export interface DropdownData {
    title: string;
    value: any;
}

interface Props {
    field?: string;
    data: DropdownData[];
    backgroundColor?: string
    loading?: boolean;
    width?: string;
    marginTop?: string;

    currentSelectedValue: any;
    onGetDataChange: (e: any) => void;
}

export const Dropdown = ({field, data, currentSelectedValue, onGetDataChange, backgroundColor, loading, width, marginTop}: Props) => {

    const style = {
        backgroundColor: `${backgroundColor ? backgroundColor : '#708090'}`,
        width: `${width ? width : '100%'}`,
        marginTop: `${marginTop ? marginTop : '0'}`
    }
    return (
        <>
            {
                data.length > 0 &&
                (
                    <Select value={currentSelectedValue === '' ? data[0].value : currentSelectedValue} onChange={onGetDataChange} 
                            style={style}
                    >
                        {
                            loading ? <option>...</option>
                            :
                            data?.map((d, i) => {
                                return (
                                    <option key={i} value={d.value} style={{backgroundColor: `${backgroundColor ? backgroundColor : '#425e75'}`}} >{d.title}</option>
                                )
                            })
                        }
                    </Select>
                )
            }
        </>
    )
}

const Select = styled.select `
    padding: 5px;
    border-radius: 2px;
    width: 100%;
    color: #fff;
    font-size: 1rem;
    border: none;
    outline: none;
    height: fit-content;

    option {
        text-transform: capitalize;
    }
`