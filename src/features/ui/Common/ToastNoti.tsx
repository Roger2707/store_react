import { useEffect, useState } from "react";
import { AiFillCloseCircle } from "react-icons/ai";
import { FaCircleCheck } from "react-icons/fa6";
import styled from "styled-components";

interface Props {
    type: string;
    message: string;
}

export const ToastNoti = ({type, message}: Props) => {
    const [visible, setVisible] = useState<boolean>(true);
    const [closing, setClosing] = useState<boolean>(false);

    useEffect(() => {
        setTimeout(() => setVisible(false), 2500); // add animation (show / hide)
        setTimeout(() => setClosing(true), 3000); // close component

    }, [visible]);

    if(!visible && closing) return null;

    return (
        <Style>
            <div className={`toast ${type === 'success' ? 'toast-success' : 'toast-error'} ${visible ? 'show' : 'hide'}`} >
                <span className="icon" >{type === 'success' ? <FaCircleCheck /> : <AiFillCloseCircle/>}</span>
                <span className="title" >{message}</span>
            </div>
        </Style>
    )
}

const Style = styled.div`
    position: absolute;
    top: 5vh;
    right: 10vw;
    width: 10vw;
    height: 5vh;
    border-radius: 5px;
    overflow: hidden;
    z-index: 5;

    .toast {
        width: 100%;
        height: 100%;
        color: #fff;

        span {
            display: inline-block;
            letter-spacing: 1px;
            word-spacing: 1px;
            font-size: 1rem;

            margin-right: 3px;
        }
    }

    .toast.toast-success {
        background-color: #2acf2a;
    }

    .toast.toast-error {
        background-color: #e43434;
    }

    .toast.show {
        animation: show 0.5s linear;
    }

    .toast.hide {
        animation: hide 0.5s linear;
    }

    @keyframes show {
        0% {opacity: 0}
        100% {opacity: 1}
    }

    @keyframes hide {
        0% {opacity: 1}
        100% {opacity: 0}
    }
`