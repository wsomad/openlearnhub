import React from 'react';
import CardCourseDetails from './CardCourseDetails';
import {HiOutlineDocumentText} from 'react-icons/hi';
import {RiTimer2Line} from 'react-icons/ri';
import {MdQuiz} from 'react-icons/md';

interface CardCourseComponentProps {
    thumbnail: string;
    title: string;
    instructor: string;
    pricing: number | string;
    buttonText?: string;
    onButtonClick?: () => void;
    size: 'small' | 'medium' | 'big' | 'default'; // Assuming size can be these values
    hoursDuration?: number | string;
    numSections?: number | string;
    numLectures?: number | string;
}

const CardCourseComponent: React.FC<CardCourseComponentProps> = ({
    thumbnail,
    title,
    instructor,
    pricing,
    buttonText,
    onButtonClick,
    size,
    hoursDuration,
    numSections,
    numLectures,
}) => {
    let cardSizeClass = '';
    let imageSizeClass = '';

    // Set the correct class based on the `size` prop
    switch (size) {
        case 'small':
            cardSizeClass = 'w-[280px] h-[300px]';
            imageSizeClass = 'h-[250px]';
            break;
        case 'medium':
            cardSizeClass = 'w-[750px] h-[550px]';
            imageSizeClass = 'h-[500px]';
            break;
        case 'big':
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
                src={thumbnail} // Use properties from the course object
                alt={title}
                className={`w-full ${imageSizeClass} object-cover `}
            />
            {/* <CardCourseDetails
                title={title}
                instructor={instructor} // Use course properties here
                size={size}
                pricing={pricing}
                hoursDuration={hoursDuration}
                numSections={numSections}
                numLectures={numLectures}
                buttonText={buttonText}
                onButtonClick={onButtonClick}
            /> */}
            <div
                className={`p-3 border border-gray w-full flex flex-col justify-between flex-grow`}
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
                    {size !== 'big' ? (
                        <button
                            onClick={onButtonClick}
                            className='bg-secondary font-abhaya font-semibold text-white py-1 px-5'
                        >
                            {buttonText}
                        </button>
                    ) : (
                        <button
                            onClick={onButtonClick}
                            className='bg-secondary font-abhaya font-semibold text-white py-1 px-5'
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
