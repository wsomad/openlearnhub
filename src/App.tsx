import {useEffect} from 'react';
import {useAuth} from './hooks/useAuth'; // Import the custom hook for authentication
import {Routes, Route} from 'react-router-dom';
import ProtectedRoute from './routes/ProtectedRoute/ProtectedRoute';
import AuthPage from './pages/auth/AuthPage';
import HomePage from './pages/student/home/HomePage';
import HeaderComponent from './components/HeaderComponent';
import ListEnrolledCoursePage from './pages/student/course/ListEnrolledCoursePage';
import CourseContentList from './components/enrollment/course_list/CourseContentList';
import ProfilePage from './pages/profile/ProfilePage';
import ProfileComponent from './components/ProfileComponent';

function App() {
    const {user, isAuthenticated, signUserOut} = useAuth(); // Use the useAuth hook

    const userType: 'student' | 'instructor' = user?.role || 'student'; // Set dynamically based on user data

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
                {/* Course Enrolled path */}
                <Route
                    path='/course-enrolled'
                    element={<ListEnrolledCoursePage />}
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
                        element={
                            <ProfileComponent
                                userProfile={undefined}
                                viewMode={undefined}
                                onClose={undefined}
                                onProfileUpdate={undefined}
                            />
                        }
                    />
                </Route>
            </Routes>
        </>
    );
}

export default App;
