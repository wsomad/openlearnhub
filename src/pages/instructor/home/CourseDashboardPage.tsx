import React, { useEffect, useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import { Link } from 'react-router-dom';

import CardDashboard from '../../../components/CardDashboard';
import { Course } from '../../../types/course';
import { Instructor } from '../../../types/instructor';
import { User } from '../../../types/user';
import { useCourses } from '../course/CourseContext';

interface CourseDashboardProps {
    userId: string;
}

const CourseDashboardPage: React.FC<CourseDashboardProps> = ({userId}) => {
    const {findCoursesByInstructor, addCourse} = useCourses();
    const [coursesByInstructor, setCoursesByInstructor] = useState<Course[]>(
        [],
    );
    const [instructor, setInstructor] = useState<Instructor | null>(null);

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchInstructorData = async () => {
            try {
                setIsLoading(true);
                const response = await fetch('/dummyData.json');
                const data = await response.json();

                // Find instructor
                const user = data.users.find((u: User) => u.uid === userId);
                if (!user || user.role !== 'instructor' || !user.instructor) {
                    throw new Error('Instructor not found!');
                }
                const instructor = user.instructor as Instructor;

                // Get instructor courses using the useCourses hook
                const courses = findCoursesByInstructor(user.uid);
                setCoursesByInstructor(courses);
                setInstructor(instructor);
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

        fetchInstructorData();
    }, [userId, findCoursesByInstructor]);

    if (error) {
        return <div className='text-red text-center'>Error: {error}</div>;
    }

    return (
        <div className='font-abhaya container mx-auto px-4 py-8'>
            {/* Dashboard Header */}
            <div className='mb-8'>
                <h1 className='text-3xl sm:text-4xl md:text-5xl font-bold font-abhaya mb-2'>
                    Course Dashboard
                </h1>
                <p className='text-lg sm:text-xl text-gray-600'>
                    Manage your courses and create new ones
                </p>
                <p className='text-xl sm:text-2xl text-primary mt-6'>
                    {instructor?.total_courses_created || 0} Courses Created
                </p>
            </div>

            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
                {/* Create New Course Card */}
                <div className='col-span-1'>
                    <Link
                        to='/instructor/courses/create'
                        className='mt-6 w-full sm:w-[300px] min-h-[375px] bg-white mb-6 rounded-lg border-2 border-dashed border-gray-300 p-6 flex flex-col items-center justify-center space-y-0.5 hover:border-primary hover:bg-gray-50 transition-colors cursor-pointer'
                    >
                        <div className='w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center'>
                            <FaPlus className='w-4 h-4 text-primary' />
                        </div>
                        <h3 className='text-xl sm:text-2xl font-semibold font-abhaya text-primary text-center'>
                            Create New Course
                        </h3>
                        <p className='text-center font-abhaya'>
                            Start building a new course for your students
                        </p>
                    </Link>
                </div>

                {/* Existing Courses */}
                {coursesByInstructor.map((course) => (
                    <CardDashboard
                        key={course.course_id}
                        courseId={course.course_id}
                        thumbnailUrl={course.course_thumbnail_url}
                        title={course.course_title}
                        description={course.course_description}
                        pricing={course.course_pricing || 0}
                        enrollmentNumber={course.course_enrollment_number}
                        sectionsNumber={course.course_number_of_section}
                        editMode={true}
                    />
                ))}
            </div>
        </div>
    );
};

export default CourseDashboardPage;
