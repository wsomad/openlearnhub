// pages/instructor/course/EditCoursePage.tsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import CourseContentList from '../../../components/enrollment/course_list/CourseContentList';
import { Course } from '../../../types/Course';
import CreateCoursePage from './CreateCoursePage';

interface EditCoursePageProps {
    userId: string;
    userType: 'student' | 'instructor';
}

const EditCoursePage: React.FC<EditCoursePageProps> = ({userId, userType}) => {
    const {courseId} = useParams<{courseId: string}>();
    const [course, setCourse] = useState<Course | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCourseData = async () => {
            try {
                setIsLoading(true);
                const response = await fetch('/dummyData.json');
                const data = await response.json();

                const foundCourse = data.courses.find(
                    (c: Course) => c.course_id === courseId,
                );

                if (!foundCourse) {
                    throw new Error('Course not found');
                }

                setCourse(foundCourse);
            } catch (err) {
                setError(
                    err instanceof Error
                        ? err.message
                        : 'Failed to load course',
                );
            } finally {
                setIsLoading(false);
            }
        };

        if (courseId) {
            fetchCourseData();
        }
    }, [courseId]);

    if (isLoading) {
        return (
            <div className='flex justify-center items-center min-h-screen'>
                Loading...
            </div>
        );
    }

    if (error || !courseId) {
        return (
            <div className='flex justify-center items-center min-h-screen text-red-500'>
                {error || 'Invalid course ID'}
            </div>
        );
    }

    return (
        <div className='font-abhaya container mx-auto px-4 py-8'>
            {/* Page Header */}
            <div className='mb-8'>
                <h1 className='text-3xl font-bold font-abhaya'>
                    Edit Course: {course?.course_title}
                </h1>
                <p className='text-gray-600 mt-2 font-abhaya'>
                    Update your course details and manage content
                </p>
            </div>

            {/* Content Grid */}
            <div className='grid grid-cols-1 gap-8'>
                {/* Course Details Section */}
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

                {/* Course Content Section */}
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
