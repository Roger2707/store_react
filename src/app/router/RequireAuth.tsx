import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppSelector } from "../store/configureStore";

interface Props {
    roles?: string[];
}

export default function RequireAuth({roles}: Props) {
    const {user} = useAppSelector(state => state.account);
    const location = useLocation();

    if (!user) {
        //toast.error('You need to be logged in to do that!', {icon: icons.error});
        return <Navigate to='/login' state={{from: location}} />
    }

    if (roles && !roles?.some(r => user.role?.includes(r))) {
        //toast.error('Not authorised to access this area', {icon: icons.error});
        return <Navigate to='/' />
    }

    return <Outlet />
}