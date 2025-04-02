import { useEffect, useState } from "react";
import styled from "styled-components"
import { StockTransactionDTO } from "../../../app/models/Stock";
import agent from "../../../app/api/agent";

interface Props {
    productDetailId: string;
}

export const ShowTransactions = ({productDetailId} : Props) => {
    const [transactions, setTransactions] = useState<StockTransactionDTO[] | null>(null);

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

    return (
        <Style>
            <div className="search-container" >
                    
            </div>
            <Table>
                <thead>
                    <tr>
                        <th>Color</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Warehouse</th>
                        <th>Type</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        transactions?.map(t => {
                            return (
                                <tr key={t.id}>
                                    <td>{t.color}</td>
                                    <td>{t.price.toLocaleString('vi-VN')}</td>
                                    <td>{t.quantity}</td>
                                    <td>{t.warehouseName}</td>
                                    <td>{t.transactionType}</td>
                                    <td>{t.created.toString().split('T')[0]}</td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </Table>
        </Style>
    )
}

const Style = styled.div`
    .search-container {
        margin-bottom: 3vh;
    }

`

const Table = styled.table`
    font-size: 1rem;
    border: 1px solid #333;
    text-align: center;
    border-collapse: collapse;
    height: fit-content;
    width: 100%;

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