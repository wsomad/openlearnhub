import React, { useState } from 'react';
import { BsThreeDots } from 'react-icons/bs';
import { Link } from 'react-router-dom';

interface CardIntrustorProps {
    id: string;
    thumbnailUrl: string;
    title: string;
    description: string;
    updatedAt: Date;
    readyForPublish: boolean;
    onDelete: (id: string) => void;
}

const CardInstructor: React.FC<CardIntrustorProps> = ({
    id,
    thumbnailUrl,
    title,
    description,
    updatedAt,
    readyForPublish,
    onDelete,
}) => {
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);

    const toggleDropdown = () => setIsDropdownVisible((drop) => !drop);

    const handleDelete = () => {
        toggleDropdown();
        onDelete(id);
    };

    return (
        <div className='bg-white border border-gray overflow-hidden shadow-sm hover:shadow-md transition-shadow relative h-full flex flex-col'>
            <div className='relative h-40 lg:h-48'>
                <img
                    src={thumbnailUrl}
                    alt={title}
                    className='w-full h-full object-cover'
                />
                <div
                    className='bg-white rounded-lg absolute top-2 lg:top-3 right-2 lg:right-3 text-primary cursor-pointer p-1.5 lg:p-2 hover:bg-gray-50'
                    onClick={handleDelete}
                >
                    <BsThreeDots className='w-1 h-1 lg:w-2 lg:h-2' />
                </div>
            </div>

            <div className='p-3 lg:p-4 flex flex-col flex-grow'>
                <h3 className='text-base lg:text-xl font-semibold font-abhaya mb-2 h-12 lg:h-14 line-clamp-2'>
                    {title}
                </h3>

                <p className='text-sm lg:text-base text-gray-600 mb-3 lg:mb-4 h-10 lg:h-12 line-clamp-2 font-abhaya'>
                    {description}
                </p>

                <div className='grid grid-cols-2 gap-3 lg:gap-4 mb-3 lg:mb-4 mt-auto'>
                    <div className='flex flex-col'>
                        <p className='text-xs lg:text-sm text-gray-500 font-abhaya'>
                            Last Updated At
                        </p>
                        <p className='text-sm lg:text-base font-semibold font-abhaya truncate'>
                            {updatedAt.toDate().toLocaleDateString('en-uk', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                            })}
                        </p>
                    </div>

                    <div className='flex flex-col'>
                        <p className='text-xs lg:text-sm text-gray-500 font-abhaya'>
                            Status
                        </p>
                        <p className='text-sm lg:text-base font-semibold font-abhaya'>
                            {readyForPublish ? 'Published' : 'In Draft'}
                        </p>
                    </div>
                </div>

                <div className='mt-auto'>
                    <Link
                        to={`/instructor/dashboard/${id}/edit`}
                        className='w-full block bg-primary text-white text-center py-1.5 lg:py-2 text-sm lg:text-base hover:bg-primary-dark transition-colors font-abhaya'
                    >
                        Update
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default CardInstructor;
