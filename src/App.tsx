// import { onAuthStateChanged } from 'firebase/auth';
// import { useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// import CourseContentList from './components/enrollment/course_list/CourseContentList';
// import HeaderComponent from './components/HeaderComponent';
// import ProfileComponent from './components/profile/ProfileComponent';
// import SearchComponent from './components/SearchComponent';
// import TestComponent from './components/TestComponent';
// import { auth } from './config/FirebaseConfiguration';
// import AuthPage from './pages/auth/AuthPage';
// import CourseDashboardPage from './pages/instructor/home/CourseDashboardPage';
// import ProfilePage from './pages/profile/ProfilePage';
// import EnrolledCoursePage from './pages/student/course/EnrolledCoursePage';
// import ListEnrolledCoursePage from './pages/student/course/ListEnrolledCoursePage';
// import SelectedCoursePage from './pages/student/course/SelectedCoursePage';
// import HomePage from './pages/student/home/HomePage';
// import ProtectedRoute from './routes/ProtectedRoute/ProtectedRoute';
// import { clearUser, setUser } from './store/slices/authSlice';
// import { ViewMode } from './types/Shared';

// // (Optional to Use) React.FC - Ensures type safety for the component's props.
// // Example : const MyComponent: FC<MyComponentProps> = ({ title, children })
// // If not used, can code -> const MyComponent = ({ title }: MyComponentProps): [Not using all props]

// // Jangan lupa install npm install @dnd-kit/core @dnd-kit/sortable kat terminal for drag and drop

// const App: React.FC = () => {
//     // `useDispatch()` is used to send actions to Redux store.
//     const dispatch = useDispatch();
//     // `useSelector()` is usesd to access the `isAuthenticated` state from `auth` slice.
//     const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

//     // `useEffect()` is invoked when the `dispatch` state changes which means --
//     // -- the effect will be triggered when component first loads.
//     useEffect(() => {
//         // This listens (monitor) to any changes in authentication state.
//         // Two parameters include here: [1] auth, [2] `user` callback function.
//         const subscribe = onAuthStateChanged(auth, (user) => {
//             // If `user` is not null
//             if (user) {
//                 // Then, dispatch `setUser()` action to Redux store.
//                 // This updates Redux store with authenticated user information.
//                 dispatch(setUser(user));
//             } else {
//                 // Else, dispatch `clearUser()` action to Redux store.
//                 // This clears any user data from Redux store.
//                 dispatch(clearUser());
//             }
//             // Stop listen to any changes in authentication state.
//         });
//         return () => subscribe();
//     }, [dispatch]);

//     // Differentiate user type to render components with appropriate design and functionality.
//     const userType = 'instructor'; //'student', 'instructor'

//     return (
//         <>
//             <Routes>
//                 {/* Default path */}
//                 <Route
//                     path='/'
//                     element={
//                         <ProtectedRoute>
//                             <HomePage />
//                         </ProtectedRoute>
//                     }
//                 />
//                 {/* Authentication path */}
//                 <Route path='/auth' element={<AuthPage />} />
//                 {/* Home path */}
//                 <Route
//                     path='/home'
//                     element={
//                         <ProtectedRoute>
//                             <HomePage />
//                         </ProtectedRoute>
//                     }
//                 />
//                 {/* For testing only path */}
//                 <Route
//                     path='/test'
//                     // <EnrolledCoursePage></EnrolledCoursePage>
//                     // <SelectedCoursePage></SelectedCoursePage>
//                     // <ListEnrolledCoursePage></ListEnrolledCoursePage>
//                     // <HomePage></HomePage>
//                     // element={<TestComponent></TestComponent>}
//                 />
//                 {/* Course Enrolled path */}
//                 <Route
//                     path='/course-enrolled'
//                     element={<ListEnrolledCoursePage></ListEnrolledCoursePage>}
//                 />
//                 {/* Instructor path */}
//                 <Route path='/instructor'>
//                     <Route
//                         path='/courses'
//                         element={
//                             <>
//                                 <HeaderComponent
//                                     userType='instructor'
//                                     currentRole={appState.currentRole}
//                                     onToggleView={toggleViewMode}
//                                 />
//                                 <CourseDashboardPage userId='u3' />
//                             </>
//                         }
//                     />
//                 </Route>

//                 {/* path */}
//                 <Route
//                     path='/content'
//                     element={
//                         <CourseContentList
//                             courseId='1'
//                             userType='instructor'
//                             userId='u2'
//                         />
//                     }
//                 />
//                 {/* Profile path */}
//                 <Route path='/profile' element={<ProfilePage userId='u3' />}>
//                     <Route
//                         path='edit/:viewMode'
//                         element={<ProfileComponent />}
//                     />
//                 </Route>
//             </Routes>
//         </>
//     );
// };

// export default App;

import { useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import CourseContentList from './components/enrollment/course_list/CourseContentList';
// Components
import HeaderComponent from './components/HeaderComponent';
import ProfileComponent from './components/profile/ProfileComponent';
// Pages
import AuthPage from './pages/auth/AuthPage';
import CreateCoursePage from './pages/instructor/course/CreateCoursePage';
import EditCoursePage from './pages/instructor/course/EditCoursePage';
import CourseDashboardPage from './pages/instructor/home/CourseDashboardPage';
import ProfilePage from './pages/profile/ProfilePage';
import EnrolledCoursePage from './pages/student/course/EnrolledCoursePage';
import ListEnrolledCoursePage from './pages/student/course/ListEnrolledCoursePage';
import SelectedCoursePage from './pages/student/course/SelectedCoursePage';
import HomePage from './pages/student/home/HomePage';
// Types
import { ViewMode } from './types/Shared';
import { UserRole } from './types/User';

const App: React.FC = () => {
    // State for testing - you might want to replace this with Redux later
    const [defaultUserId] = useState<string>('u3');
    const defaultUserType: ViewMode = 'instructor';
    const defaultRole: UserRole = 'instructor';

    const toggleViewMode = () => {
        console.log('Toggle view mode');
        // Implement actual toggle functionality when needed
    };

    // Common Layout Component
    const Layout: React.FC<{children: React.ReactNode}> = ({children}) => (
        <>
            <HeaderComponent
                userType={defaultUserType}
                currentRole={defaultRole}
                onToggleView={toggleViewMode}
            />
            {children}
        </>
    );

    return (
        <Routes>
            {/* Public Routes */}
            <Route path='/auth' element={<AuthPage />} />

            {/* Home Routes */}
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

            {/* Course Routes */}
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
                            <CourseDashboardPage userId={defaultUserId} />
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
                                <CreateCoursePage />
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
                                userType={defaultUserType}
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
                <Route path='edit/:viewMode' element={<ProfileComponent />} />
            </Route>

            {/* Test Routes */}
            <Route path='/test'>
                <Route
                    path='enrolled-course'
                    element={<EnrolledCoursePage />}
                />
                <Route
                    path='selected-course'
                    element={<SelectedCoursePage />}
                />
            </Route>

            {/* Catch-all route - Redirect to home */}
            <Route path='*' element={<Navigate to='/' replace />} />
        </Routes>
    );
};

export default App;
