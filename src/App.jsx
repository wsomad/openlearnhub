import {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {setUser, clearUser} from './store/slices/authSlice';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import ProtectedRoute from './routes/ProtectedRoute/ProtectedRoute';
import AuthPage from './pages/auth/AuthPage';
import HomePage from './pages/student/home/HomePage';
import HeaderComponent from './components/HeaderComponent';
import {onAuthStateChanged} from 'firebase/auth';
import {auth} from './config/firebaseConfiguration';
import TestComponent from './components/TestComponent';
import SearchComponent from './components/SearchComponent';
import CourseContentList from './components/enrollment/course_list/CourseContentList';
import ProfileComponent from './components/ProfileComponent';
import SelectedCoursePage from './pages/student/course/SelectedCoursePage';
import EnrolledCoursePage from './pages/student/course/EnrolledCoursePage';
import ListEnrolledCoursePage from './pages/student/course/ListEnrolledCoursePage';
import ProfilePage from './pages/profile/ProfilePage';

// Jangan lupa install npm install @dnd-kit/core @dnd-kit/sortable kat terminal for drag and drop

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
        });
        return () => subscribe();
    }, [dispatch]);

    // Differentiate user type to render components with appropriate design and functionality.
    const userType = 'instructor'; //'student', 'instructor'

    return (
        <>
            <Routes>
                {/* Default path */}
                <Route
                    path='/'
                    element={
                        <ProtectedRoute>
                            <HomePage />
                        </ProtectedRoute>
                    }
                />
                {/* Authentication path */}
                <Route path='/auth' element={<AuthPage />} />
                {/* Home path */}
                <Route
                    path='/home'
                    element={
                        <ProtectedRoute>
                            <HomePage />
                        </ProtectedRoute>
                    }
                />
                {/* For testing only path */}
                <Route
                    path='/test'
                    // <EnrolledCoursePage></EnrolledCoursePage>
                    // <SelectedCoursePage></SelectedCoursePage>
                    // <ListEnrolledCoursePage></ListEnrolledCoursePage>
                    // <HomePage></HomePage>
                    element={<EnrolledCoursePage></EnrolledCoursePage>}
                />
                {/* Course Enrolled path */}
                <Route
                    path='/course-enrolled'
                    element={<ListEnrolledCoursePage></ListEnrolledCoursePage>}
                />
                {/* Content path */}
                <Route
                    path='/content'
                    element={<CourseContentList userType={userType} />}
                />
                {/* Profile path */}
                <Route
                    path='/profile'
                    element={<ProfilePage userType={userType} />}
                >
                    <Route
                        path='edit/:viewMode'
                        element={<ProfileComponent />}
                    />
                </Route>
            </Routes>
        </>
    );
}

export default App;
