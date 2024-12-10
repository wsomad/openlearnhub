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

// return (
//     <div
//         className={`bg-white border border-gray rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow ${
//             editMode
//                 ? 'min-h-[400px] w-full sm:w-[300px]'
//                 : 'min-h-[300px] w-full sm:w-[400px]'
//         } flex flex-col`}
//     >
//         {/* Course Image */}
//         <img
//             src={thumbnailUrl}
//             alt={title}
//             className={`w-full object-cover transition-all ${
//                 editMode
//                     ? 'h-[150px] sm:h-[150px]'
//                     : 'h-[200px] sm:h-[200px]'
//             }`}
//         />

//         {/* Course Info */}
//         <div className='p-4 flex flex-col h-full'>
//             {/* Title */}
//             <div className='mb-2 flex-grow-0' style={{minHeight: '50px'}}>
//                 <h4
//                     className={`font-semibold mb-2 ${
//                         editMode
//                             ? 'text-lg sm:text-xl'
//                             : 'text-lg sm:text-xl'
//                     }`}
//                 >
//                     {title}
//                 </h4>
//             </div>

//             {/* Description */}
//             <div
//                 className='flex-grow mb-4'
//                 style={{display: 'flex', alignItems: 'flex-start'}}
//             >
//                 <p
//                     className={`text-sm sm:text-base mb-2 ${
//                         editMode ? 'text-gray-700' : 'text-gray-600'
//                     }`}
//                     style={{
//                         flex: 1,
//                         wordBreak: 'break-word',
//                         minHeight: '40px',
//                     }}
//                 >
//                     {description}
//                 </p>
//             </div>

//             {/* Course Details */}
//             <div className='flex justify-between items-center mb-4'>
//                 {editMode ? (
//                     <span className='text-gray-500 text-sm sm:text-base'>
//                         {sectionsNumber} Sections
//                     </span>
//                 ) : (
//                     pricing && (
//                         <span className='text-primary font-semibold text-sm sm:text-base'>
//                             RM {pricing}
//                         </span>
//                     )
//                 )}
//                 <span className='text-gray-500 text-sm sm:text-base'>
//                     {enrollmentNumber} students
//                 </span>
//             </div>

//             {/* Edit Button Only Visible When editMode */}
//             {editMode && (
//                 <div className='mt-auto'>
//                     <Link
//                         to={`/instructor/courses/${courseId}/edit`}
//                         className='block text-center bg-primary text-white py-2 rounded-full hover:bg-primary-dark transition-colors'
//                     >
//                         Edit
//                     </Link>
//                 </div>
//             )}
//         </div>
//     </div>
// );
