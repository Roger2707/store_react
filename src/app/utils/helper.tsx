import { CiSquareMore } from "react-icons/ci";
import { AiFillProduct, AiOutlineHome } from "react-icons/ai";
import { FaCheck, FaHackerNews, FaKey } from "react-icons/fa";
import { RiPhoneFindFill } from "react-icons/ri";
import { MdDashboard, MdSportsTennis, MdManageAccounts, MdCategory, MdBrandingWatermark, MdDiscount, MdDescription, MdOutlineAccountCircle     } from "react-icons/md";
import { TbTruckDelivery } from "react-icons/tb";
import { FaTruckFast, FaX } from "react-icons/fa6";

export const navs = [
    {
        id: 1,
        path: '/about',
        title : 'About',
        icon: <CiSquareMore/>
    },

    {
        id: 2,
        path: '/products',
        title : 'Products',
        icon: <AiFillProduct/>
    },

    {
        id: 3,
        path: '/news',
        title : 'News',
        icon: <FaHackerNews/>
    },

    {
        id: 4,
        path: '/contact',
        title : 'Contact',
        icon: <RiPhoneFindFill/>
    },
]

export const navAuth = [
    {
        id: 1,
        path: '/login',
        title: 'Login',
        desc: 'Have an account ?'
    },
]

export const homeSlider = [
    {
        id: 1,
        photo: 'yonex.jpg'
    },
    {
        id: 2,
        photo: 'lining.jpg'
    },
    {
        id: 3,
        photo: 'victor.jpg'
    },
];

export const adminSidebars = [
    {
        id: 0,
        title: 'Dashboard',
        path: '/admin',
        icon: <MdDashboard />
    },
    {
        id: 1,
        title: 'Accounts',
        path: '/admin/accounts',
        icon: <MdManageAccounts />
    },
    {
        id: 2,
        title: 'Products',
        path: '/admin/products',
        icon: <MdSportsTennis  />
    },
    {
        id: 3,
        title: 'Categories',
        path: '/admin/categories',
        icon: <MdCategory  />
    },
    {
        id: 4,
        title: 'Brands',
        path: '/admin/brands',
        icon: <MdBrandingWatermark  />
    },
    {
        id: 5,
        title: 'Promotions',
        path: '/admin/promotions',
        icon: <MdDiscount  />
    },
    {
        id: 6,
        title: 'Stocks',
        path: '/admin/stocks',
        icon: <MdDescription  />
    },
    {
        id: 7,
        title: 'Orders',
        path: '/admin/orders',
        icon: <TbTruckDelivery />
    },
];

export const accountSidebars = [
    {
        id: 0,
        title: 'Dashboard',
        path: '/profile',
        icon: <MdDashboard />
    },
    {
        id: 1,
        title: 'Profile',
        path: '/profile/update',
        icon: <MdOutlineAccountCircle  />
    },
    {
        id: 2,
        title: 'Change Password',
        path: '/profile/change-password',
        icon: <FaKey />,
    },
    {
        id: 3,
        title: 'Adresses Info',
        path: '/profile/address-info',
        icon: <AiOutlineHome />,
    },
    {
        id: 4,
        title: 'Orders Info',
        path: '/profile/orders-info',
        icon: <FaTruckFast />,
    },
]

export const productStatus = [
    {
        title: 'Active',
        value: 1,
    },
    {
        title: 'In - Active',
        value: 0,
    }
]

export const transactionType = [
    {
        title: 'Import',
        value: 1,
    },
    {
        title: 'Export',
        value: 0,
    }
]

export const formatDateString = (value: string): string => {
    const valueStr = value.toString(); 
    
    const year = parseInt(valueStr.substring(0, 4));  
    const month = parseInt(valueStr.substring(4, 6)) - 1; 
    const day = parseInt(valueStr.substring(6, 8));

    return `${year}-${month}-${day}}`;
};


export function convertKeysToLowerCase(obj: { [key: string]: any }) {
    const newObj: { [key: string]: any } = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        newObj[key.charAt(0).toLowerCase() + key.substring(1)] = obj[key];
      }
    }
    return newObj;
  }

export const icons = {
    'success': <FaCheck/>,
    'error': <FaX/>
}

export const sortOptions = [
    {
        title: '-- Choose --',
        value: '',
    },
    {
        title: 'Name DESC',
        value: 'NameDesc',
    },
    {
        title: 'Price ASC',
        value: 'priceASC',
    },
    {
        title: 'Price DESC',
        value: 'priceDESC',
    },
];

export const formatPrice = (value: string | number) => {
    const numericValue = typeof value === 'string' ? parseFloat(value.replace(/[^0-9.]/g, '')) : value;
    return !isNaN(numericValue) ? numericValue.toLocaleString('en-US', { minimumFractionDigits: 2 }) : '';
};