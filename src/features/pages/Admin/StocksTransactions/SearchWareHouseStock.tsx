import { useState } from "react";
import styled from "styled-components"
import { Warehouse } from "../../../../app/models/Warehouse";
import agent from "../../../../app/api/agent";

interface Props {
    onReceiveProps: (data: Warehouse) => void;
}

export const SearchWareHouseStock = ({onReceiveProps}: Props) => {
    const [isSearch, setIsSearch] = useState<boolean>(false);
    const [warehouseSearchData, setwarehouseSearchData] = useState<Warehouse[]>([]);

    const handleSearch = async (e: any) => {
        e.preventDefault();

        try {
            setIsSearch(true);
            const data : Warehouse[] = await agent.Warehouses.list();
            setwarehouseSearchData(data);
        }
        catch(error: any) {
            console.log(error);
        }
        finally {
            setIsSearch(false);
        }
    }

    const handleClearScreen = () => {        
        setwarehouseSearchData([]);
    }

    const handlePropProductToParent = (warehouse: Warehouse) => {
        onReceiveProps(warehouse);
    }
    
    return (
        <Styled onSubmit={handleSearch} disabled={isSearch} >
            <div className="search-data" >
                {
                    warehouseSearchData.map((w: Warehouse) => {
                        return (
                            <div className="search-row" key={w.id} onDoubleClick={handlePropProductToParent.bind(null, w)} >
                                <span>{w.name}</span>
                                <span>{w.location}</span>
                            </div>
                        )
                    })
                }
            </div>

            <div className="search-actions" >
                <button type="submit" >Search</button>
                <button type="button" onClick={handleClearScreen} >Clear</button>
            </div>
        </Styled>
    )
}

const Styled = styled.form<{ disabled: boolean }>`   
    height: fit-content;
    min-width: 55vw;

    opacity: ${(props) => (props.disabled ? 0.6 : 1)};
    pointer-events: ${(props) => (props.disabled ? "none" : "auto")};

    margin-top: 2vh;

    .search-data {
        margin-top: 2vh;
        margin-bottom: 2vh;
        width: 100%;
        height: 30vh;
        background-color: #ccc;
        overflow: scroll;

        .search-row {
            background-color: white;
            width: 100%;
            padding: 0 .5vw;

            display: grid;
            grid-template-columns: repeat(2, 1fr);
            grid-column-gap: .1vw;
            align-items: center;

            span {
                display: inline-block;
                border-bottom: 1px solid #ccc;
                padding: 0.8vh 0;

                &:last-child {
                    border-right: none;
                }
            }

            &:hover {
                cursor: pointer;
                background-color: #FA5F55;
                color: #ccc;
                transition: all .1s;
            }
        }
    }

    .search-actions {
        display: flex;
        justify-content: right;
        align-items: center;
        button {
            padding: 1vh 1vw;
            font-size: 1rem;
            width: 18%;
            border-radius: 5px;
            border: none;
            outline: none;
            cursor: pointer;
            color: #fff;
            
            &:first-child {
                background-color: orangered;
            }

            &:last-child {
                background-color: #FF4433;
                margin-left: 1vw;
            }
        }
    }
`