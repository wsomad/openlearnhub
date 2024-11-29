import React from 'react';
import { Link } from 'react-router-dom';

interface CardProps {
    courseId: string;
    thumbnailUrl: string;
    title: string;
    description: string;
    pricing?: number;
    sectionsNumber: number;
    enrollmentNumber: number;
    editMode?: boolean; // Determines if the card shows an "Edit" button for instructors
}

const CardDashboard: React.FC<CardProps> = ({
    courseId,
    thumbnailUrl,
    title,
    description,
    pricing,
    sectionsNumber,
    enrollmentNumber,
    editMode = false,
}) => {
    return (
        <div
            className={`bg-white border border-gray rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow ${
                editMode
                    ? 'min-h-[400px] w-full sm:w-[300px]'
                    : 'min-h-[300px] w-full sm:w-[400px]'
            } flex flex-col`}
        >
            {/* Course Image */}
            <img
                src={thumbnailUrl}
                alt={title}
                className={`w-full object-cover transition-all ${
                    editMode
                        ? 'h-[150px] sm:h-[150px]'
                        : 'h-[200px] sm:h-[200px]'
                }`}
            />

            {/* Course Info */}
            <div className='p-4 flex flex-col h-full'>
                {/* Title */}
                <div className='mb-2 flex-grow-0' style={{minHeight: '50px'}}>
                    <h4
                        className={`font-semibold mb-2 ${
                            editMode
                                ? 'text-lg sm:text-xl'
                                : 'text-lg sm:text-xl'
                        }`}
                    >
                        {title}
                    </h4>
                </div>

                {/* Description */}
                <div
                    className='flex-grow mb-4'
                    style={{display: 'flex', alignItems: 'flex-start'}}
                >
                    <p
                        className={`text-sm sm:text-base mb-2 ${
                            editMode ? 'text-gray-700' : 'text-gray-600'
                        }`}
                        style={{
                            flex: 1,
                            wordBreak: 'break-word',
                            minHeight: '40px',
                        }}
                    >
                        {description}
                    </p>
                </div>

                {/* Course Details */}
                <div className='flex justify-between items-center mb-4'>
                    {editMode ? (
                        <span className='text-gray-500 text-sm sm:text-base'>
                            {sectionsNumber} Sections
                        </span>
                    ) : (
                        pricing && (
                            <span className='text-primary font-semibold text-sm sm:text-base'>
                                RM {pricing}
                            </span>
                        )
                    )}
                    <span className='text-gray-500 text-sm sm:text-base'>
                        {enrollmentNumber} students
                    </span>
                </div>

                {/* Edit Button Only Visible When editMode */}
                {editMode && (
                    <div className='mt-auto'>
                        <Link
                            to={`/instructor/courses/${courseId}/edit`}
                            className='block text-center bg-primary text-white py-2 rounded-full hover:bg-primary-dark transition-colors'
                        >
                            Edit
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CardDashboard;
