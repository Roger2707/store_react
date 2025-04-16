import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppSelector } from "../store/configureStore";

interface Props {
    roles?: string[];
}

export default function RequireAuth({roles}: Props) {
    const {user} = useAppSelector(state => state.user);
    const location = useLocation();

    if (!user) {
        return <Navigate to='/login' state={{from: location}} />
    }

    if (roles && !roles?.some(r => user.role?.includes(r))) {
        return <Navigate to='/' />
    }

    return <Outlet />
}