import React, { useEffect, useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import { Link } from 'react-router-dom';

import { Course } from '../../../types/Course';
import { UserProfile } from '../../../types/Profile';

interface CourseDashboardProps {
    userId: string;
}

const CourseDashboardPage: React.FC<CourseDashboardProps> = ({userId}) => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchIntructorCourses = async () => {
            try {
                setIsLoading(true);
                const response = await fetch('/dummyData.json');
                const data = await response.json();

                // Find instructor
                const instructor = data.users.find(
                    (u: UserProfile) => u.uid === userId,
                );
                if (!instructor?.instructorProfile) {
                    throw new Error('Instructor not found!');
                }

                // Get instructor courses
                const instructorCourses = data.courses.filter(
                    (course: Course) =>
                        instructor.instructorProfile?.created_courses.includes(
                            course.course_id,
                        ),
                );

                setCourses(instructorCourses);
            } catch (err) {
                setError(
                    err instanceof Error
                        ? err.message
                        : 'Failed to load courses',
                );
            } finally {
                setIsLoading(false);
            }
        };

        fetchIntructorCourses();
    }, [userId]);

    if (isLoading) {
        return (
            <div className='flex justify-center items-center h-screen'>
                Loading ...
            </div>
        );
    }

    if (error) {
        return <div className='text-red text-center'>Error: {error}</div>;
    }

    return (
        <div className='font-abhaya container mx-auto px-4 py-8'>
            {/* Dashboard Header */}
            <div className='mb-8'>
                <h1 className='text-5xl font-bold font-abhaya mb-2'>
                    Course Dashboard
                </h1>
                <p className='text-xl text-gray-600'>
                    Manage your courses and create new ones
                </p>
                <p className='text-2xl text-primary mt-6'>3 Courses Created</p>
            </div>

            {/* Course Grid */}
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                {/* Create New Course Card */}
                <Link
                    to='/instructor/courses/create'
                    className='bg-white rounded-lg border-2 border-dashed border-gray-300 p-6 flex flex-col items-center justify-center space-y-4 hover:border-primary hover:bg-gray-50 transition-colors cursor-pointer min-h-[300px]'
                >
                    <div className='w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center'>
                        <FaPlus className='w-8 h-8 text-primary' />
                    </div>
                    <h3 className='text-3xl font-semibold font-abhaya text-primary'>
                        Create New Course
                    </h3>
                    <p className='text-gray-500 text-center font-abhaya'>
                        Start building a new course for your students
                    </p>
                </Link>

                {/* Existing Courses */}
                {courses.map((course) => (
                    <div
                        key={course.course_id}
                        className='bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow'
                    >
                        {/* Course Image */}
                        <img
                            src={course.course_thumbnail_url}
                            alt={course.course_title}
                            className='w-full h-40 object-cover'
                        />

                        {/* Course Info */}
                        <div className='p-6'>
                            <h3 className='text-xl font-semibold font-abhaya mb-2'>
                                {course.course_title}
                            </h3>
                            <p className='text-gray-600 mb-4 line-clamp-2 font-abhaya'>
                                {course.course_description}
                            </p>

                            {/* Course Stats */}
                            <div className='grid grid-cols-2 gap-4 mb-4'>
                                <div>
                                    <p className='text-gray-500 text-sm font-abhaya'>
                                        Students
                                    </p>
                                    <p className='text-lg font-semibold font-abhaya'>
                                        {course.course_enrollment_number}
                                    </p>
                                </div>
                                <div>
                                    <p className='text-gray-500 text-sm font-abhaya'>
                                        Sections
                                    </p>
                                    <p className='text-lg font-semibold font-abhaya'>
                                        {course.course_number_of_section}
                                    </p>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className='flex space-x-2'>
                                <Link
                                    to={`/instructor/courses/${course.course_id}/edit`}
                                    className='flex-1 bg-primary text-white text-center py-2 rounded-md hover:bg-primary-dark transition-colors font-abhaya'
                                >
                                    Edit
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CourseDashboardPage;