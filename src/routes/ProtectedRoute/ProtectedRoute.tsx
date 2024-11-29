import React, {ReactNode} from 'react';
import {useSelector} from 'react-redux';
import {Navigate} from 'react-router-dom';
import {RootState} from '../../store/store'; // Adjust the import path for your Redux store's RootState

interface ProtectedRouteProps {
    children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({children}) => {
    const isAuthenticated = useSelector(
        (state: RootState) => state.user.isAuthenticated,
    );

    return isAuthenticated ? <>{children}</> : <Navigate to='/auth' />;
};

export default ProtectedRoute;
