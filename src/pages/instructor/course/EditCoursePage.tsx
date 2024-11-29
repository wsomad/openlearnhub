import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import {useCourses} from '../../../hooks/useCourses';
import CourseForm from '../../../components/enrollment/course_list/CourseForm';
import HeaderComponent from '../../../components/HeaderComponent';
import {useSelector} from 'react-redux';

const EditCoursePage: React.FC = () => {
    const {courseId} = useParams<{courseId: string}>();
    const {selectedCourse} = useCourses();
    const currentState = useSelector((state) => state);
    console.log('Current State from Selector:', currentState);

    if (!courseId) {
        return <div>Course not found</div>;
    }

    return (
        <div>
            <HeaderComponent></HeaderComponent>
            <div className='font-abhaya container mx-auto px-4 py-8'>
                <div className='mb-4'>
                    <h1 className='text-5xl font-bold font-abhaya'>
                        Edit{' '}
                        <span className='text-secondary'>
                            {selectedCourse?.course_title}
                        </span>{' '}
                        Course
                    </h1>
                    <p className='mt-2 font-abhaya text-lg'>
                        Update and manage your course content.
                    </p>
                </div>

                <div className='grid grid-cols-1 gap-8'>
                    <div className='bg-white shadow-sm'>
                        <div className='py-6'>
                            <CourseForm courseId={courseId}></CourseForm>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditCoursePage;
