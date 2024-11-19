import React from 'react';
import { Link } from 'react-router-dom';

interface CardProps {
    courseId: string;
    thumbnailUrl: string;
    title: string;
    description: string;
    pricing: number;
    enrollmentNumber: number;
}

const CardDashboard: React.FC<CardProps> = ({
    courseId,
    thumbnailUrl,
    title,
    description,
    pricing,
    enrollmentNumber,
}) => {
    return (
        <Link
            to={`/course/${courseId}`}
            className='block hover:shadow-lg transition-shadow'
        >
            <div className='bg-white rounded-lg overflow-hidden shadow'>
                <img
                    src={thumbnailUrl}
                    alt={title}
                    className='w-full h-[200px] object-cover'
                />
                <div className='p-4'>
                    <h4 className='text-xl font-semibold mb-2'>{title}</h4>
                    <p className='text-gray-600 text-sm mb-2'>{description}</p>
                    <div className='flex justify-between items-center'>
                        <span className='text-primary font-semibold'>
                            RM {pricing}
                        </span>
                        <span className='text-gray-500 text-sm'>
                            {enrollmentNumber} students
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default CardDashboard;
