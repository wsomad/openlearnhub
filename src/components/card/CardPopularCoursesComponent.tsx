import {useEffect, useState} from 'react';
import {useCourses} from '../../hooks/useCourses';
import {useUser} from '../../hooks/useUser';
import {useNavigate} from 'react-router-dom';
import CardCourseComponent from './CardCourseComponent';
import {Course} from '../../types/course';

const CardPopularCoursesComponent: React.FC = () => {
    const {popularCourses, fetchAllCourses} = useCourses();
    const {currentUser, userRole} = useUser();
    const [loading, setLoading] = useState<boolean>(true);
    const navigate = useNavigate();

    useEffect(() => {
        const loadCourses = async () => {
            await fetchAllCourses(
                currentUser?.uid || null,
                userRole,
                'default',
                'popular',
                true,
                4
            );
            setLoading(false);
            console.log('All popular courses:', popularCourses);
        };

        loadCourses();
    }, [currentUser, userRole]);

    const renderedCourses = popularCourses.map((course: Course) => (
        <CardCourseComponent
            key={course.course_id}
            thumbnail={course.course_thumbnail_url}
            title={course.course_title}
            instructor={course.course_instructor}
            enrolledStudents={course.course_enrollment_number}
            buttonText='View Course'
            onButtonClick={() =>
                navigate(`/selectedcourse/${course.course_id}`)
            }
            size='sm'
        />
    ));

    return (
        <>
            <div className='mt-10'>
                <h4 className='font-abhaya text-2xl font-bold'>
                    Our Popular <span className='text-secondary'>Courses</span>
                </h4>
            </div>
            {loading ? (
                <div className='flex justify-center items-center mt-6'>
                    <div className='animate-spin border-4 border-t-4 border-solid border-gray rounded-full h-16 w-16 border-t-primary'></div>
                </div>
            ) : (
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-1 mt-4 mb-10 gap-4'>
                    {renderedCourses}
                </div>
            )}
        </>
    );
};

export default CardPopularCoursesComponent;
