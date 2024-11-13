import React from 'react';
import HeaderComponent from '../../../components/HeaderComponent';
import CardCourseComponent from '../../../components/card/CardCourseComponent';
import thumbnail from '../../../assets/images/thumbnail.png';
import {RiTimer2Line} from 'react-icons/ri';
import {HiOutlineDocumentText} from 'react-icons/hi';
import {MdQuiz} from 'react-icons/md';

function SelectedCoursePage() {
    return (
        <div>
            <HeaderComponent />
            <div className='px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12'>
                <div className='max-w-screen-xl w-full mx-auto'>
                    <div className='flex flex-col justify-start items-start mt-12'>
                        <h1 className='font-abhaya font-bold text-6xl'>
                            Build Web Application with React Redux
                        </h1>
                        <p className='font-abhaya font-semibold text-lg'>
                            Technology and the world of work change fast — with
                            us, you're faster. Get the skills to achieve goals
                            and stay competitive.
                        </p>
                    </div>
                    <div className='flex justify-between items-start mt-10 gap-6'>
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
                            <div className='p-6 border border-gray rounded-md max-w-lg max-h-[450px] overflow-y-auto'>
                                <h2 className='font-abhaya text-2xl font-bold mb-2'>
                                    Course Details
                                </h2>
                                <hr className='border-t gray opacity-15 mb-4' />
                                <p className='font-abhaya text-lg'>
                                    This course provides a comprehensive
                                    introduction to building web applications
                                    using React and Redux. Perfect for both
                                    beginners and experienced developers.
                                </p>
                                <ul className='font-abhaya text-lg list-disc list-inside mt-4'>
                                    <li>Introduction to React and Redux</li>
                                    <li>State Management</li>
                                    <li>Building Components</li>
                                    <li>Advanced React Techniques</li>
                                    <li>Introduction to React and Redux</li>
                                    <li>State Management</li>
                                    <li>Building Components</li>
                                    <li>Advanced React Techniques</li>
                                    <li>Advanced React Techniques</li>
                                    <li>Introduction to React and Redux</li>
                                    <li>State Management</li>
                                    <li>Building Components</li>
                                    <li>Advanced React Techniques</li>
                                    <li>Advanced React Techniques</li>
                                    <li>Introduction to React and Redux</li>
                                    <li>State Management</li>
                                    <li>Building Components</li>
                                    <li>Advanced React Techniques</li>
                                </ul>
                            </div>
                            <div className='flex flex-col mt-5'>
                                <h5 className='font-abhaya text-2xl font-bold'>
                                    This course includes
                                </h5>
                                <div className='font-abhaya text-lg flex flex-row justify-start items-center mt-4'>
                                    <div className='flex flex-row items-center mr-8'>
                                        <RiTimer2Line className='mr-2' />
                                        <p className='mr-4'>20.4 hours</p>
                                    </div>
                                    <div className='flex flex-row items-center mr-8'>
                                        <HiOutlineDocumentText className='mr-2' />
                                        <p className='mr-4'>23 sections</p>
                                    </div>
                                    <div className='flex flex-row items-center'>
                                        <MdQuiz className='mr-2' />
                                        <p className='mr-4'>25 questions</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SelectedCoursePage;
