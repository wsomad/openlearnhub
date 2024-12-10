import { useEffect, useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import { Link } from 'react-router-dom';

import { useCourses } from '../../hooks/useCourses';
import { useUser } from '../../hooks/useUser';
import { Course } from '../../types/course';
import { User } from '../../types/user';
import CardInstructor from '../CardInstructor';
import DeleteCourseModal from '../modal/DeleteCourseModal';

const CardInstructorDashboard: React.FC = () => {
    const {allCourses, fetchAllCourses, deleteCourse} = useCourses();
    const {updateUser} = useUser();
    const {currentUser, userRole} = useUser();
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
    const [selectedCourseId, setSelectedCourseId] = useState<string | null>(
        null,
    );

    // Run side effect to fetch all courses created by the instructor.
    useEffect(() => {
        const loadInstructorData = async () => {
            if (!currentUser || !userRole) return;
            await fetchAllCourses(
                currentUser?.uid,
                'instructor',
                'creator',
                'newest',
            );
        };
        loadInstructorData();
    }, [currentUser, userRole]);

    // Run side effect to update instructor's total courses created.
    useEffect(() => {
        if (!allCourses || !currentUser?.uid) {
            return;
        }
        const calculateTotalCourses = allCourses.filter(
            (course) => course.instructor_id === currentUser.uid,
        );
        const totalCourses = calculateTotalCourses.length;
        const loadInstructorData = async () => {
            if (currentUser.uid) {
                await updateUser(currentUser.uid, {
                    'instructor.total_courses_created': totalCourses,
                } as Partial<User>);
            }
        };
        loadInstructorData();
    }, [allCourses, currentUser, userRole]);

    // Handle click for delete course.
    const handleDeleteClick = (courseId: string) => {
        setSelectedCourseId(courseId);
        setIsDeleteModalOpen(true);
    };

    // Handle delete course.
    const handleDeleteCourse = async () => {
        try {
            await deleteCourse(selectedCourseId || '');
            // if (currentUser?.uid) {
            //     await fetchAllCourses(currentUser?.uid, 'instructor', 'creator', 'newest');
            // }
            if (currentUser?.uid) {
                await fetchAllCourses(
                    currentUser?.uid,
                    'instructor',
                    'creator',
                    'newest',
                );
                // Update the instructor's total courses count
                const updatedTotalCourses =
                    (currentUser?.instructor?.total_courses_created || 0) - 1;
                await updateUser(currentUser.uid, {
                    'instructor.total_courses_created': updatedTotalCourses,
                } as Partial<User>);
            }
            setIsDeleteModalOpen(false);
            setSelectedCourseId(null);
            window.location.reload();
        } catch (error) {
            console.error('Failed to delete course:', error);
        }
    };

    // Map all courses to render them.
    const renderedCourses = allCourses.map((course: Course) => (
        <CardInstructor
            key={course.course_id}
            id={course.course_id}
            thumbnailUrl={course.course_thumbnail_url}
            title={course.course_title}
            description={course.course_description}
            updatedAt={course.course_updated_at}
            readyForPublish={course.ready_for_publish || false}
            onDelete={handleDeleteClick}
        />
    ));

    return (
        <div className='space-y-6'>
            <p className='font-abhaya text-2xl font-bold text-primary'>
                {currentUser?.instructor?.total_courses_created || 0} Courses
                Created
            </p>
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
                <Link
                    to='/instructor/dashboard/course/create'
                    className='bg-white border-2 border-dashed border-gray-300 p-4 flex flex-col items-center justify-center space-y-3 hover:border-primary hover:bg-gray-50 transition-colors cursor-pointer min-h-[250px]'
                >
                    <div className='w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center'>
                        <FaPlus className='w-6 h-6 text-primary' />
                    </div>
                    <h3 className='text-2xl font-semibold font-abhaya text-primary'>
                        New Course
                    </h3>
                    <p className='text-gray-500 text-center text-base font-abhaya'>
                        Create a new course
                    </p>
                </Link>
                {renderedCourses}
            </div>
            {isDeleteModalOpen && (
                <DeleteCourseModal
                    isOpen={isDeleteModalOpen}
                    courseTitle={
                        allCourses.find(
                            (course) => course.course_id === selectedCourseId,
                        )?.course_title || ''
                    }
                    onClose={() => setIsDeleteModalOpen(false)}
                    onConfirm={handleDeleteCourse}
                />
            )}
        </div>
    );
};

export default CardInstructorDashboard;
