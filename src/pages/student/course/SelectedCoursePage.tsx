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
                    <div className='flex justify-between items-start mt-6 gap-6'>
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
                            pricing={selectedCourse?.course_pricing || 'FREE'}
                            buttonText='Enroll'
                            onButtonClick={() =>
                                console.log('Navigating to Course Details page')
                            }
                            size='lg'
                        />
                        <div className='flex flex-col'>
                            <div className='py-4 border border-gray max-w-lg max-h-[550px] overflow-y-auto'>
                                {/* <div>
                                    <h2 className='font-abhaya px-6 text-2xl font-bold mb-2'>
                                        About Course
                                    </h2>
                                    <hr className='border-t gray opacity-15 mb-4' />
                                    <p className='font-abhaya  px-6 text-lg'>
                                        {selectedCourse?.course_description}
                                    </p>
                                    <ul className='font-abhaya  px-6 text-lg list-disc list-inside mt-4'>
                                        {renderedRequirements}
                                    </ul>
                                </div> */}
                                <CourseRequirements
                                    course_id={selectedCourse?.course_id || ''}
                                    course_requirements={
                                        selectedCourse?.course_requirements ||
                                        []
                                    }
                                ></CourseRequirements>
                            </div>
                            <button
                                onClick={handleEnrollementClick}
                                className='bg-secondary font-abhaya font-semibold text-white py-2 px-4 mt-6'
                            >
                                Enroll Now
                            </button>
                        </div>
                    </div>

                    {/* Course Details */}
                    <div className='flex flex-col my-5'>
                        <h5 className='font-abhaya text-2xl font-bold'>
                            This course includes
                        </h5>
                        <div className='font-abhaya text-lg flex flex-row justify-start items-center mt-4'>
                            {/* Duration */}
                            <div className='flex flex-row items-center mr-8'>
                                <RiTimer2Line className='mr-2' />
                                <p className='mr-4'>20.4 hours</p>
                            </div>
                            {/* Sections */}
                            <div className='flex flex-row items-center mr-8'>
                                <HiOutlineDocumentText className='mr-2' />
                                <p className='mr-4'>23 sections</p>
                            </div>
                            {/* Questions */}
                            <div className='flex flex-row items-center'>
                                <MdQuiz className='mr-2' />
                                <p className='mr-4'>25 questions</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SelectedCoursePage;
