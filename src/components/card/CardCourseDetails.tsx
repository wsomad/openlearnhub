import React from 'react';
import {RiTimer2Line} from 'react-icons/ri';
import {HiOutlineDocumentText} from 'react-icons/hi';
import {MdQuiz} from 'react-icons/md';

// Defining the types for props
interface CardCourseDetailsProps {
    title: string;
    instructor: string;
    size: 'small' | 'medium' | 'big' | 'default';
    hoursDuration?: number | string;
    numSections?: number | string;
    numLectures?: number | string;
    pricing: number | string;
    onButtonClick?: () => void;
    buttonText?: string;
}

const CardCourseDetails: React.FC<CardCourseDetailsProps> = ({
    title,
    instructor,
    size,
    hoursDuration,
    numSections,
    numLectures,
    pricing,
    onButtonClick,
    buttonText,
}) => {
    return (
        <div
            // ${
            //     size === 'big' ? 'rounded-none' : 'rounded-b-md'
            // }
            className={`p-3 border border-gray  w-full flex flex-col justify-between flex-grow`}
        >
            <h3 className='font-abhaya font-bold text-lg text-black truncate w-full'>
                {title}
            </h3>

            <p className='font-abhaya font-semibold text-md text-secondary'>
                {instructor}
            </p>

            <div className='flex items-center justify-between w-full'>
                {size === 'big' && (
                    <div className='flex flex-row gap-6 justify-between mt-2'>
                        <div className='flex flex-row items-center mr-4'>
                            <RiTimer2Line className='mr-2' />
                            <p className='font-abhaya font-semibold text-lg text-black'>
                                {hoursDuration} hours
                            </p>
                        </div>
                        <div className='flex flex-row items-center mr-4'>
                            <HiOutlineDocumentText className='mr-2' />
                            <p className='font-abhaya font-semibold text-lg text-black'>
                                {numSections} sections
                            </p>
                        </div>
                        <div className='flex flex-row items-center mr-4'>
                            <MdQuiz className='mr-2' />
                            <p className='font-abhaya font-semibold text-lg text-black'>
                                {numLectures} lectures
                            </p>
                        </div>
                    </div>
                )}
                {size !== 'big' && (
                    <p className='font-abhaya font-bold text-lg text-black'>
                        {pricing}
                    </p>
                )}
                {size !== 'big' && (
                    <button
                        onClick={onButtonClick}
                        className='bg-secondary font-abhaya font-semibold text-white py-1 px-5'
                    >
                        {buttonText}
                    </button>
                )}
            </div>
        </div>
    );
};

export default CardCourseDetails;
