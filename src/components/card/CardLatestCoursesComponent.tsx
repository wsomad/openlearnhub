import {useEffect, useState} from 'react';
import {useCourses} from '../../hooks/useCourses';
import {useUser} from '../../hooks/useUser';
import {useNavigate} from 'react-router-dom';
import CardCourseComponent from './CardCourseComponent';
import {Course} from '../../types/course';

const CardLatestCoursesComponent: React.FC = () => {
    const {allCourses, fetchAllCourses} = useCourses();
    const {currentUser, userRole} = useUser();
    const [loading, setLoading] = useState<boolean>(true);
    const navigate = useNavigate();

    useEffect(() => {
        const loadCourses = async () => {
            await fetchAllCourses(
                currentUser?.uid || null,
                userRole,
                'default',
                'newest',
                true,
                8,
            );
            setLoading(false);
        };
        loadCourses();
    }, [currentUser, userRole]);

    const renderedCourses = allCourses.map((course: Course) => (
        <CardCourseComponent
            key={course.course_id}
            thumbnail={course.course_thumbnail_url}
            title={course.course_title}
            instructor={course.course_instructor}
            pricing={course.course_pricing}
            buttonText='View Course'
            onButtonClick={() =>
                navigate(`/selectedcourse/${course.course_id}`)
            }
            size='sm'
        />
    ));

    return (
        <>
            <div>
                <h4 className='font-abhaya text-2xl font-bold'>
                    Our Latest <span className='text-secondary'>Courses</span>
                </h4>
            </div>
            {loading ? (
                <div className='flex justify-center items-center mt-6'>
                    <div className='animate-spin border-4 border-t-4 border-solid border-gray rounded-full h-16 w-16 border-t-primary'></div>
                </div>
            ) : (
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 mt-4 mb-10 gap-4'>
                    {renderedCourses}
                </div>
            )}
        </>
    );
};

export default CardLatestCoursesComponent;
