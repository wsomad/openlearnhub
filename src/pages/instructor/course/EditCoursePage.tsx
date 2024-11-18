import React from 'react';
import { useParams } from 'react-router-dom';

import CourseContentList from '../../../components/enrollment/course_list/CourseContentList';
import { useCourses } from './CourseContext';
import CreateCoursePage from './CreateCoursePage';

interface EditCoursePageProps {
    userId: string;
    userType: 'student' | 'instructor';
}

const EditCoursePage: React.FC<EditCoursePageProps> = ({userId, userType}) => {
    const {courseId} = useParams<{courseId: string}>();
    const {findCourseById} = useCourses();
    const course = courseId ? findCourseById(courseId) : null;

    if (!course) {
        return <div>Course not found</div>;
    }

    return (
        <div className='font-abhaya container mx-auto px-4 py-8'>
            <div className='mb-8'>
                <h1 className='text-3xl font-bold font-abhaya'>
                    Edit Course: {course.course_title}
                </h1>
                <p className='text-gray-600 mt-2 font-abhaya'>
                    Update your course details and manage content
                </p>
            </div>

            <div className='grid grid-cols-1 gap-8'>
                <div className='bg-white rounded-lg shadow-sm'>
                    <div className='p-6 border-b'>
                        <h2 className='text-2xl font-bold font-abhaya'>
                            Course Details
                        </h2>
                    </div>
                    <div className='p-6'>
                        <CreateCoursePage initialCourse={course} />
                    </div>
                </div>

                <div className='bg-white rounded-lg shadow-sm'>
                    <CourseContentList
                        userType={userType}
                        courseId={courseId}
                        userId={userId}
                    />
                </div>
            </div>
        </div>
    );
};

export default EditCoursePage;
