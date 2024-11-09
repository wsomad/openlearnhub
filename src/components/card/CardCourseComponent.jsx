import React from 'react';

function CardCourseComponent({
    thumbnail,
    title,
    instructor,
    pricing,
    buttonText,
    onButtonClick,
    size,
}) {
    const cardSizeClass =
        size === 'big' ? 'w-[550px] h-[450px]' : 'w-[350px] h-[350px]';
    const imageSizeClass = size === 'big' ? 'h-[400px]' : 'h-[200px]';

    return (
        <div
            className={`card ${cardSizeClass} flex flex-col border border-gray rounded-lg shadow-sm box-border`}
        >
            <img
                src={thumbnail}
                alt={title}
                className={`w-full ${imageSizeClass} object-cover rounded-t-md`}
            />
            <div className='p-3 w-full flex flex-col justify-between flex-grow'>
                <h3 className='font-abhaya font-bold text-xl text-black'>
                    {title}
                </h3>
                <p className='font-abhaya font-semibold text-md text-secondary'>
                    {instructor}
                </p>
                <div className='flex items-center justify-between w-full mt-4'>
                    {pricing && (
                        <p className='font-abhaya font-bold text-xl text-black'>
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
        </div>
    );
}

export default CardCourseComponent;
