import React from 'react';
import HeaderComponent from '../../../components/HeaderComponent';
import CardCourseComponent from '../../../components/card/CardCourseComponent';
import thumbnail from '../../../assets/images/thumbnail.png';

function ListEnrolledCoursePage() {
    const dummyCourses = [
        {
            course_title: 'React for Beginners',
            course_instructor: 'John Doe',
            course_pricing: '$19.99',
        },
        {
            course_title: 'Advanced JavaScript',
            course_instructor: 'Jane Smith',
            course_pricing: '$29.99',
        },
        {
            course_title: 'Web Development Bootcamp',
            course_instructor: 'Alex Johnson',
            course_pricing: '$39.99',
        },
        {
            course_title: 'Full Stack Developer Course',
            course_instructor: 'Emma Brown',
            course_pricing: '$49.99',
        },
        {
            course_title: 'UX/UI Design Fundamentals',
            course_instructor: 'James Lee',
            course_pricing: '$24.99',
        },
        {
            course_title: 'Python for Data Science',
            course_instructor: 'Linda Green',
            course_pricing: '$34.99',
        },
        {
            course_title: 'Machine Learning with TensorFlow',
            course_instructor: 'Chris Harris',
            course_pricing: '$44.99',
        },
    ];

    const totalCoursesEnrolled = dummyCourses.length;

    return (
        <div>
            <HeaderComponent />
            <div className='px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12'>
                <div className='max-w-screen-xl w-full mx-auto'>
                    <div className='flex flex-col justify-start items-start mt-6'>
                        <h1 className='font-abhaya font-bold text-5xl'>
                            Course Enrolled
                        </h1>
                        <p className='font-abhaya text-lg'>
                            Here are the courses you've enrolled in.
                        </p>
                        <p className='font-abhaya font-semibold text-lg text-secondary mt-6'>
                            {totalCoursesEnrolled} Courses Enrolled
                        </p>
                    </div>

                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-5 mt-6'>
                        {dummyCourses.map((course, index) => (
                            <CardCourseComponent
                                key={index}
                                thumbnail={thumbnail}
                                title={course.course_title}
                                instructor={course.course_instructor}
                                pricing={course.course_pricing}
                                buttonText='Continue'
                                onButtonClick={() =>
                                    console.log(
                                        'Navigating to Course Details page',
                                    )
                                }
                                size='small'
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ListEnrolledCoursePage;
