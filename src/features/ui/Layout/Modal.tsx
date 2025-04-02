import { ReactNode } from "react";
import styled from "styled-components"
import { FaWindowClose } from "react-icons/fa";

interface Props {
    title: string;
    onSetOpen: (value: boolean) => void;
    children: ReactNode;
    width?: string;
}

export const Modal = ({title, onSetOpen, children, width} : Props) => {

    const handleCloseModal = () => {
        onSetOpen(false);
    }

    return (
        <Style>
            <div className="modal_container" style={{width: `${width ? width : '60%'}`}} >
                <div className="modal_header" >
                    <p>{title}</p>
                    <button onClick={handleCloseModal} ><span><FaWindowClose/></span></button>
                </div>
                <div className="modal_content" >
                    {children}
                </div>
                <div className="modal_footer" >

                </div>
            </div>
        </Style>
    )
}

const Style = styled.div`
    width: 100vw;
    height: 100vh;
    
    position: fixed;
    top: 0;
    left: 0;
    background-color: rgba(0,0,0, 0.5);
    z-index: 10;

    .modal_container {
        background-color: #E5E4E2;
        padding: 3vh 3vw;

        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);

        border-radius: 10px;
        overflow: hidden;
        min-height: 50%;

        .modal_header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-bottom: 1px;
            border-bottom: 2px solid #6082B6;

            p {
                font-size: 1.8rem;
                font-weight: 700;
                font-style: italic;
                text-transform: capitalize;
                color: #6082B6;
                padding-bottom: 1px;
            }

            button {
                background-color: transparent;
                border: none;
                cursor: pointer;
                outline: none;

                span {
                    display: inline-block;
                    font-size: 1.5rem;
                    color: #D22B2B;
                }
            }
        }
        
        .modal_content {
            margin-top: 3vh;
        }

        .modal_footer {

        }
    }

`