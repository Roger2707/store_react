import { createBrowserRouter } from "react-router-dom";
import App from "../../App";
import { ProductPage } from "../../features/pages/Product/ProductPage";
import { ProductDetailPage } from "../../features/pages/Product/ProductDetailPage";
import { Login } from "../../features/pages/Identity/Login";
import { SignUp } from "../../features/pages/Identity/SignUp";
import { NotfoundPage } from "../middleware/NotfoundPage";
import { AdminPage } from "../../features/pages/Admin/AdminPage";
import { AdminProduct } from "../../features/pages/Admin/AdminProduct";
import { AdminAccount } from "../../features/pages/Admin/AdminAccount";
import { AdminCategory } from "../../features/pages/Admin/AdminCategory";
import { AdminBrand } from "../../features/pages/Admin/AdminBrand";
import { AdminPromotion } from "../../features/pages/Admin/AdminPromotion";
import { AdminOrder } from "../../features/pages/Admin/AdminOrder";
import { About } from "../../features/pages/Others/About";
import { News } from "../../features/pages/Others/News";
import { Contact } from "../../features/pages/Others/Contact";
import RequireAuth from "./RequireAuth";
import { ForgotPassword } from "../../features/pages/Identity/ForgotPassword";
import { ResetPassword } from "../../features/pages/Identity/ResetPassword";
import { BasketPage } from "../../features/pages/Cart/BasketPage";
import { AdminStock } from "../../features/pages/Admin/AdminStock";
import { UserProfile } from "../../features/pages/User/UserProfile";
import { OrdersSummary } from "../../features/pages/User/OrdersSummary";
import { ChangePassword } from "../../features/pages/User/ChangePassword";
import { AdminWarehouse } from "../../features/pages/Admin/AdminWarehouse";
import { CheckoutPage } from "../../features/pages/CheckOut/CheckoutPage";
import { CheckOutSuccess } from "../../features/pages/CheckOut/CheckOutSuccess";

export const router = createBrowserRouter(([
    {
        path: '/',
        element: <App />,
        children: [

            // PUBLIC ROUTES
            { path: 'products', element: <ProductPage /> },
            { path: 'products/products/:productId/:productDetailId', element: <ProductDetailPage /> },
            { path: 'about', element: <About /> },
            { path: 'news', element: <News /> },
            { path: 'contact', element: <Contact /> },
            { path: 'login', element: <Login /> },
            { path: 'signup', element: <SignUp /> },
            { path: 'forgot-password', element: <ForgotPassword /> },
            { path: 'get-reset-password', element: <ResetPassword /> },

            // ERROR ROUTES
            { path: '*', element: <NotfoundPage /> },

            // ADMIN ROUTES
            {
                element: <RequireAuth roles={['Admin']} />, children: [
                    {
                        path: 'admin', element: <AdminPage />,
                        children: [
                            { path: 'accounts', element: <AdminAccount /> },
                            { path: 'products', element: <AdminProduct /> },
                            { path: 'categories', element: <AdminCategory /> },
                            { path: 'brands', element: <AdminBrand /> },
                            { path: 'promotions', element: <AdminPromotion /> },
                            { path: 'stocks', element: <AdminStock /> },
                            { path: 'warehouses', element: <AdminWarehouse /> },
                            { path: 'orders', element: <AdminOrder /> },
                        ]
                    },
                ]
            },

            // AUTHENTICATED ROUTES
            {
                element: <RequireAuth />, children: [
                    { path: 'profile', element: <UserProfile />, },
                    { path: 'orders', element: <OrdersSummary /> },
                    { path: 'change-password', element: <ChangePassword /> },
                    { path: 'basket', element: <BasketPage /> },
                    { path: 'checkout/:clientSecret', element: <CheckoutPage /> },
                    { path: 'checkout-success', element: <CheckOutSuccess /> },
                ]
            },
        ]
    }
]))
