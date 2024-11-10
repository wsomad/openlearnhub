import React from 'react';
import CardCourseComponent from './card/CardCourseComponent';
import thumbnail from '../assets/images/thumbnail.png';

const TestComponent = () => (
    <div className='flex justify-center items-center min-h-screen bg-gray-100'>
        <div className='flex gap-6'>
            <CardCourseComponent
                thumbnail={thumbnail}
                title='Build Web App with React Redux'
                instructor='Dr. John Doe, Dev Kaki Community'
                pricing='FREE'
                buttonText='View Course'
                onButtonClick={() =>
                    // Later, create a navigation route
                    console.log('Navigating to Course Details page')
                }
                size='medium'
            />
            <CardCourseComponent
                thumbnail={thumbnail}
                title='Build Web App with React Redux'
                instructor='Dr. John Doe'
                pricing='FREE'
                buttonText='Incomplete'
                onButtonClick={() =>
                    // Later, create a navigation route
                    console.log('Navigating to Course Selected page')
                }
                size='big'
                hoursDuration='40'
                numSections='23'
                numLectures='120'
            />
        </div>
    </div>
);

export default TestComponent;
