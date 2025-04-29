import { ReactNode } from "react";

export const columns = [
    { key: 'productId', title: 'ProductId'}, 
    { key: 'productName', title: 'Name'},  
    { 
        key: 'imageUrl',
        title: 'Photo', 
        render: (link: any) => {
            if (!link) return <p>No Image</p>;
            let src = link.toString().split(',')[0];
            return <img width={50} height={50} src={String(src)} alt="img" /> as ReactNode;
        }
    }, 
    { 
        key: 'created',
        title: 'Created',
        render: (value: any) => {
            const dateValue = new Date(value);
            return isNaN(dateValue.getTime()) ? <p>Invalid Date</p> : <p>{dateValue.toLocaleDateString('vi-VN')}</p> as ReactNode
        }
    }, 
    { key: 'categoryName', title: 'Category'},
    { key: 'brandName', title: 'Brand'},
    { key: 'brandCountry', title: 'Origin'},
    { key: 'stars', title: 'Stars'},
];