import React from 'react';
import {IoMdCheckmark} from 'react-icons/io';
import Player from 'lottie-react';
import lottieAnimation from '../../assets/animations/InstructorAnimation2.json';

const CardInstructorInvitationComponent: React.FC = () => {
    const benefits = [
        'Contribute something to the community',
        'Polish your skills',
        'Inspire the next generation of learners',
    ];

    return (
        <>
            <div className='w-3/4 bg-white border border-gray overflow-hidden mb-10'>
                <div className='flex flex-col md:flex-row items-start'>
                    <div className='w-full md:w-2/3 p-6'>
                        <h2 className='font-abhaya text-2xl font-bold text-black my-2'>
                            Become an{' '}
                            <span className='text-secondary'>Instructor</span>
                        </h2>
                        <p className='font-abhaya text-black font-normal text-lg my-4'>
                            Share your knowledge and inspire students worldwide
                            by becoming an instructor on our platform. Join us
                            and make a difference.
                        </p>

                        <ul className='mb-6 space-y-2 my-4'>
                            {benefits.map((benefit, index) => (
                                <li
                                    key={index}
                                    className='font-abhaya text-lg flex items-start'
                                >
                                    <IoMdCheckmark className='text-secondary mt-1 mr-2 text-lg' />
                                    <span className='text-black'>
                                        {benefit}
                                    </span>
                                </li>
                            ))}
                        </ul>

                        <button className='bg-primary font-abhaya text-white w-full my-2 py-2 hover:bg-blue-700 transition-colors'>
                            Get Started
                        </button>
                    </div>

                    <div className='w-full md:w-1/2 flex items-end'>
                        <Player
                            autoplay
                            loop
                            animationData={lottieAnimation}
                            style={{height: '400px', width: '400px'}}
                        />
                    </div>
                </div>
            </div>
        </>
    );
};

export default CardInstructorInvitationComponent;
