import { useEffect, useState } from "react";
import styled from "styled-components"
import { StockTransactionDTO } from "../../../../app/models/Stock";
import agent from "../../../../app/api/agent";

interface Props {
    productDetailId: string;
}

export const ShowTransactions = ({productDetailId} : Props) => {
    const [transactions, setTransactions] = useState<StockTransactionDTO[] | null>(null);
    const [filters, setFilters] = useState<StockTransactionDTO[] | null>(null);
    const [selectedOption, setSelectedOption] = useState<string>('all');


    useEffect(() => {
        const getTransactions = async () => {
            try {
                let data : StockTransactionDTO[] = await agent.Stocks.getStockTransactionsOfProduct(productDetailId);
                if(data) setTransactions(data);
                
            } catch (error) {
                console.log(error);
            } finally {
            }
        }

        getTransactions();
    }, [productDetailId])

    const handleRadioChange = (value: string) => {
        setSelectedOption(value);
    }

    useEffect(() => {
        if(transactions && transactions?.length > 0) {
            switch(selectedOption)
            {
                case 'import':
                    setFilters(prev => transactions.filter(t => t.transactionType.toLowerCase() === 'import'));
                    break;
                case 'export':
                    setFilters(prev => transactions.filter(t => t.transactionType.toLowerCase() === 'export'));
                    break;
                default:
                    setFilters(prev => [...transactions]);
            }
        }
    }, [transactions, selectedOption])

    return (
        <Style>
            <div className="search-container" >
                <label>
                    <input
                        type="radio"
                        name="transactionType"
                        value="import"
                        checked={selectedOption === "import"}
                        onChange={() => handleRadioChange("import")}
                    />
                    <span>Import</span>
                </label>

                <label>
                    <input
                        type="radio"
                        name="transactionType"
                        value="export"
                        checked={selectedOption === "export"}
                        onChange={() => handleRadioChange("export")}
                    />
                    <span>Export</span>
                </label>

                <label>
                    <input
                        type="radio"
                        name="transactionType"
                        value="all"
                        checked={selectedOption === "all"}
                        onChange={() => handleRadioChange("all")}
                    />
                    <span>All</span>
                </label>
            </div>

            <div style={{overflowY: 'scroll', width: '100%', height: '30vh', marginBottom: '5vh'}} >
                <Table>
                    <thead>
                        <tr>
                            <th>Color</th>
                            <th>Price</th>
                            <th>Warehouse</th>
                            <th>Type</th>
                            <th>Quantity</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            filters?.map(t => {
                                return (
                                    <tr key={t.id}>
                                        <td>{t.color}</td>
                                        <td>{t.price.toLocaleString('vi-VN')}</td>
                                        <td>{t.warehouseName}</td>
                                        <td>{t.transactionType}</td>
                                        <td>{t.quantity}</td>
                                        <td>{t.created.toString().split('T')[0]}</td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </Table>
            </div>
        </Style>
    )
}

const Style = styled.div`
    .search-container {
        margin-bottom: 2vh;
        padding: .5vh 1vw .5vh 0;

        label {
            font-size: 1rem;

            input {
                cursor: pointer;
            }

            span {
                display: inline-block;
                font-style: italic;
                margin-right: 1vw;
                color: darkblue;
            }
        }
    }

`
const Table = styled.table`
    font-size: 1rem;
    border: 1px solid #333;
    text-align: center;
    border-collapse: collapse;
    width: 100%;
    overflow-y: scroll;

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
                padding: 1.5vh 1vw;
                border-right: 1px solid #333;
                border-top: 1px solid #333;

                img {
                    width: 5vw;
                    height: 80%;
                }

                ul {
                    list-style: none;
                }
            }
        }
    }

`