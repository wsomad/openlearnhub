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
import { useSections } from '../../../hooks/useSections';
import { useUser } from '../../../hooks/useUser';
import { clearSingleCourse } from '../../../store/slices/courseSlice';
import { Course } from '../../../types/course';
import { VideoLesson } from '../../../types/lesson';

const SelectedCoursePage: React.FC = () => {
    const {selectedCourse, fetchCourseById, updateCourse, deleteSingleCourse} =
        useCourses();
    const {currentUser, userRole} = useUser();
    const {resetSectionsState} = useSections();
    const {id} = useParams<{id: string}>();
    const [loading, setLoading] = useState(true);
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

    const handleEnrollementClick = async (
        e: React.MouseEvent<HTMLButtonElement>,
    ) => {
        e.preventDefault();

        const enrollmentNumber =
            (selectedCourse?.course_enrollment_number || 0) + 1;

        const updatedCourse = {
            ...selectedCourse,
            course_enrollment_number: enrollmentNumber,
        } as Course;

        try {
            const response = await updateCourse(id || '', updatedCourse);

            console.log(
                'Successfully update number of enrollment for this course',
                response,
            );
            navigate(`/enrolledcourse/${selectedCourse?.course_id}`);
        } catch (error) {
            console.error('Failed to update course enrollment number', error);
        }
    };

    {
        /* Calculate total duration */
    }
    const totalDuration =
        selectedCourse?.sections?.reduce((acc, section) => {
            return (
                acc +
                section.lessons.reduce((lessonAcc, lesson) => {
                    if ('video_duration' in lesson) {
                        return (
                            lessonAcc + (lesson as VideoLesson).video_duration
                        );
                    }
                    return lessonAcc;
                }, 0)
            );
        }, 0) || 0;

    const totalQuizzes =
        selectedCourse?.sections?.reduce((acc, section) => {
            return (
                acc +
                section.lessons.filter(
                    (lesson) => lesson.lesson_type === 'quiz',
                ).length
            );
        }, 0) || 0;

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
                            buttonText='Enroll'
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
                                className='bg-secondary font-abhaya font-semibold text-white py-2 px-4 mt-4'
                            >
                                Enroll Now
                            </button>
                        </div>
                    </div>

                    {/* Course Details */}
                    <div className='font-abhaya text-lg flex flex-row justify-start items-center mt-4'>
                        <div className='flex flex-row items-center mr-8'>
                            <RiTimer2Line className='mr-2' />
                            <p className='mr-4'>
                                {(totalDuration / 3600).toFixed(1)} hours
                            </p>
                        </div>
                        <div className='flex flex-row items-center mr-8'>
                            <HiOutlineDocumentText className='mr-2' />
                            <p className='mr-4'>
                                {selectedCourse?.course_number_of_section || 0}{' '}
                                sections
                            </p>
                        </div>
                        <div className='flex flex-row items-center'>
                            <MdQuiz className='mr-2' />
                            <p className='mr-4'>{totalQuizzes} quizzes</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SelectedCoursePage;
