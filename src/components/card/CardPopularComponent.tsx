import React from 'react';

interface CardPopularComponentProps {
    thumbnail: string;
    title: string;
    instructor: string;
    pricing?: number | string;
    enrolledStudents?: number;
    buttonText?: string;
    onButtonClick?: () => void;
}

const CardPopularComponent: React.FC<CardPopularComponentProps> = ({
    thumbnail,
    title,
    instructor,
    pricing,
    enrolledStudents,
    buttonText,
    onButtonClick,
}) => {

    return (
        <div className={`card w-[380px] h-[300px] flex flex-col shadow-sm`}>
            <img
                src={thumbnail}
                alt={title}
                className={`w-full h-[200px] object-cover `}
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
                <div className='flex items-center justify-between w-full'>
                    <p className='font-abhaya font-bold text-lg text-black'>
                        {pricing}
                    </p>
                    <p className='font-abhaya font-bold text-lg text-black'>

                    {enrolledStudents} {enrolledStudents! > 1 ? "students" : "student"}
                    </p>
                    <button
                        onClick={onButtonClick}
                        className='bg-primary font-abhaya text-white py-1 px-5'
                    >
                        {buttonText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CardPopularComponent;
