import React from 'react';
import HeaderComponent from '../../../components/HeaderComponent';
import CardCourseComponent from '../../../components/card/CardCourseComponent';
import thumbnail from '../../../assets/images/thumbnail.png';
import {RiTimer2Line} from 'react-icons/ri';
import {HiOutlineDocumentText} from 'react-icons/hi';
import {MdQuiz} from 'react-icons/md';
import CourseRequirements from '../../../components/enrollment/CourseRequirements';

const SelectedCoursePage: React.FC = () => {
    return (
        <div>
            <HeaderComponent />
            <div className='px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12'>
                <div className='max-w-screen-xl w-full mx-auto'>
                    {/* Course Title & Description */}
                    <div className='flex flex-col justify-start items-start mt-6'>
                        <h1 className='font-abhaya font-bold text-6xl'>
                            Build Web Application with React Redux
                        </h1>
                        <p className='font-abhaya font-semibold text-lg'>
                            Technology and the world of work change fast — with
                            us, you're faster. Get the skills to achieve goals
                            and stay competitive.
                        </p>
                    </div>

                    {/* Course Card and Requirements Section */}
                    <div className='flex justify-between items-start mt-6 gap-6'>
                        <CardCourseComponent
                            thumbnail={thumbnail}
                            title='Build Web Application with React Redux'
                            instructor='John Doe'
                            pricing='FREE'
                            buttonText='Enroll Now'
                            onButtonClick={() =>
                                console.log('Navigating to Course Details page')
                            }
                            size='medium'
                        />
                        <div className='flex flex-col'>
                            <div className='py-4 px-6 border border-gray rounded-md max-w-lg max-h-[550px] overflow-y-auto'>
                                <CourseRequirements />
                            </div>
                        </div>
                    </div>

                    {/* Course Details */}
                    <div className='flex flex-col mt-5'>
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
