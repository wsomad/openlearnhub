import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import CardInstructorDashboard from '../../../components/card/CardInstructorDashboard';
import HeaderComponent from '../../../components/HeaderComponent';
import SearchComponent from '../../../components/SearchComponent';
import { useCourses } from '../../../hooks/useCourses';

const CourseDashboardPage: React.FC = () => {
    const {deleteAllCourses} = useCourses();
    const dispatch = useDispatch();

    useEffect(() => {
        return () => {
            deleteAllCourses();
        };
    }, [dispatch]);

    return (
        <div className='min-h-screen bg-gray-50'>
            <HeaderComponent />
            <div className='max-w-screen-xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10 xl:px-0'>
                <div className='py-6 sm:py-8'>
                    <h1 className='text-3xl sm:text-4xl md:text-5xl font-bold font-abhaya mb-2'>
                        Instructor Dashboard
                    </h1>
                    <p className='font-abhaya text-base sm:text-lg md:text-xl text-gray-600'>
                        Start contribute something to community.
                    </p>
                </div>
                <div className='mb-6 w-full'>
                    <SearchComponent variant='full' />
                </div>
                <div className='pb-8'>
                    <CardInstructorDashboard />
                </div>
            </div>
        </div>
    );
};

export default CourseDashboardPage;
