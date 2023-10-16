import {FC, ReactElement} from "react";
import { useLocation, Navigate } from "react-router-dom";
import {useAppSelector} from '../hooks/useTypedRedux';



interface IProps {
    children: ReactElement | null;
}

const RequireAuth: FC<IProps> = ({children}: IProps) => {

    const location = useLocation();
    const isAuth = useAppSelector(state => state.reducerAuth.isAuth);
    
    if (!isAuth) {
        return <Navigate to='/register' state={{from: location}} />
    }

    return children;
}

export default RequireAuth;