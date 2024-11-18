import React from 'react';
import { HiOutlineDocumentText } from 'react-icons/hi';
import { MdQuiz } from 'react-icons/md';
import { RiTimer2Line } from 'react-icons/ri';

interface CardCourseDetailsProps {
    title: string;
    instructor: string;
    size: 'small' | 'medium' | 'big' | 'default';
    hoursDuration: number;
    numSections: number;
    numLectures: number;
    pricing: number;
    onButtonClick: () => void;
    buttonText: string;
}

const CardCourseDetails = ({
    title,
    instructor,
    size,
    hoursDuration,
    numSections,
    numLectures,
    pricing,
    onButtonClick,
    buttonText,
}: CardCourseDetailsProps) => {
    return (
        <div
            className={`p-3 border border-gray ${
                size === 'big' ? 'rounded-bl-md' : 'rounded-b-md'
            } w-full flex flex-col justify-between flex-grow`}
        >
            <h3 className='font-abhaya font-bold text-lg text-black truncate w-full'>
                {title}
            </h3>

            <p className='font-abhaya font-semibold text-md text-secondary'>
                {instructor}
            </p>

            <div className='flex items-center justify-between w-full mt-4'>
                {size === 'big' && (
                    <div className='flex flex-row flex gap-6 justify-between mt-2'>
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
                <button
                    onClick={onButtonClick}
                    className='bg-secondary rounded-full font-abhaya font-semibold text-white py-2 px-4'
                >
                    {buttonText}
                </button>
            </div>
        </div>
    );
};

export default CardCourseDetails;
