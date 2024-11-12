import React from 'react';
import HeaderComponent from '../../../components/HeaderComponent';
import SearchComponent from '../../../components/SearchComponent';
import CardCourseComponent from '../../../components/card/CardCourseComponent';
import thumbnail from '../../../assets/images/thumbnail.png';

function HomePage() {
    return (
        <div>
            <HeaderComponent></HeaderComponent>
            <div className='flex flex-col justify-center items-center mt-12'>
                <h1 className='font-abhaya font-bold text-6xl'>
                    Find All <span className='text-primary'>Free Courses</span>{' '}
                    You Can Enroll Here
                </h1>
                <p className='font-abhaya font-semibold text-lg'>
                    Technology and the world of work change fast — with us,
                    you're faster. Get the skills to achieve goals and stay
                    competitive.
                </p>
            </div>
            <SearchComponent></SearchComponent>
            <hr className='border-t gray mt-12 opacity-15' />
            <div className='ml-6 mt-10'>
                <h4 className='font-abhaya text-2xl font-bold'>
                    Our Latest <span className='text-secondary'>Courses</span>
                </h4>
            </div>
            <div className='flex justify-center gap-6 mt-6'>
                <div className='w-full max-w-xs'>
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
                        size='small'
                    />
                </div>
                <div className='w-full max-w-xs'>
                    <CardCourseComponent
                        thumbnail={thumbnail}
                        title='Mastering JavaScript'
                        instructor='Jane Doe, JS Expert'
                        pricing='FREE'
                        buttonText='View Course'
                        onButtonClick={() =>
                            // Later, create a navigation route
                            console.log('Navigating to Course Details page')
                        }
                        size='small'
                    />
                </div>
                <div className='w-full max-w-xs'>
                    <CardCourseComponent
                        thumbnail={thumbnail}
                        title='Intro to Node.js'
                        instructor='Mark Smith, Backend Dev'
                        pricing='FREE'
                        buttonText='View Course'
                        onButtonClick={() =>
                            // Later, create a navigation route
                            console.log('Navigating to Course Details page')
                        }
                        size='small'
                    />
                </div>
                <div className='w-full max-w-xs'>
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
                        size='small'
                    />
                </div>
            </div>
        </div>
    );
}

export default HomePage;
