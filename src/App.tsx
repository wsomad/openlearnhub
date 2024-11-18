import {onAuthStateChanged} from 'firebase/auth';
import {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import {useAuth} from './hooks/useAuth';
import CourseContentList from './components/enrollment/course_list/CourseContentList';
import HeaderComponent from './components/HeaderComponent';
import ProfileComponent from './components/profile/ProfileComponent';
import SearchComponent from './components/SearchComponent';
//import TestComponent from './components/TestComponent';
import {auth} from './config/FirebaseConfiguration';
import AuthPage from './pages/auth/AuthPage';
import ProfilePage from './pages/profile/ProfilePage';
import EnrolledCoursePage from './pages/student/course/EnrolledCoursePage';
import ListEnrolledCoursePage from './pages/student/course/ListEnrolledCoursePage';
import SelectedCoursePage from './pages/student/course/SelectedCoursePage';
import HomePage from './pages/student/home/HomePage';
import ProtectedRoute from './routes/ProtectedRoute/ProtectedRoute';
import {clearUser, setUser} from './store/slices/authSlice';
import {ViewMode} from './types/Shared';

// React.FC stands for React Functional Component.
const App: React.FC = () => {
    // Destucturing properties from `useAuth`.
    const {user, isAuthenticated, signUserOut} = useAuth();

    // Differentiate user type to render components with appropriate design and functionality.
    const userType: 'student' | 'instructor' = user?.role || 'student';

    return (
        <>
            {/* Later, update each path to have authentication condition */}
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
                {/* Course Enrolled path */}
                <Route
                    path='/course-enrolled'
                    element={<ListEnrolledCoursePage />}
                />
                {/* Content path */}
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
                {/* Profile path
                <Route path='/profile' element={<ProfilePage userId='u3' />}>
                    <Route
                        path='edit/:viewMode'
                        element={
                            <ProfileComponent
                                userProfile={undefined}
                                viewMode={undefined}
                                onClose={undefined}
                                onProfileUpdate={undefined}
                            />
                        }
                    />
                </Route> */}

                {/* For testing only path */}
                <Route
                    path='/test'
                    // <EnrolledCoursePage></EnrolledCoursePage>
                    // <SelectedCoursePage></SelectedCoursePage>
                    // <ListEnrolledCoursePage></ListEnrolledCoursePage>
                    // <HomePage></HomePage>
                    // element={<TestComponent></TestComponent>}
                />
            </Routes>
        </>
    );
};

export default App;
