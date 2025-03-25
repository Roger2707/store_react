import { ReactNode } from "react";
import styled from "styled-components"
import { RiEditBoxFill } from "react-icons/ri";
import { MdDelete } from "react-icons/md";

interface Column<T> {
    key: string,
    title: string;
    render?: (value: T[keyof T], row: T) => React.ReactNode;
}

interface Props<T> {
    data: T[] | undefined;
    columns: Column<T>[];
    onSetCurrentId: (id: any) => void;
    onSetOpenForm: (value: boolean) => void;
    onDeleteItem: (id: any) => void;
    onSetIsCreateMode?: (value: boolean) => void;
}

export default function DataTable<T>({data, columns, onSetCurrentId, onSetOpenForm, onDeleteItem, onSetIsCreateMode} : Props<T>) {   
    
    const handleUpdate = (row: T) => {
        // Set Current Id is Id of Selected Row
        onSetCurrentId(row['id' as keyof T]);

        // Set Open Form
        onSetOpenForm(true);

        // SetIsCreateMode
        if(onSetIsCreateMode){
            onSetIsCreateMode(false);
        }
    }

    const handleDelete = (row: T) => {
        onDeleteItem(+row['id' as keyof T]);
    }
    
    return (
        <Style>
            <table>
                <thead>
                    <tr>
                        {columns.map((h, index) => <th key={index} >{h.title}</th>)}
                        <th></th>
                    </tr>
                </thead>

                <tbody>
                    {
                        data?.map((row, rowIndex) => {
                            return (
                                <tr key={rowIndex} >
                                    {
                                        columns.map((h, index) => {

                                            return (
                                                <td key={index} >
                                                   {
                                                        h.render ? 
                                                            h.render(row[h.key as keyof T], row) 
                                                            : 
                                                            row[h.key as keyof T] as ReactNode
                                                   }
                                                </td>
                                            )
                                        })
                                    }

                                    <td>
                                        <div className="btn-container" >
                                            <button onClick={() => handleUpdate(row)} ><span><RiEditBoxFill/></span></button>
                                            <button onClick={() => handleDelete(row)} ><span><MdDelete/></span></button>
                                        </div>
                                    </td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>
        </Style>
    )
}

const Style = styled.div`
    margin-top: 25px;

    table {
        font-size: 1rem;
        border: 1px solid #333;
        text-align: center;
        border-collapse: collapse;

        thead {
            tr {
                th {
                    font-size: 1.2rem;
                    font-weight: 700;
                    text-transform: capitalize;
                    padding: 1vh 1vw;
            
                    border-right: 1px solid #333;

                    &:last-child {
                        border-right: none;
                    }
                }
            }
        }

        tbody {
            width: 100%;

            tr{
                td {
                    padding: 1vh 1vw;

                    border-right: 1px solid #333;
                    border-top: 1px solid #333;

                    &:last-child {
                        border-right: none;

                        .btn-container {
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                            
                            button {
                                padding: 3px;
                                font-size: 1rem;
                                cursor: pointer;
                                border: none;
                                outline: none;
                                background-color: #7F00FF;
                                color: #fff;
                                border-radius: 2px;

                                display: flex;
                                justify-content: center;
                                &:first-child {
                                    margin-right: 10px;
                                    background-color: #E97451;
                                }
                                span {
                                    display: inline-block;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
`