import { useEffect, useState } from "react";
import styled from "styled-components"

interface Props {
    imageUrls: string [];
}

export const ProductImage = ({imageUrls} : Props) => {   
    const [currentImage, setCurrentImage] = useState<string>(imageUrls[0]);

    const handleSetMainImage = (image: string) => {
        setCurrentImage(image);
    }

    useEffect(() => {
        setCurrentImage(imageUrls[0]);
    }, [imageUrls]);

    return (
        <Style>
            <div className="main-image" >
                <img src={currentImage} alt="current-image" />
            </div>

            <div className="all-images" >
                {
                    imageUrls.map((image, index) => {
                        return (
                            <img onClick={() => handleSetMainImage(image)} key={index} src={image} alt={`image${index}`} className={`${image === currentImage && 'active'}`} />
                        )
                    })
                }
            </div>
        </Style>
    )
}

const Style = styled.div`
    border: 1px solid black;

    display: grid;
    grid-template-columns: 8fr 2fr;
    height: 60vh;
    grid-column-gap: 5px;
    overflow: hidden;

    .main-image {
        width: 100%;
        height: 100%;

        img {
            width: 100%;
            height : 60vh;
        }
    }

    .all-images {
        overflow: scroll;

        img {
            width: 100%;
            height: 15vh;
            opacity: 0.5;

            &:hover {
                cursor: pointer;
            }
        }
        
        .active {
            opacity: 1;
        }

        &::-webkit-scrollbar {
            display: none;
        }
    }
`