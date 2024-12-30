import React from 'react';
import { HiOutlineDocumentText } from 'react-icons/hi';
import { MdQuiz } from 'react-icons/md';
import { RiTimer2Line } from 'react-icons/ri';

import CardCourseDetails from './CardCourseDetails';

interface CardCourseComponentProps {
    thumbnail: string;
    title: string;
    instructor: string;
    pricing?: number | string;
    enrolledStudents?: number;
    size: 'sm' | 'md' | 'lg' | 'xl' | 'default';
    hoursDuration?: number | string;
    numSections?: number | string;
    numLectures?: number | string;
    buttonText?: string;
    onButtonClick?: () => void;
}

const CardCourseComponent: React.FC<CardCourseComponentProps> = ({
    thumbnail,
    title,
    instructor,
    pricing,
    enrolledStudents,
    size,
    hoursDuration,
    numSections,
    numLectures,
    buttonText,
    onButtonClick,
}) => {
    let cardSizeClass = '';
    let imageSizeClass = '';

    switch (size) {
        case 'sm':
            cardSizeClass = 'w-full h-[300px]';
            imageSizeClass = 'h-[190px]';
            break;
        case 'md':
            cardSizeClass = 'w-[380px] h-[300px]';
            imageSizeClass = 'h-[200px]';
            break;
        case 'lg':
            cardSizeClass = 'w-[750px] h-[550px]';
            imageSizeClass = 'h-[350px] min-h-[425px] max-h-[425px]';
            break;
        case 'xl':
            cardSizeClass = 'w-[full] h-[600px]';
            imageSizeClass = 'h-[500px]';
            break;
        default:
            cardSizeClass = 'w-[350px] h-[350px]';
            imageSizeClass = 'h-[200px]';
            break;
    }

    return (
        <div className={`card ${cardSizeClass} flex flex-col shadow-sm`}>
            <img
                src={thumbnail}
                alt={title}
                className={`w-full ${imageSizeClass} object-cover `}
            />
            <div
                className={`p-3 border border-gray w-full flex flex-col justify-between flex-grow`}
            >
                <h3 className='font-abhaya font-bold text-lg text-black truncate w-full'>
                    {title}
                </h3>

                <p className='font-abhaya font-semibold text-md text-secondary'>
                    {instructor}
                </p>

                <div className='flex items-end justify-between w-full'>
                    {size === 'xl' && (
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
                    {size !== 'xl' &&
                        (enrolledStudents ? (
                            <p className='font-abhaya font-bold text-lg text-black'>
                                {enrolledStudents}{' '}
                                {enrolledStudents! > 1
                                    ? 'Enrollments'
                                    : 'Enrollment'}
                            </p>
                        ) : (
                            <p className='font-abhaya font-bold text-lg text-black'>
                                FREE
                            </p>
                        ))}
                    {size !== 'xl' ? (
                        <button
                            onClick={onButtonClick}
                            className='bg-primary font-abhaya text-white py-1 px-5'
                        >
                            {buttonText}
                        </button>
                    ) : (
                        <button
                            onClick={onButtonClick}
                            className='bg-primary font-abhaya text-white py-1 px-5'
                        >
                            'Incomplete'
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CardCourseComponent;
