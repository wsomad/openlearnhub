import React, {useEffect, useState} from 'react';
import CardCourseComponent from '../../../components/card/CardCourseComponent';
import HeaderComponent from '../../../components/HeaderComponent';
import SearchComponent from '../../../components/SearchComponent';
import {useCourses} from '../../../hooks/useCourses';
import {useUser} from '../../../hooks/useUser';
import {Course} from '../../../types/course';
import {useNavigate} from 'react-router-dom';
import {useSelector} from 'react-redux';
import CardInstructorInvitation from '../../../components/card/CardInstructorInvitation';

const HomePage: React.FC = () => {
    const {allCourses, fetchAllCourses} = useCourses();
    const {currentUser, userRole} = useUser();
    const [loading, setLoading] = useState<boolean>(true);
    const navigate = useNavigate();
    const currentState = useSelector((state) => state);
    console.log('Current State from Selector:', currentState);
    console.log('Current user role:', userRole);

    useEffect(() => {
        const loadCourses = async () => {
            await fetchAllCourses(
                currentUser?.uid || null,
                userRole,
                'default',
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
            size='small'
        />
    ));

    return (
        <div>
            <HeaderComponent />
            <div className='flex flex-col justify-center items-center mt-12'>
                <h1 className='font-abhaya font-bold text-6xl'>
                    Find All <span className='text-primary'>Free Courses</span>{' '}
                    You Can Enroll Here
                </h1>
                <p className='font-abhaya font-semibold text-lg'>
                    Technology and the world of work change fast — with us,
                    you're faster. Get the skills to achieve goals and stay
                    competitive.
                </p>
            </div>
            <SearchComponent />
            <hr className='border-t gray mt-12 opacity-15' />
            <div className='px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12'>
                <div className='max-w-screen-xl w-full mx-auto'>
                    <>
                        <div className='mt-10'>
                            <h4 className='font-abhaya text-2xl font-bold'>
                                Our Latest{' '}
                                <span className='text-secondary'>Courses</span>
                            </h4>
                        </div>

                        {/* Loading state */}
                        {loading ? (
                            <div className='flex justify-center items-center mt-6'>
                                <div className='animate-spin border-4 border-t-4 border-solid border-gray rounded-full h-16 w-16 border-t-primary'></div>
                            </div>
                        ) : (
                            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-6 my-6'>
                                {renderedCourses}
                            </div>
                        )}
                    </>
                    <>
                        <div className='mt-10'>
                            <h4 className='font-abhaya text-2xl font-bold'>
                                Get Started with Different {''}
                                <span className='text-secondary'>Role</span>
                            </h4>
                        </div>
                        <CardInstructorInvitation></CardInstructorInvitation>
                    </>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
