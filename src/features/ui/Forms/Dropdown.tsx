import styled from "styled-components";

export interface DropdownData {
    title: string;
    value: any;
    expandProps?: string;
}

interface Props {
    id? :string;
    field?: string;
    data: DropdownData[];
    backgroundColor?: string
    loading?: boolean;
    width?: string;
    marginTop?: string;

    currentSelectedValue: number | string;
    onGetDataChange: (e: any) => void;
    disable?: boolean;
}

export const Dropdown = ({id, field, data, currentSelectedValue, onGetDataChange, backgroundColor, loading, width, marginTop, disable}: Props) => {
    const style = {
        backgroundColor: `${backgroundColor ? backgroundColor : '#708090'}`,
        width: `${width ? width : '100%'}`,
        marginTop: `${marginTop ? marginTop : '0'}`
    }

    let defaultValue;

    if(typeof currentSelectedValue === 'number') {
        defaultValue = currentSelectedValue >= 0 ? currentSelectedValue : data[0]?.value || -1;
    } else if(typeof currentSelectedValue === 'string') {
        defaultValue = currentSelectedValue ? currentSelectedValue : data[0]?.value || "";
    }
   
    return (
        <SelectContainer>
            <select value={defaultValue} onChange={onGetDataChange} id={id}
                style={style} disabled={disable ? disable : false}
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
            </select>
            <span></span>
        </SelectContainer>
    )
}

const SelectContainer = styled.div `
    select {
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
    }

    .error-message {
        display: block;
        width: 100%;
        font-size: 0.8rem;
        font-style: italic;
        color: #d82e2e;
        margin-top: 0.5vh;
        letter-spacing: 1px;

        animation: display linear 0.5s;
    }

    @keyframes display {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }
`