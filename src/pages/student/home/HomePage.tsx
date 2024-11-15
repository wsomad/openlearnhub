import React, {useEffect, useState} from 'react';
import HeaderComponent from '../../../components/HeaderComponent';
import SearchComponent from '../../../components/SearchComponent';
import CardCourseComponent from '../../../components/card/CardCourseComponent';
import thumbnail from '../../../assets/images/thumbnail.png';
import {useCourses} from '../../../hooks/useCourses';
import {useUser} from '../../../hooks/useUser';

function HomePage() {
    const {courses, fetchAllCourses} = useCourses();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadCourses = async () => {
            await fetchAllCourses();
            setLoading(false); // Set loading to false once data is fetched
        };
        loadCourses();
    }, []);

    useEffect(() => {
        console.log('List of courses:', courses);
    }, [courses]);

    const renderedCourses = courses.map((course) => (
        <CardCourseComponent
            key={course.course_title} // Add a unique key for each item
            thumbnail={thumbnail}
            title={course.course_title}
            instructor={course.course_instructor}
            pricing={course.course_pricing}
            buttonText='View Course'
            onButtonClick={() =>
                console.log('Navigating to Course Details page')
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
                        // mx-auto max-w-screen-2xl grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-6 mt-6 mb-6
                        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-6 my-6'>
                            {renderedCourses}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default HomePage;
