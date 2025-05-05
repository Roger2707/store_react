import React from 'react';
import styled from 'styled-components';

const warehouse_1 = require('../../assets/images/warehouse-1.png');
const warehouse_2 = require('../../assets/images/warehouse-2.png');
const warehouse_3 = require('../../assets/images/warehouse-3.png');

const branches = [
  {
    id: 1,
    name: 'Ho Chi Minh Branch',
    address: '275 Dien Bien Phu, Ward 7, District 3, Ho Chi Minh City, Viet Nam',
    phone: '0123 456 789',
    image: warehouse_1,
    reverse: false,
  },
  {
    id: 2,
    name: 'Thu Duc City Branch',
    address: '456 Mai Chi Tho, Ward An Phu, Thu Duc City, Ho Chi Minh City, Viet Name',
    phone: '0987 654 321',
    image: warehouse_2,
    reverse: true,
  },
  {
    id: 3,
    name: 'Vung Tau City Branch',
    address: '789 Hoang Hoa Tham, Vung Tau City',
    phone: '0765 432 198',
    image: warehouse_3,
    reverse: false,
  },
];

export const Branch: React.FC = () => {
  return (
    <Style>
      <h1>Our Branches 🏬</h1>
      {branches.map((branch) => (
        <BranchRow key={branch.id} $reverse={branch.reverse}>
          <BranchImage>
            <img src={branch.image} alt={branch.name} />
          </BranchImage>
          <BranchInfo>
            <h3>{branch.name}</h3>
            <p><strong>Address:</strong> {branch.address}</p>
            <p><strong>Phone:</strong> {branch.phone}</p>
          </BranchInfo>
        </BranchRow>
      ))}
    </Style>
  );
};

const Style = styled.section`
    margin-top: 5vh;

    h1 {
        text-align: center;
        font-size: 2.5rem;
        letter-spacing: 3px;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        text-decoration: underline;
        margin-bottom: 3vh;
    }
`;

const BranchRow = styled.div<{ $reverse: boolean }>`
    display: grid;
    grid-template-columns: ${({ $reverse }) => ($reverse ? '70% 30%' : '30% 70%')};
    gap: 20px;
    margin-bottom: 40px;
    align-items: center;

    ${props => props.$reverse && `
        & > div:first-child {
        order: 2;
        }
    `}
`;

const BranchImage = styled.div`
    img {
        width: 100%;
        height: auto;
        border-radius: 6px;
    }
`;

const BranchInfo = styled.div`
    color: gray;
    background-color: #fff;
    height: 100%;
    padding: 1vh;

    h3 {
        margin-bottom: 10px;
        font-size: 2rem;
        font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
        letter-spacing: 3px;
    }

    p {
        font-size: 1.5rem;
        letter-spacing: 2px;
        color: #b6b4b4;
    }
`;
