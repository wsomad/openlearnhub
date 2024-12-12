import React, { useEffect, useState } from 'react';
import { HiOutlineDocumentText } from 'react-icons/hi';
import { MdQuiz } from 'react-icons/md';
import { RiTimer2Line } from 'react-icons/ri';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import thumbnail from '../../../assets/images/thumbnail.png';
import CardCourseComponent from '../../../components/card/CardCourseComponent';
import CardDashboard from '../../../components/CardInstructor';
import CourseRequirements from '../../../components/enrollment/CourseRequirements';
import HeaderComponent from '../../../components/HeaderComponent';
import { useCourses } from '../../../hooks/useCourses';
import { useLessons } from '../../../hooks/useLessons';
import { useSections } from '../../../hooks/useSections';
import { useUser } from '../../../hooks/useUser';
import { clearSingleCourse } from '../../../store/slices/courseSlice';
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
    const dispatch = useDispatch();
    const currentState = useSelector((state) => state);
    console.log(
        '[Selected Course Page] Current State from Selector:',
        currentState,
    );

    useEffect(() => {
        const loadCourse = async () => {
            if (id && currentUser?.uid) {
                await fetchCourseById(id, currentUser?.uid, userRole);
                console.log('Currently in selected course page.');
                setLoading(false);
            }
        };
        loadCourse();
    }, [currentUser, userRole]);

    useEffect(() => {
        return () => {
            deleteSingleCourse();
            resetSectionsState();
        };
    }, [dispatch]);

    useEffect(() => {
        const loadCourseData = async () => {
            if (id && currentUser?.uid) {
                // First fetch the course
                await fetchCourseById(id, currentUser?.uid, userRole);
                console.log('Course Data:', selectedCourse);

                // Then fetch all sections
                await fetchAllSections(id);

                // If we have sections, fetch lessons for each section
                if (selectedCourse?.sections) {
                    for (const section of selectedCourse.sections) {
                        await fetchLessonsForSection(section.section_id, id);
                    }
                }

                // Now log all the data
                console.log(
                    'Selected Course after fetching all data:',
                    selectedCourse,
                );
                console.log('Sections:', selectedCourse?.sections);

                // Calculate and log metrics
                const totalDuration = calculateTotalDuration(
                    selectedCourse?.sections,
                );
                const totalQuizzes = calculateTotalQuizzes(
                    selectedCourse?.sections,
                );

                console.log('Total Duration (seconds):', totalDuration);
                console.log(
                    'Total Duration (hours):',
                    (totalDuration / 3600).toFixed(1),
                );
                console.log(
                    'Number of Sections:',
                    selectedCourse?.sections?.length,
                );
                console.log('Number of Quizzes:', totalQuizzes);

                setLoading(false);
            }
        };

        loadCourseData();
    }, [currentUser, userRole, id]);

    useEffect(() => {
        const checkEnrollmentStatus = () => {
            if (!currentUser?.student || !selectedCourse?.course_id) return;

            const isAlreadyEnrolled =
                currentUser.student.enrolled_courses?.includes(
                    selectedCourse.course_id,
                );
            setIsEnrolled(!!isAlreadyEnrolled);
        };

        checkEnrollmentStatus();
    }, [currentUser, selectedCourse]);

    // const handleEnrollementClick = async (
    //     e: React.MouseEvent<HTMLButtonElement>,
    // ) => {
    //     e.preventDefault();

    //     const enrollmentNumber =
    //         (selectedCourse?.course_enrollment_number || 0) + 1;

    //     const updatedCourse = {
    //         ...selectedCourse,
    //         course_enrollment_number: enrollmentNumber,
    //     } as Course;

    //     try {
    //         const response = await updateCourse(id || '', updatedCourse);

    //         console.log(
    //             'Successfully update number of enrollment for this course',
    //             response,
    //         );
    //         navigate(`/enrolledcourse/${selectedCourse?.course_id}`);
    //     } catch (error) {
    //         console.error('Failed to update course enrollment number', error);
    //     }
    // };

    const handleEnrollementClick = async (
        e: React.MouseEvent<HTMLButtonElement>,
    ) => {
        e.preventDefault();

        if (!currentUser || !selectedCourse || !id) return;

        // If already enrolled, just navigate to course
        if (isEnrolled) {
            navigate(`/enrolledcourse/${selectedCourse.course_id}`);
            return;
        }

        try {
            // Update course data
            const updatedCourse = {
                ...selectedCourse,
                course_enrollment_number:
                    (selectedCourse.course_enrollment_number || 0) + 1,
                enrolled_students: [
                    ...(selectedCourse.enrolled_students || []),
                    currentUser.uid,
                ],
            } as Course;

            // Update student data
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

            // Update both course and user data
            await Promise.all([
                updateCourse(id, updatedCourse),
                updateUser(currentUser.uid, updatedUser),
            ]);

            setIsEnrolled(true);
            navigate(`/enrolledcourse/${selectedCourse.course_id}`);
        } catch (error) {
            console.error('Failed to enroll in course:', error);
        }
    };

    {
        /* Calculate total duration */
    }
    // Calculate total duration from video lessons
    const calculateTotalDuration = (sections?: Section[]): number => {
        if (!sections) return 0;

        return sections.reduce((acc, section) => {
            if (!section.lessons) return acc;

            return (
                acc +
                section.lessons.reduce((lessonAcc, lesson) => {
                    if (lesson.lesson_type === 'video') {
                        return (
                            lessonAcc + (lesson as VideoLesson).video_duration
                        );
                    }
                    return lessonAcc;
                }, 0)
            );
        }, 0);
    };

    // Calculate total number of quizzes
    const calculateTotalQuizzes = (sections?: Section[]): number => {
        if (!sections) return 0;

        return sections.reduce((acc, section) => {
            if (!section.lessons) return acc;

            return (
                acc +
                section.lessons.filter(
                    (lesson) => lesson.lesson_type === 'quiz',
                ).length
            );
        }, 0);
    };

    const totalDuration = calculateTotalDuration(selectedCourse?.sections);
    const totalQuizzes = calculateTotalQuizzes(selectedCourse?.sections);
    const totalSections = selectedCourse?.sections?.length || 0;

    return (
        <div>
            <HeaderComponent />
            <div className='px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12'>
                <div className='max-w-screen-xl w-full mx-auto'>
                    {/* Course Title & Description */}
                    <div className='flex flex-col justify-start items-start mt-6'>
                        <h1 className='font-abhaya font-bold text-6xl'>
                            {selectedCourse?.course_title || 'Course Title'}
                        </h1>
                        <p className='font-abhaya font-semibold text-lg'>
                            {selectedCourse?.course_description ||
                                'Course Description'}
                        </p>
                    </div>

                    {/* Course Card and Requirements Section */}
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
                            onButtonClick={() =>
                                console.log('Navigating to Course Details page')
                            }
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

                    {/* Course Details */}
                    <div className='font-abhaya text-lg flex flex-row justify-start items-center mt-4'>
                        <div className='flex flex-row items-center mr-8'>
                            <RiTimer2Line className='mr-2' />
                            <p className='mr-4'>
                                {totalDuration > 0
                                    ? `${(totalDuration / 3600).toFixed(
                                          1,
                                      )} hours`
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
