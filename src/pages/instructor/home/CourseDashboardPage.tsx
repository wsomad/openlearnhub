import React, {useEffect} from 'react';
import {useCourses} from '../../../hooks/useCourses';
import {useDispatch} from 'react-redux';
import HeaderComponent from '../../../components/HeaderComponent';
import SearchComponent from '../../../components/SearchComponent';
import CardInstructorDashboard from '../../../components/card/CardInstructorDashboard';

const CourseDashboardPage: React.FC = () => {
    const {deleteAllCourses} = useCourses();
    const dispatch = useDispatch();

    useEffect(() => {
        return () => {
            deleteAllCourses();
        };
    }, [dispatch]);

    return (
        <div>
            <HeaderComponent></HeaderComponent>
            <div className='px-10 flex flex-col'>
                <h1 className='text-5xl font-bold font-abhaya mb-2'>
                    Instructor Dashboard
                </h1>
                <p className='font-abhaya text-xl text-gray-600'>
                    Start contribute something to community.
                </p>
            </div>
            <SearchComponent></SearchComponent>
            <div className='px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12'>
                <div className='mx-auto'>
                    <>
                    <CardInstructorDashboard></CardInstructorDashboard>
                    </>
                </div>
            </div>
        </div>
    );
};

export default CourseDashboardPage;
