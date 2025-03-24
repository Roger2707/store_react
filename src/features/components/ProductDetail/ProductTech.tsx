import { useEffect, useState } from "react";
import styled from "styled-components"
import { ProductTechnology } from "../../../app/models/Product";
import agent from "../../../app/api/agent";

interface Props {
    productId : string;
}

export const ProductTech = ({productId}: Props) => {
    const [technologies, setTechnologies] = useState<ProductTechnology[] | null>(null);
    const [techHover, setTechHover] = useState<number | null>(null);

    const fetchTechnologies = async () => {
        try {
            const response = await agent.Product.technologies(productId);
            setTechnologies(response);
        } catch (error: any) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchTechnologies();
        // eslint-disable-next-line
    }, [productId]);

    const handleMouseEnter = (index: number) => {
        setTechHover(index);
    }

    const handleMouseLeave = () => {
        setTechHover(null);
    }

    return (
        <Style>
            <h1>Technologies:</h1>
            <div className="tech-container" >
                {
                    technologies?.map((item, index) => {
                        const {name, imageUrl} = item;
                        return (
                            <div key={index} className="tech-item" onMouseEnter={() => handleMouseEnter(index)} onMouseLeave={handleMouseLeave}  >
                                <p className={`${index === techHover && 'active'}`} >{name}</p>
                                <img src={imageUrl} alt={`technology-${index}`} />
                            </div>
                        )
                    })
                }
            </div>
        </Style>
    )
}

const Style = styled.div`
    margin-top: 5vh;

    h1 {
        text-align: center;
        color: #F88379;
        font-style: italic;
        text-decoration: underline;
        font-size: 2.2rem;
        letter-spacing: 0.5vw;
    }

    .tech-container {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        grid-column-gap: 2vw;
        grid-row-gap: 3vh;
        margin-top: 5vh;

        .tech-item {
            position: relative;

            p {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                color: #E35335;
                font-size: 2.8rem;
                text-align: center;
                display: none;
            }

            .active {
                display: block;
            }

            img {
                width: 100%;
                height: 35vh;

                &:hover {
                    opacity: 0.5;
                    cursor: pointer;
                }
            }

        }
    }

`