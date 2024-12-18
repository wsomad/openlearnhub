import React, { useCallback, useEffect, useState } from 'react';
import { HiOutlineDocumentText } from 'react-icons/hi';
import { MdQuiz } from 'react-icons/md';
import { RiTimer2Line } from 'react-icons/ri';
import { useNavigate, useParams } from 'react-router-dom';

import CardCourseComponent from '../../../components/card/CardCourseComponent';
import CourseRequirements from '../../../components/enrollment/CourseRequirements';
import HeaderComponent from '../../../components/HeaderComponent';
import { useCourses } from '../../../hooks/useCourses';
import { useLessons } from '../../../hooks/useLessons';
import { useSections } from '../../../hooks/useSections';
import { useUser } from '../../../hooks/useUser';
import { Course } from '../../../types/course';
import { VideoLesson } from '../../../types/lesson';
import { Section } from '../../../types/section';

const SelectedCoursePage: React.FC = () => {
    const {currentUser, userRole, updateUser} = useUser();
    const {selectedCourse, fetchCourseById, updateCourse, deleteSingleCourse} =
        useCourses();
    const {fetchAllSections, resetSectionsState} = useSections();
    const {fetchLessonsForSection} = useLessons();
    const {id} = useParams<{id: string}>();
    const [loading, setLoading] = useState(true);
    const [isEnrolled, setIsEnrolled] = useState(false);
    const navigate = useNavigate();

    const calculateTotalDuration = useCallback(
        (sections?: Section[]): number => {
            if (!sections) return 0;
            let totalMinutes = 0;

            sections.forEach((section) => {
                if (!section.lessons) return;
                section.lessons.forEach((lesson) => {
                    if (lesson.lesson_type === 'video') {
                        const duration = (lesson as VideoLesson).video_duration;
                        if (typeof duration === 'number') {
                            totalMinutes += duration;
                        }
                    }
                });
            });

            return Number((totalMinutes / 60).toFixed(1)); // Convert minutes to hours
        },
        [],
    );

    const calculateTotalQuizzes = useCallback(
        (sections?: Section[]): number => {
            if (!sections) return 0;
            let quizCount = 0;

            sections.forEach((section) => {
                if (!section.lessons) return;
                section.lessons.forEach((lesson) => {
                    if (lesson.lesson_type === 'quiz') {
                        quizCount++;
                    }
                });
            });

            return quizCount;
        },
        [],
    );

    useEffect(() => {
        const loadCourseData = async () => {
            if (!id || !currentUser?.uid) return;

            try {
                setLoading(true);
                await fetchCourseById(id, currentUser.uid, userRole);
                await fetchAllSections(id);

                if (selectedCourse?.sections) {
                    const lessonPromises = selectedCourse.sections.map(
                        (section) =>
                            fetchLessonsForSection(section.section_id, id),
                    );
                    await Promise.all(lessonPromises);
                }
            } catch (error) {
                // Handle error silently
            } finally {
                setLoading(false);
            }
        };

        loadCourseData();
    }, [id, currentUser?.uid, userRole]);

    useEffect(() => {
        return () => {
            deleteSingleCourse();
            resetSectionsState();
        };
    }, []); // Empty dependency array for cleanup

    useEffect(() => {
        if (!currentUser?.student || !selectedCourse?.course_id) return;
        const isAlreadyEnrolled =
            currentUser.student.enrolled_courses?.includes(
                selectedCourse.course_id,
            );
        setIsEnrolled(!!isAlreadyEnrolled);
    }, [currentUser?.student, selectedCourse?.course_id]); // Optimized dependencies

    const handleEnrollementClick = async (
        e: React.MouseEvent<HTMLButtonElement>,
    ) => {
        e.preventDefault();
        if (!currentUser || !selectedCourse || !id) return;

        if (isEnrolled) {
            navigate(`/enrolledcourse/${selectedCourse.course_id}`);
            return;
        }

        try {
            const updatedCourse = {
                ...selectedCourse,
                course_enrollment_number:
                    (selectedCourse.course_enrollment_number || 0) + 1,
                enrolled_students: [
                    ...(selectedCourse.enrolled_students || []),
                    currentUser.uid,
                ],
            } as Course;

            const updatedUser = {
                ...currentUser,
                student: {
                    ...(currentUser.student || {}),
                    enrolled_courses: [
                        ...(currentUser.student?.enrolled_courses || []),
                        selectedCourse.course_id,
                    ],
                },
            };

            await Promise.all([
                updateCourse(id, updatedCourse),
                updateUser(currentUser.uid, updatedUser),
            ]);

            setIsEnrolled(true);
            navigate(`/enrolledcourse/${selectedCourse.course_id}`);
        } catch (error) {
            // Handle error silently
        }
    };

    if (loading) {
        return (
            <div className='flex justify-center items-center min-h-screen'>
                <p className='text-xl'>Loading course data...</p>
            </div>
        );
    }

    const totalDuration = calculateTotalDuration(selectedCourse?.sections);
    const totalQuizzes = calculateTotalQuizzes(selectedCourse?.sections);
    const totalSections = selectedCourse?.course_number_of_section || 0;

    return (
        <div>
            <HeaderComponent />
            <div className='px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12'>
                <div className='max-w-screen-xl w-full mx-auto'>
                    <div className='flex flex-col justify-start items-start mt-6'>
                        <h1 className='font-abhaya font-bold text-6xl'>
                            {selectedCourse?.course_title || 'Course Title'}
                        </h1>
                        <p className='font-abhaya font-semibold text-lg'>
                            {selectedCourse?.course_description ||
                                'Course Description'}
                        </p>
                    </div>

                    <div className='flex gap-8 items-start mt-6'>
                        <CardCourseComponent
                            thumbnail={
                                selectedCourse?.course_thumbnail_url || ''
                            }
                            title={
                                selectedCourse?.course_title || 'Course Title'
                            }
                            instructor={
                                selectedCourse?.course_instructor ||
                                'Course Instructor'
                            }
                            pricing={'FREE'}
                            buttonText={
                                isEnrolled ? 'Enrolled' : 'Not Enrolled'
                            }
                            onButtonClick={() => {}}
                            size='lg'
                        />
                        <div className='flex flex-col flex-1 max-w-xl h-[550px]'>
                            <div className='flex-1 py-4 border border-gray overflow-y-auto'>
                                <CourseRequirements
                                    course_id={selectedCourse?.course_id || ''}
                                    course_requirements={
                                        selectedCourse?.course_requirements ||
                                        []
                                    }
                                />
                            </div>
                            <button
                                onClick={handleEnrollementClick}
                                className={`font-abhaya font-semibold text-white py-2 px-4 mt-4 ${
                                    isEnrolled ? 'bg-primary' : 'bg-secondary'
                                }`}
                            >
                                {isEnrolled
                                    ? 'Continue Learning'
                                    : 'Enroll Now'}
                            </button>
                        </div>
                    </div>

                    <div className='font-abhaya text-lg flex flex-row justify-start items-center mt-4'>
                        <div className='flex flex-row items-center mr-8'>
                            <RiTimer2Line className='mr-2' />
                            <p className='mr-4'>
                                {totalDuration > 0
                                    ? `${totalDuration} hours`
                                    : 'No duration'}
                            </p>
                        </div>
                        <div className='flex flex-row items-center mr-8'>
                            <HiOutlineDocumentText className='mr-2' />
                            <p className='mr-4'>
                                {totalSections}{' '}
                                {totalSections === 1 ? 'section' : 'sections'}
                            </p>
                        </div>
                        <div className='flex flex-row items-center'>
                            <MdQuiz className='mr-2' />
                            <p className='mr-4'>
                                {totalQuizzes}{' '}
                                {totalQuizzes === 1 ? 'quiz' : 'quizzes'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SelectedCoursePage;
