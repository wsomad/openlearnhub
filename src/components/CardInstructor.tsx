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
        <div className='bg-white border border-gray overflow-hidden shadow-sm hover:shadow-md transition-shadow relative'>
            <div className='relative'>
                <img
                    src={thumbnailUrl}
                    alt={title}
                    className='w-full max-h-30 object-cover'
                />
                <div
                    className='bg-white rounded-xl absolute top-3 right-3 text-primary cursor-pointer'
                    onClick={handleDelete}
                >
                    <BsThreeDots className='w-5 h-5' />
                </div>
            </div>
            <div className='p-4'>
                <h3 className='text-xl font-semibold font-abhaya mb-2'>
                    {title}
                </h3>
                <p className='text-gray-600 mb-4 line-clamp-2 font-abhaya'>
                    {description}
                </p>

                <div className='grid grid-cols-2 gap-5 mb-4'>
                    <div>
                        <p className='text-gray-500 text-sm font-abhaya'>
                            Last Updated At
                        </p>
                        <p className='text-lg font-semibold font-abhaya'>
                            {updatedAt.toDate().toLocaleDateString('en-uk', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                            })}
                        </p>
                    </div>

                    <div>
                        <p className='text-gray-500 text-sm font-abhaya'>
                            Status
                        </p>
                        <p className='text-lg font-semibold font-abhaya'>
                            {readyForPublish ? 'Published' : 'In Draft'}
                        </p>
                    </div>
                </div>
                <div className='flex space-x-2'>
                    <Link
                        to={`/instructor/dashboard/${id}/edit`}
                        className='flex-1 bg-primary text-white text-center py-2 hover:bg-primary-dark transition-colors font-abhaya'
                    >
                        Update
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default CardInstructor;
