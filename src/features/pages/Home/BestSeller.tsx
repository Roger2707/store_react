import styled from "styled-components";

//const tempImng = require('../../assets/images/yonex.jpg');

// const productTemp : Product = {
//     id: 1,
//     name: 'Temp Product',
//     price: 100,
//     description: '',
//     imageUrl: '',
//     quantityInStock: 0,
//     productStatus: '',
//     created: new Date(),
//     categoryId: 1,
//     categoryName: '',
//     brandId: 1,
//     brandName: '',
//     brandCountry: 'Viet Nam',
// };

export const BestSeller = () => {
    return (
        <BestSellerStyle>
            
        </BestSellerStyle>
    )
}

const BestSellerStyle = styled.div`
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 50px;

    padding: 50px;
`