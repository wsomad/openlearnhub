import { onAuthStateChanged } from 'firebase/auth';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter as Navigate, Route, Routes } from 'react-router-dom';

// Components
import HeaderComponent from './components/HeaderComponent';
import ProfileComponent from './components/profile/ProfileComponent';
import { auth } from './config/FirebaseConfiguration';
import { useAuth } from './hooks/useAuth';
import AuthPage from './pages/auth/AuthPage';
import { CourseProvider } from './pages/instructor/course/CourseContext';
import CreateCoursePage from './pages/instructor/course/CreateCoursePage';
import EditCoursePage from './pages/instructor/course/EditCoursePage';
import CourseDashboardPage from './pages/instructor/home/CourseDashboardPage';
import ProfilePage from './pages/profile/ProfilePage';
import EnrolledCoursePage from './pages/student/course/EnrolledCoursePage';
import ListEnrolledCoursePage from './pages/student/course/ListEnrolledCoursePage';
import SelectedCoursePage from './pages/student/course/SelectedCoursePage';
import HomePage from './pages/student/home/HomePage';
import ProtectedRoute from './routes/ProtectedRoute/ProtectedRoute';
import { clearUser, setUser } from './store/slices/authSlice';
// Types
import { ViewMode } from './types/shared';
import { UserRole } from './types/user';

// React.FC stands for React Functional Component.
const App: React.FC = () => {
    // Destucturing properties from `useAuth`.
    // const {user, isAuthenticated, signUserOut} = useAuth();

    // Differentiate user type to render components with appropriate design and functionality.
    // const userType: 'student' | 'instructor' = user?.role || 'student';

    // State for testing - you might want to replace this with Redux later
    const [defaultUserId] = useState<string>('u3');
    const [userType, setUserType] = useState<ViewMode>('instructor');
    const [currentRole, setCurrentRole] = useState<UserRole>('instructor');

    const toggleViewMode = () => {
        setUserType((prev) => (prev === 'student' ? 'instructor' : 'student'));
        setCurrentRole((prev) =>
            prev === 'student' ? 'instructor' : 'student',
        );
    };

    // Common Layout Component with mock user
    const Layout: React.FC<{children: React.ReactNode}> = ({children}) => (
        <>
            <HeaderComponent
                userType={userType}
                currentRole={currentRole}
                onToggleView={toggleViewMode}
                userId={defaultUserId}
            />
            {children}
        </>
    );

    return (
        <>
            {/* Later, update each path to have authentication condition */}
            <CourseProvider>
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
                        path='/'
                        element={
                            <Layout>
                                <HomePage />
                            </Layout>
                        }
                    />

                    <Route
                        path='/home'
                        element={
                            <Layout>
                                <HomePage />
                            </Layout>
                        }
                    />

                    {/* Course Enrolled Routes */}
                    <Route
                        path='/course-enrolled'
                        element={
                            <Layout>
                                <ListEnrolledCoursePage />
                            </Layout>
                        }
                    />

                    {/* Instructor Routes */}
                    <Route path='/instructor'>
                        {/* Course Dashboard */}
                        <Route
                            path='courses'
                            element={
                                <Layout>
                                    <CourseDashboardPage
                                        userId={defaultUserId}
                                    />
                                </Layout>
                            }
                        />

                        {/* Create New Course */}
                        <Route
                            path='courses/create'
                            element={
                                <Layout>
                                    <div className='container mx-auto px-4 py-8'>
                                        <h1 className='text-3xl font-bold font-abhaya mb-8'>
                                            Create New Course
                                        </h1>
                                        <CreateCoursePage
                                            instructorId={defaultUserId}
                                        />
                                    </div>
                                </Layout>
                            }
                        />

                        {/* Edit Course */}
                        <Route
                            path='courses/:courseId/edit'
                            element={
                                <Layout>
                                    <EditCoursePage
                                        userId={defaultUserId}
                                        userType={userType}
                                    />
                                </Layout>
                            }
                        />
                    </Route>

                    {/* Profile Routes */}
                    <Route
                        path='/profile'
                        element={
                            <Layout>
                                <ProfilePage userId={defaultUserId} />
                            </Layout>
                        }
                    >
                        <Route
                            path='edit/:viewMode'
                            element={<ProfileComponent />}
                        />
                    </Route>

                    {/* Test Routes */}
                    <Route
                        path='/test'
                        // <EnrolledCoursePage></EnrolledCoursePage>
                        // <SelectedCoursePage></SelectedCoursePage>
                        // <ListEnrolledCoursePage></ListEnrolledCoursePage>
                        // <HomePage></HomePage>
                        // element={<TestComponent></TestComponent>}
                    />
                </Routes>
            </CourseProvider>
        </>
    );
};

export default App;
