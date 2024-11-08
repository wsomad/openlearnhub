import {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {setUser, clearUser} from './store/slices/authSlice';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import ProtectedRoute from './routes/ProtectedRoute/ProtectedRoute';
import AuthPage from './pages/auth/AuthPage';
import HomePage from './pages/student/home/HomePage';
import HeaderComponent from './components/HeaderComponent';
import {onAuthStateChanged} from 'firebase/auth';
import {auth} from './config/FirebaseConfiguration';

function App() {
    // `useDispatch()` is used to send actions to Redux store.
    const dispatch = useDispatch();
    // `useSelector()` is usesd to access the `isAuthenticated` state from `auth` slice.
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

    // `useEffect()` is invoked when the `dispatch` state changes which means --
    // -- the effect will be triggered when component first loads.
    useEffect(() => {
        // This listens (monitor) to any changes in authentication state.
        // Two parameters include here: [1] auth, [2] `user` callback function.
        const subscribe = onAuthStateChanged(auth, (user) => {
            // If `user` is not null
            if (user) {
                // Then, dispatch `setUser()` action to Redux store.
                // This updates Redux store with authenticated user information.
                dispatch(setUser(user));
            } else {
                // Else, dispatch `clearUser()` action to Redux store.
                // This clears any user data from Redux store.
                dispatch(clearUser());
            }
            // Stop listen to any changes in authentication state.
            return () => subscribe();
        });
    }, [dispatch]);

    return (
        <>
            <Routes>
                <Route path='/auth' element={<AuthPage />} />
                <Route
                    path='/home'
                    element={<ProtectedRoute element={<HomePage />} />}
                />
            </Routes>
        </>
    );
}

export default App;
