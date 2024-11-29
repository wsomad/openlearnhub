import 'react-toastify/dist/ReactToastify.css';
import {BrowserRouter as Navigate, Route, Routes} from 'react-router-dom';
import AuthPage from './pages/auth/AuthPage';
import EnrolledCoursePage from './pages/student/course/EnrolledCoursePage';
import ListEnrolledCoursePage from './pages/student/course/ListEnrolledCoursePage';
import SelectedCoursePage from './pages/student/course/SelectedCoursePage';
import HomePage from './pages/student/home/HomePage';
import CourseDashboardPage from './pages/instructor/home/CourseDashboardPage';
import CreateCoursePage from './pages/instructor/course/CreateCoursePage';
import {useUser} from './hooks/useUser';
import {Course} from './types/course';
import ProtectedRoute from './routes/ProtectedRoute/ProtectedRoute';
import EditCoursePage from './pages/instructor/course/EditCoursePage';

// React.FC stands for React Functional Component.
const App: React.FC = () => {
    // Destucturing properties from `useAuth`.
    // const {user, isAuthenticated, signUserOut} = useAuth();
    //const {currentUser} = useUser();

    // Differentiate user type to render components with appropriate design and functionality.
    // const userType: 'student' | 'instructor' = user?.role || 'student';

    // State for testing - you might want to replace this with Redux later
    // const [defaultUserId] = useState<string>('u3');
    // const [userType, setUserType] = useState<ViewMode>('instructor');
    // const [currentRole, setCurrentRole] = useState<UserRole>('instructor');

    // const toggleViewMode = () => {
    //     setUserType((prev) => (prev === 'student' ? 'instructor' : 'student'));
    //     setCurrentRole((prev) =>
    //         prev === 'student' ? 'instructor' : 'student',
    //     );
    // };

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
                        //<HomePage />
                    }
                >
                    {/* <Route path='/auth' element={<AuthPage />} />
                    <Route path='/home' element={<HomePage />} /> */}
                </Route>
                {/* Authentication path */}
                <Route path='/auth' element={<AuthPage />} />
                <Route path='/home' element={<HomePage />} />
                {/* Course Enrolled Routes */}
                <Route
                    path='/listofenrolledcourse'
                    element={<ListEnrolledCoursePage />}
                />
                {/* Instructor path */}
                <Route path='/instructor'>
                    {/* Course Dashboard path */}
                    <Route path='dashboard' element={<CourseDashboardPage />} />
                    {/* Create New Course */}
                    <Route
                        path='dashboard/course/create'
                        element={<CreateCoursePage />}
                        /* // <Layout>
                            //     <div className='container mx-auto px-4 py-8'>
                            //         <h1 className='text-3xl font-bold font-abhaya mb-8'>
                            //             Create New Course
                            //         </h1>

                            //     </div>
                            // </Layout> */
                    />
                    {/* Edit Course */}
                    <Route
                        path='dashboard/:courseId/edit'
                        element={
                            <EditCoursePage
                            // userId={defaultUserId}
                            // userType={userType}
                            />
                        }
                    />
                </Route>
                {/* Selected Course Page path */}
                <Route
                    path='/selectedcourse/:id'
                    element={<SelectedCoursePage />}
                />
                {/* Enrolled Course Page path */}
                <Route
                    path='/enrolledcourse/:id'
                    element={<EnrolledCoursePage />}
                />
                {/* Profile Routes */}
                {/* <Route
                    path='/profile'
                    element={<ProfilePage userId={defaultUserId} />}
                > */}
                {/* <Route
                        path='edit/:viewMode'
                        element={<ProfileComponent />}
                    /> */}
                {/* </Route> */}
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
        </>
    );
};

export default App;
