import React from 'react';
import { useSelector } from 'react-redux';

import CardInstructorInvitationComponent from '../../../components/card/CardInstructorInvitationComponent';
import CardLatestCoursesComponent from '../../../components/card/CardLatestCoursesComponent';
import CardPopularCoursesComponent from '../../../components/card/CardPopularCoursesComponent';
import HeaderComponent from '../../../components/HeaderComponent';
import SearchComponent from '../../../components/SearchComponent';

const HomePage: React.FC = () => {
    const currentState = useSelector((state) => state);
    console.log('[Home Page] Current State from Selector:', currentState);
    return (
        <div>
            <HeaderComponent />
            <div className='flex flex-col justify-center items-center mt-12'>
                <h1 className='font-abhaya font-bold text-6xl'>
                    Find All{' '}
                    <span className='text-secondary'>Free Courses</span> You Can
                    Enroll Here
                </h1>
                <p className='font-abhaya font-semibold text-lg'>
                    Technology and the world of work change fast — with us,
                    you're faster. Get the skills to achieve goals and stay
                    competitive.
                </p>
            </div>
            <SearchComponent />
            <hr className='border-t gray mt-12 opacity-15' />
            <div className='px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12'>
                <div className='max-w-screen-xl w-full mx-auto'>
                    <>
                        <CardPopularCoursesComponent></CardPopularCoursesComponent>
                    </>
                    <>
                        <CardLatestCoursesComponent></CardLatestCoursesComponent>
                    </>
                    <>
                        <CardInstructorInvitationComponent></CardInstructorInvitationComponent>
                    </>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
