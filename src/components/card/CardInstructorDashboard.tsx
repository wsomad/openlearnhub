import { useEffect, useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import { Link } from 'react-router-dom';

import { useCourses } from '../../hooks/useCourses';
import { useLessons } from '../../hooks/useLessons';
import { useSections } from '../../hooks/useSections';
import { useUser } from '../../hooks/useUser';
import { Course } from '../../types/course';
import { User } from '../../types/user';
import CardInstructor from '../CardInstructor';
import DeleteCourseModal from '../modal/DeleteCourseModal';

const CardInstructorDashboard: React.FC = () => {
    const {allCourses, fetchAllCourses, deleteCourse} = useCourses();
    const {fetchAllSections, deleteSection, allSections} = useSections();
    const {fetchLessonsForSection, deleteLesson} = useLessons();
    const {updateUser} = useUser();
    const {currentUser, userRole} = useUser();
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
    const [selectedCourseId, setSelectedCourseId] = useState<string | null>(
        null,
    );

    useEffect(() => {
        const loadInstructorData = async () => {
            if (!currentUser?.uid || !userRole) return;

            // First fetch all courses
            await fetchAllCourses(
                currentUser.uid,
                'instructor',
                'creator',
                'newest',
            );

            // Then update the total count only if we have courses
            if (allCourses) {
                const totalCourses = allCourses.filter(
                    (course) => course.instructor_id === currentUser.uid,
                ).length;

                await updateUser(currentUser.uid, {
                    'instructor.total_courses_created': totalCourses,
                } as Partial<User>);
            }
        };
        loadInstructorData();
    }, [currentUser, userRole, allCourses]);

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
            // window.location.reload();
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
        <>
            <div className='space-y-4 min-h-screen bg-gray-50 p-4 lg:p-6'>
                <p className='font-abhaya text-xl lg:text-2xl font-bold text-primary mb-4 lg:mb-6'>
                    {currentUser?.instructor?.total_courses_created || 0}{' '}
                    Courses Created
                </p>

                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 lg:gap-6'>
                    <Link
                        to='/instructor/dashboard/course/create'
                        className='bg-white border-2 border-dashed border-gray-300 overflow-hidden shadow-sm hover:shadow-md transition-shadow h-full flex items-center justify-center p-4 lg:p-6'
                    >
                        <div className='flex flex-col items-center space-y-2 lg:space-y-3'>
                            <div className='w-12 h-12 lg:w-14 lg:h-14 rounded-full bg-primary/10 flex items-center justify-center'>
                                <FaPlus className='w-5 h-5 lg:w-6 lg:h-6 text-primary' />
                            </div>
                            <h3 className='text-lg lg:text-xl font-semibold font-abhaya text-primary'>
                                New Course
                            </h3>
                            <p className='text-sm lg:text-base text-gray-500 text-center font-abhaya'>
                                Create a new course
                            </p>
                        </div>
                    </Link>

                    {renderedCourses}
                </div>
            </div>

            {isDeleteModalOpen && (
                <div className='fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center'>
                    <div className='relative w-full max-w-md mx-4'>
                        <DeleteCourseModal
                            isOpen={isDeleteModalOpen}
                            courseTitle={
                                allCourses.find(
                                    (course) =>
                                        course.course_id === selectedCourseId,
                                )?.course_title || ''
                            }
                            onClose={() => setIsDeleteModalOpen(false)}
                            onConfirm={handleDeleteCourse}
                        />
                    </div>
                </div>
            )}
        </>
    );
};

export default CardInstructorDashboard;
