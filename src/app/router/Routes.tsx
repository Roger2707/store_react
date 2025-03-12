import { createBrowserRouter } from "react-router-dom";
import App from "../../App";
import { ProductPage } from "../../features/pages/Product/ProductPage";
import { ProductDetail } from "../../features/pages/Product/ProductDetail";
import { Login } from "../../features/pages/Identity/Login";
import { SignUp } from "../../features/pages/Identity/SignUp";
import { NotfoundPage } from "../middleware/NotfoundPage";
import { AdminPage } from "../../features/pages/Admin/AdminPage";
import { AdminProduct } from "../../features/pages/Admin/AdminProduct";
import { AdminAccount } from "../../features/pages/Admin/AdminAccount";
import { AdminCategory } from "../../features/pages/Admin/AdminCategory";
import { AdminBrand } from "../../features/pages/Admin/AdminBrand";
import { AdminPromotion } from "../../features/pages/Admin/AdminPromotion";
import { AdminContent } from "../../features/pages/Admin/AdminContent";
import { AdminOrder } from "../../features/pages/Admin/AdminOrder";
import { About } from "../../features/pages/Others/About";
import { News } from "../../features/pages/Others/News";
import { Contact } from "../../features/pages/Others/Contact";
import RequireAuth from "./RequireAuth";
import { ForgotPassword } from "../../features/pages/Identity/ForgotPassword";
import { ResetPassword } from "../../features/pages/Identity/ResetPassword";
import { Profile } from "../../features/pages/Accounts/Profile";
import { UpdateProfile } from "../../features/pages/Accounts/UpdateProfile";
import { ChangePassword } from "../../features/pages/Accounts/ChangePassword";
import { OrdersInfo } from "../../features/pages/Accounts/OrdersInfo";
import { UserAddressList } from "../../features/pages/Accounts/UserAddressList";
import { OAuthLoginSuccess } from "../../features/pages/Identity/OAuthLoginSuccess";
import { BasketPage } from "../../features/pages/Cart/BasketPage";
import { Order } from "../../features/pages/Orders/Order";

export const router = createBrowserRouter(([
    {
        path: '/',
        element: <App />,
        children: [
            
            // PUBLIC ROUTES
            { path: 'products', element: <ProductPage/> },
            { path: 'products/:id', element: <ProductDetail/> },
            { path: 'about', element: <About/> },
            { path: 'news', element: <News/> },
            { path: 'contact', element: <Contact/> },
            { path: 'login', element: <Login/> },
            { path: 'signup', element: <SignUp/> },
            { path: 'callback', element: <OAuthLoginSuccess/> },
            { path: 'forgot-password', element: <ForgotPassword/> },
            { path: 'get-reset-password', element: <ResetPassword/> },

            // ERROR ROUTES
            { path: '*', element: <NotfoundPage/> },

            // ADMIN ROUTES
            {
                element: <RequireAuth roles={['Admin']} />, children: [
                    { path: 'admin', element: <AdminPage/>,
                        children: [
                            { path: 'accounts', element: <AdminAccount/> },
                            { path: 'products', element: <AdminProduct/> },
                            { path: 'categories', element: <AdminCategory/> },
                            { path: 'brands', element: <AdminBrand/> },
                            { path: 'promotions', element: <AdminPromotion/> },
                            { path: 'contents', element: <AdminContent/> },
                            { path: 'orders', element: <AdminOrder/> },
                        ]
                    },
                ]
            },
            
            // AUTHENTICATED ROUTES
            {
                element: <RequireAuth />, children: [
                    { path: 'profile', element: <Profile/>, 
                        children: [
                            {path: 'update', element: <UpdateProfile />},
                            {path: 'change-password', element: <ChangePassword />},
                            {path: 'address-info', element: <UserAddressList />},
                            {path: 'orders-info', element: <OrdersInfo />},
                        ]
                    },             
                    { path: 'basket', element: <BasketPage/> },
                    { path: 'orders', element: <Order/> },
                ]
            },
        ]
    }
]))
