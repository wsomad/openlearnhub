import React, { useEffect } from 'react';

import CourseForm from '../../../components/enrollment/course_list/CourseForm';
import HeaderComponent from '../../../components/HeaderComponent';

const CreateCoursePage: React.FC = () => {
    return (
        <div>
            <HeaderComponent></HeaderComponent>
            <div className='font-abhaya container mx-auto px-4 py-8'>
                <div className='mb-4'>
                    <h1 className='text-5xl font-bold font-abhaya'>
                        Create A New Course
                    </h1>
                    <p className='mt-2 font-abhaya text-lg'>
                        Start create your course content.
                    </p>
                </div>

                <div className='grid grid-cols-1 gap-8'>
                    <div className='bg-white shadow-sm'>
                        <div className='py-6'>
                            <CourseForm isDraft={true} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateCoursePage;
