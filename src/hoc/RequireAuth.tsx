import { ReactElement } from "react";
import { useLocation, Navigate } from "react-router-dom";

interface IProps {
    children: ReactElement | null;
}
type IHoc = ReactElement | null;


const RequireAuth = ({children}: IProps): IHoc => {

    const location = useLocation();
    const isAuth = JSON.parse(localStorage.getItem('isAuth') || 'false');

    if (!isAuth) {
        return <Navigate to='/register' state={{from: location}} />
    }

    return children;
}

export default RequireAuth;