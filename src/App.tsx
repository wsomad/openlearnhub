import 'react-toastify/dist/ReactToastify.css';

import { BrowserRouter as Navigate, Route, Routes } from 'react-router-dom';

import AuthPage from './pages/auth/AuthPage';
import InstructorAuthPage from './pages/auth/InstructorAuthPage';
import CreateCoursePage from './pages/instructor/course/CreateCoursePage';
import EditCoursePage from './pages/instructor/course/EditCoursePage';
import CourseDashboardPage from './pages/instructor/home/CourseDashboardPage';
import ProfilePage from './pages/profile/ProfilePage';
import CourseCategoriesPage from './pages/student/course/CourseCategoriesPage';
import EnrolledCoursePage from './pages/student/course/EnrolledCoursePage';
import ListEnrolledCoursePage from './pages/student/course/ListEnrolledCoursePage';
import SelectedCoursePage from './pages/student/course/SelectedCoursePage';
import HomePage from './pages/student/home/HomePage';
import ProtectedRoute from './routes/ProtectedRoute/ProtectedRoute';

const App: React.FC = () => {
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
                <Route path='/categories' element={<CourseCategoriesPage />} />
                <Route
                    path='/instructor/:id/profile'
                    element={<ProfilePage />}
                />
                {/* Course Enrolled Routes */}
                <Route
                    path='/listofenrolledcourse'
                    element={<ListEnrolledCoursePage />}
                />
                {/* Profile Routes */}
                <Route path='/profile' element={<ProfilePage />} />
                {/* Instructor path */}
                <Route path='/instructor'>
                    <Route path='auth/' element={<InstructorAuthPage />} />
                    <Route path='profile/' element={<ProfilePage />} />
                    {/* Course Dashboard path */}
                    <Route path='dashboard' element={<CourseDashboardPage />} />
                    {/* Create New Course */}
                    <Route
                        path='dashboard/course/create'
                        element={<CreateCoursePage />}
                    />
                    {/* Edit Course */}
                    <Route
                        path='dashboard/:courseId/edit'
                        element={<EditCoursePage />}
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
            </Routes>
        </>
    );
};

export default App;
