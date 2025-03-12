import { ReactNode } from "react";

export const columns = [
    { key: 'id', title: 'Id'}, 
    { key: 'name', title: 'Name'}, 
    { key: 'price', title: 'Price'}, 
    { key: 'discountPrice', title: 'Discount Price'}, 
    { 
        key: 'imageUrl',
        title: 'Photo', 
        render: (link: string | number | Date) => {
            let src = link.toString().split(',')[0];
            return <img width={50} height={50} src={String(src)} alt="img" /> as ReactNode;
        }
    }, 
    { key: 'quantityInStock', title: 'Quantity'}, 
    { key: 'productStatus', title: 'Status'}, 
    { 
        key: 'created',
        title: 'Created',
        render: (value: string | number | Date) => {
            const dateValue = new Date(value);
            return <p>{dateValue.toLocaleDateString('vi-VN')}</p> as ReactNode
        }
    }, 
    { key: 'categoryName', title: 'Category'},
    { key: 'brandName', title: 'Brand'},
    { key: 'brandCountry', title: 'Origin'},
];