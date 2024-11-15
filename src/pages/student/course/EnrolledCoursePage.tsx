import React from 'react';
import HeaderComponent from '../../../components/HeaderComponent';
import CardCourseComponent from '../../../components/card/CardCourseComponent';
import thumbnail from '../../../assets/images/thumbnail.png';
import {RiTimer2Line} from 'react-icons/ri';
import {HiOutlineDocumentText} from 'react-icons/hi';
import {MdQuiz} from 'react-icons/md';
import CourseContentList from '../../../components/enrollment/course_list/CourseContentList';
import CardCourseDetails from '../../../components/card/CardCourseDetails';
import CourseRequirements from '../../../components/enrollment/CourseRequirements';

function EnrolledCoursePage() {
    return (
        <div>
            <HeaderComponent />
            <div className='px-4 sm:px-6 md:px-8 lg:px-10 xl:px-10'>
                <div className='w-screen-xl h-full w-full justify-between'>
                    <div className='flex justify-between items-start mt-4'>
                        <CardCourseComponent
                            thumbnail={thumbnail}
                            title='Build Web Application with React Redux'
                            instructor='John Doe'
                            pricing='FREE'
                            buttonText='Incomplete' // ubah nanti
                            onButtonClick={() =>
                                console.log('Navigating to Course Details page')
                            }
                            size='big'
                            hoursDuration='20.4'
                            numSections='23'
                            numLectures='120'
                        />
                        <CourseContentList
                            userType={'student'}
                        ></CourseContentList>
                    </div>
                </div>
                <div className='flex flex-col justify-start items-start mt-10'>
                    <h1 className='font-abhaya font-bold text-4xl'>
                        Build Web Application with React Redux
                    </h1>
                    <p className='font-abhaya font-normal text-lg mt-2'>
                        Technology and the world of work change fast — with us,
                        you're faster. Get the skills to achieve goals and stay
                        competitive.
                    </p>
                </div>
                <div className='mt-6'>
                    <CourseRequirements></CourseRequirements>
                </div>
            </div>
        </div>
    );
}

export default EnrolledCoursePage;
