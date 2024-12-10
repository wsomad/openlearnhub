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
        // <div>
        //     <HeaderComponent></HeaderComponent>
        //     <div className='px-10 flex flex-col'>
        //         <h1 className='text-5xl font-bold font-abhaya mb-2'>
        //             Instructor Dashboard
        //         </h1>
        //         <p className='font-abhaya text-xl text-gray-600'>
        //             Start contribute something to community.
        //         </p>
        //     </div>
        //     <SearchComponent></SearchComponent>
        //     <div className='px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12'>
        //         <div className='mx-auto'>
        //             <>
        //             <CardInstructorDashboard></CardInstructorDashboard>
        //             </>
        //         </div>
        //     </div>
        // </div>

        <div>
            <HeaderComponent />
            <div className='max-w-screen-xl mx-auto px-2 sm:px-4 lg:px-0'>
                <div className='py-8'>
                    <h1 className='text-4xl sm:text-5xl font-bold font-abhaya mb-2'>
                        Instructor Dashboard
                    </h1>
                    <p className='font-abhaya text-lg sm:text-xl text-gray-600'>
                        Start contribute something to community.
                    </p>
                </div>
                <div className='mb-6'>
                    <SearchComponent />
                </div>
                <CardInstructorDashboard />
            </div>
        </div>
    );
};

export default CourseDashboardPage;
