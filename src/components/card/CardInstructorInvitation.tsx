import React from 'react';
import {IoMdCheckmark} from 'react-icons/io'; // Import the sharp tick icon

const CardInstructorInvitation: React.FC = () => {
    // Benefits Array
    const benefits = [
        'Contribute something to the community',
        'Polish your skills',
        'Inspire the next generation of learners',
    ];

    return (
        <div className='w-3/4 bg-white border border-gray overflow-hidden my-6'>
            <div className='flex flex-col md:flex-row items-start'>
                {/* Content Section */}
                <div className='w-full md:w-2/3 p-6'>
                    <h2 className='font-abhaya text-2xl font-bold text-black my-2'>
                        Become an{' '}
                        <span className='text-secondary'>Instructor</span>
                    </h2>
                    <p className='font-abhaya text-black font-normal text-lg my-4'>
                        Share your knowledge and inspire students worldwide by
                        becoming an instructor on our platform. Join us and make
                        a difference.
                    </p>

                    {/* Benefits Section */}
                    <ul className='mb-6 space-y-2 my-4'>
                        {benefits.map((benefit, index) => (
                            <li
                                key={index}
                                className='font-abhaya text-lg flex items-start'
                            >
                                <IoMdCheckmark className='text-secondary mt-1 mr-2 text-lg' />
                                <span className='text-black'>{benefit}</span>
                            </li>
                        ))}
                    </ul>

                    <button className='bg-primary font-abhaya text-white w-full my-2 py-2 hover:bg-blue-700 transition-colors'>
                        Get Started
                    </button>
                </div>

                {/* Image Section */}
                <div className='w-full md:w-1/3'>
                    <img
                        src='https://via.placeholder.com/100' // Replace with your image URL
                        alt='Invitation'
                        className='object-cover w-full h-full'
                    />
                </div>
            </div>
        </div>
    );
};

export default CardInstructorInvitation;
