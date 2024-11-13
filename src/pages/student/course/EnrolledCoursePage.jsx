import React from 'react';
import HeaderComponent from '../../../components/HeaderComponent';
import CardCourseComponent from '../../../components/card/CardCourseComponent';
import thumbnail from '../../../assets/images/thumbnail.png';
import {RiTimer2Line} from 'react-icons/ri';
import {HiOutlineDocumentText} from 'react-icons/hi';
import {MdQuiz} from 'react-icons/md';
import CourseContentList from '../../../components/CourseContentList';

function EnrolledCoursePage() {
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
                        <CourseContentList
                            userType={'student'}
                        ></CourseContentList>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EnrolledCoursePage;
