import React, {useEffect, useState} from 'react';
import {FaPlus} from 'react-icons/fa';
import {Link} from 'react-router-dom';
import {User} from '../../../types/user';
import {useCourses} from '../../../hooks/useCourses';
import {useUser} from '../../../hooks/useUser';
import HeaderComponent from '../../../components/HeaderComponent';
import {useDispatch, useSelector} from 'react-redux';
import SearchComponent from '../../../components/SearchComponent';
import {clearCourses} from '../../../store/slices/courseSlice';

const CourseDashboardPage: React.FC = () => {
    const {allCourses, fetchAllCourses} = useCourses();
    const {currentUser, userRole, updateUser} = useUser();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const dispatch = useDispatch();
    const currentState = useSelector((state) => state);
    console.log('Current State from Selector:', currentState);

    // Run side effect to fetch all courses created by the instructor.
    useEffect(() => {
        const loadInstructorData = async () => {
            if (!currentUser || !userRole) return;

            try {
                await fetchAllCourses(
                    currentUser?.uid,
                    'instructor',
                    'creator',
                );
            } catch (error) {
                setError('Failed to load courses');
            } finally {
                setIsLoading(false);
            }
        };

        loadInstructorData();
    }, [currentUser, userRole]);

    // Run side effect to update total courses created by instructor.
    useEffect(() => {
        if (!allCourses || !currentUser?.uid) {
            return;
        }

        const calculateTotalCourses = allCourses.filter(
            (course) => course.instructor_id === currentUser.uid,
        );

        const totalCourses = calculateTotalCourses.length;

        const loadInstructorData = async () => {
            try {
                if (currentUser.uid) {
                    await updateUser(currentUser.uid, {
                        'instructor.total_courses_created': totalCourses,
                    } as Partial<User>);
                }
            } catch (error) {
                console.error(
                    'Failed to total courses created by instructor:',
                    error,
                );
            }
        };

        loadInstructorData();
    }, [allCourses, currentUser, userRole]);

    useEffect(() => {
        return () => {
            dispatch(clearCourses());
        };
    }, [dispatch]);

    if (error) {
        return <div className='text-red text-center'>Error: {error}</div>;
    }

    return (
        <div>
            <HeaderComponent></HeaderComponent>
            <div className='font-abhaya container mx-auto px-4 py-8'>
                <div className='mb-8'>
                    <h1 className='text-5xl font-bold font-abhaya mb-2'>
                        Instructor Dashboard
                    </h1>
                    <p className='text-xl text-gray-600'>
                        Start contribute something to community.
                    </p>
                    <SearchComponent></SearchComponent>
                    <p className='text-2xl text-primary mt-6'>
                        {currentUser?.instructor?.total_courses_created || 0}{' '}
                        Courses Created
                    </p>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                    <Link
                        to='/instructor/dashboard/course/create'
                        className='bg-white border-2 border-dashed border-gray-300 p-6 flex flex-col items-center justify-center space-y-4 hover:border-primary hover:bg-gray-50 transition-colors cursor-pointer min-h-[300px]'
                    >
                        <div className='w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center'>
                            <FaPlus className='w-8 h-8 text-primary' />
                        </div>
                        <h3 className='text-3xl font-semibold font-abhaya text-primary'>
                            New Course
                        </h3>
                        <p className='text-gray-500 text-center text-lg font-abhaya'>
                            Create a new course
                        </p>
                    </Link>

                    {allCourses.map((course) => (
                        <div
                            key={course.course_id}
                            className='bg-white border border-gray overflow-hidden shadow-sm hover:shadow-md transition-shadow'
                        >
                            <img
                                src={course.course_thumbnail_url}
                                alt={course.course_title}
                                className='w-full h-40 object-cover'
                            />

                            <div className='p-6'>
                                <h3 className='text-xl font-semibold font-abhaya mb-2'>
                                    {course.course_title}
                                </h3>
                                <p className='text-gray-600 mb-4 line-clamp-2 font-abhaya'>
                                    {course.course_description}
                                </p>

                                <div className='grid grid-cols-2 gap-4 mb-4'>
                                    <div>
                                        <p className='text-gray-500 text-sm font-abhaya'>
                                            Enrollment
                                        </p>
                                        <p className='text-lg font-semibold font-abhaya'>
                                            {course.course_enrollment_number}
                                        </p>
                                    </div>

                                    <div>
                                        <p className='text-gray-500 text-sm font-abhaya'>
                                            Status
                                        </p>
                                        <p className='text-lg font-semibold font-abhaya'>
                                            {course.ready_for_publish
                                                ? 'Published'
                                                : 'In Draft'}
                                        </p>
                                    </div>
                                </div>

                                <div className='flex space-x-2'>
                                    <Link
                                        to={`/instructor/dashboard/${course.course_id}/edit`}
                                        className='flex-1 bg-primary text-white text-center py-2 hover:bg-primary-dark transition-colors font-abhaya'
                                    >
                                        Edit
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CourseDashboardPage;
