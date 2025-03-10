import styled from "styled-components"
import { Slide } from "../../../app/models/slider"
import { useState } from "react";

interface Props {
    data: Slide[];
}

export const Slider = ({data} : Props) => {
    const [index, setindex] = useState(data[0].id);
    const [transform, setTransform] = useState(0);

    const handleNext = () => {  
        setindex(prevIndex => {
            if(prevIndex < data.length) {                
                return prevIndex + 1;
            }
            return 1;
        });
        
        handleStyling('next');
    }

    const handlePrev = () => {        
        setindex(prevIndex => {
            return prevIndex > 1 ? prevIndex - 1 : data.length;
        });
        
        handleStyling('prev');
    }

    function handleStyling(button: string) {    
        if(button === 'next') {
            setTransform(prev => {                          
                return index === data.length ? 0 : -100 * (index);
            });       
        }
        else if(button === 'prev') {        
            setTransform(prev => {               
                return index === 1 ? -100 * (data.length - 1) : (index - 2) * -100;
            });
        }
    }

    return (
        <SliderStyle>
            <div className="slide-buttons" >
                <button onClick={handlePrev} >&#10094;</button>
                <button onClick={handleNext} >&#10095;</button>
            </div>
            <div className="slide-container"  >
                {
                    data.map(slide => {
                        const {id, photo} = slide;
                        return <div key={id} className={`slide-item ${index === id ? 'active' : ''}`}
                        style={{backgroundImage: `url(${require(`../../assets/images/${photo}`)})`
                            , transform: `${`translateX(${transform}vw)`}`
                    }} ></div>
                    })
                }
            </div>
        </SliderStyle>
    )
}

const SliderStyle = styled.div `
    width: 100vw;
    height: 70vh;
    overflow: hidden;

    .slide-container {
        width: 300vw;
        height: 100%;
        display: flex;
        background-color: rgba(0,0,0,0.6);
        
        .slide-item {
            width: 100%;
            height: 100%;

            background-position: center;
            background-repeat: no-repeat;
            background-size: cover;

            opacity: 0;
        }

        .active {
            opacity: 1;
            animation: showOpacity 1s linear;
            transition: all 0.5s linear;
        }
    }

    @keyframes showOpacity {
        0% {opacity: 0}
        50% {opacity: 0.5}
        100% {opacity: 1}
    }

    .slide-buttons {
        position: absolute;
        top: 40%;
        left: 0;

        width: 100%;

        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 1%;

        z-index: 5;

        button {
            padding: 5px 10px;
            border-radius: 50%;

            &:hover {
                cursor: pointer;
                transform: scale(1.05);
            }
        }
    }

`