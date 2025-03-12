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
        title: 'Contents',
        path: '/admin/contents',
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
        title: 'In Stock',
        value: 1,
    },
    {
        title: 'Out Stock',
        value: 2,
    }
]

export const convertDateStringToCurrentDateTime = (dateString: string): Date => {
    const [year, month, day] = dateString.split('/').map(Number);
    const currentTime = new Date();

    // Tạo đối tượng Date với ngày từ chuỗi và giờ hiện tại
    return new Date(year, month - 1, day, currentTime.getHours(), currentTime.getMinutes(), currentTime.getSeconds());
};

export const formatDateToDateTimeString = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    // Trả về định dạng "yyyy-MM-ddThh:mm:ss"
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
};

export const formatDateToDateString = (date: Date): string => {    
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0
    const day = String(date.getDate()).padStart(2, '0');

    // Trả về định dạng "yyyy-MM-dd"
    return `${year}-${month}-${day}`;
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