import styled from "styled-components"
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

interface Props {
    stars: number;
}

export const ProductRatings = ({stars}: Props) => {
    const renderStars = (rating: number) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
          if (i <= Math.floor(rating)) {
            stars.push(<FaStar key={i} className="star filled" />);
          } else if (i - rating <= 0.5) {
            stars.push(<FaStarHalfAlt key={i} className="star filled" />);
          } else {
            stars.push(<FaRegStar key={i} className="star" />);
          }
        }
        return stars;
      };

    return (
        <Style>
            <div className="rating-container">{renderStars(stars)}</div>
        </Style>
    )
}

const Style = styled.div`
    display: flex;
    justify-content: right;
    .rating-container {
        display: inline-block;
        margin: 4px 0;
    }

    .rating-container .star {
        font-size: 24px;
        color: #d1d5db; 
        margin-right: 4px;
    }

    .rating-container .star.filled {
        color: #facc15; 
    }

    .rating-container .star:last-child {
        margin-right: 0;
    }
`