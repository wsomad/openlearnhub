import React, {useEffect, useState} from 'react';
import HeaderComponent from '../../../components/HeaderComponent';
import CardCourseComponent from '../../../components/card/CardCourseComponent';
import thumbnail from '../../../assets/images/thumbnail.png';
import {RiTimer2Line} from 'react-icons/ri';
import {HiOutlineDocumentText} from 'react-icons/hi';
import {MdQuiz} from 'react-icons/md';
import CourseContentList from '../../../components/enrollment/course_list/CourseContentList';
import CourseRequirements from '../../../components/enrollment/CourseRequirements';
import {Link, useParams} from 'react-router-dom';
import {useCourses} from '../../../hooks/useCourses';
import {useSections} from '../../../hooks/useSections';
import {useUser} from '../../../hooks/useUser';

const EnrolledCoursePage: React.FC = () => {
    const {selectedCourse, fetchCourseById} = useCourses();
    const {allSections, fetchAllSections} = useSections();
    const {currentUser, userRole} = useUser();
    const {id} = useParams<{id: string}>();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadCourse = async () => {
            if (id && currentUser?.uid) {
                await fetchCourseById(id, currentUser.uid, userRole);
                console.log('Currently in selected course page.');
                setLoading(false);
            }
        };
        loadCourse();
    }, [currentUser, userRole]);

    useEffect(() => {
        const loadSections = async () => {
            if (id) {
                await fetchAllSections(id);
                console.log(
                    `Successfully fetch all sections under ${id} course.`,
                );
            }
        };
        loadSections();
    }, [id, currentUser, userRole]);

    return (
        <div>
            <HeaderComponent />
            <div>
                {/* <div className='px-4 sm:px-6 md:px-8 lg:px-10 xl:px-10'> */}
                <div className='w-screen-xl h-full w-full justify-between'>
                    <div className='flex justify-between items-start'>
                        <CardCourseComponent
                            thumbnail={thumbnail}
                            title={
                                selectedCourse?.course_title || 'Course Title'
                            }
                            instructor={
                                selectedCourse?.course_instructor ||
                                'Course Instructor'
                            }
                            pricing={selectedCourse?.course_pricing || 'FREE'}
                            buttonText='Incomplete'
                            onButtonClick={() =>
                                console.log('Navigating to Course Details page')
                            }
                            size='big'
                        />
                        <CourseContentList
                            role={userRole}
                            course_id={id || ''}
                            uid={currentUser?.uid || ''}
                            initialSection={allSections}
                            initialLesson={[]}
                        />
                    </div>
                </div>
                <div className='flex flex-col justify-start items-start mt-10 px-6'>
                    <h1 className='font-abhaya font-bold text-4xl'>
                        {selectedCourse?.course_title || 'Course Title'}
                    </h1>
                    <p className='font-abhaya font-normal text-lg mt-2'>
                        {selectedCourse?.course_description ||
                            'Course Description'}
                    </p>
                </div>
                <hr className='border-t gray opacity-15 my-6 mx-6' />
                <div className='my-6 '>
                    <CourseRequirements
                        course_id={selectedCourse?.course_id || ''}
                        course_requirements={
                            selectedCourse?.course_requirements || []
                        }
                    ></CourseRequirements>
                </div>
                <hr className='border-t gray opacity-15 my-6 mx-6' />
                <div className='flex flex-col justify-start items-start my-6 px-6'>
                    <div className='font-abhaya font-bold text-2xl mr-4'>
                        Instructor Name
                    </div>
                    <div className='font-abhaya font-normal text-lg underline underline-offset-2 text-secondary mt-2'>
                        <Link to={''}>{selectedCourse?.course_instructor}</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EnrolledCoursePage;
