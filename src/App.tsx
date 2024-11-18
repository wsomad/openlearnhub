import { onAuthStateChanged } from 'firebase/auth';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import CourseContentList from './components/enrollment/course_list/CourseContentList';
import HeaderComponent from './components/HeaderComponent';
import ProfileComponent from './components/profile/ProfileComponent';
import SearchComponent from './components/SearchComponent';
import TestComponent from './components/TestComponent';
import { auth } from './config/FirebaseConfiguration';
import AuthPage from './pages/auth/AuthPage';
import ProfilePage from './pages/profile/ProfilePage';
import EnrolledCoursePage from './pages/student/course/EnrolledCoursePage';
import ListEnrolledCoursePage from './pages/student/course/ListEnrolledCoursePage';
import SelectedCoursePage from './pages/student/course/SelectedCoursePage';
import HomePage from './pages/student/home/HomePage';
import ProtectedRoute from './routes/ProtectedRoute/ProtectedRoute';
import { clearUser, setUser } from './store/slices/authSlice';
import { ViewMode } from './types/Shared';

// (Optional to Use) React.FC - Ensures type safety for the component's props.
// Example : const MyComponent: FC<MyComponentProps> = ({ title, children })
// If not used, can code -> const MyComponent = ({ title }: MyComponentProps): [Not using all props]

// Jangan lupa install npm install @dnd-kit/core @dnd-kit/sortable kat terminal for drag and drop

const App: React.FC = () => {
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
                    // element={<TestComponent></TestComponent>}
                />
                {/* Course Enrolled path */}
                <Route
                    path='/course-enrolled'
                    element={<ListEnrolledCoursePage></ListEnrolledCoursePage>}
                />
                {/* path */}
                <Route
                    path='/content'
                    element={
                        <CourseContentList
                            courseId='2'
                            userType='instructor'
                            userId='u3'
                        />
                    }
                />
                {/* Profile path */}
                <Route path='/profile' element={<ProfilePage userId='u3' />}>
                    <Route
                        path='edit/:viewMode'
                        element={<ProfileComponent />}
                    />
                </Route>
            </Routes>
        </>
    );
};

export default App;
