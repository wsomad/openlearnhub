import React from 'react';

function CardCourseComponent({
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
}) {
    let cardSizeClass = '';
    let imageSizeClass = '';

    switch (size) {
        case 'small':
            cardSizeClass = 'w-[330px] h-[350px]';
            imageSizeClass = 'h-[200px]';
            break;
        case 'medium':
            cardSizeClass = 'w-[650px] h-[550px]';
            imageSizeClass = 'h-[500px]';
            break;
        case 'big':
            cardSizeClass = 'w-[750px] h-[550px]';
            imageSizeClass = 'h-[400px]';
            break;
        default:
            cardSizeClass = 'w-[350px] h-[350px]';
            imageSizeClass = 'h-[200px]';
            break;
    }

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
                    {size === 'big' && (
                        <div className='flex flex-row flex gap-6 justify-between mt-2'>
                            <p className='font-abhaya font-bold text-xl text-black'>
                                {hoursDuration} hours
                            </p>
                            <p className='font-abhaya font-bold text-xl text-black'>
                                {numSections} sections
                            </p>
                            <p className='font-abhaya font-bold text-xl text-black'>
                                {numLectures} lectures
                            </p>
                        </div>
                    )}
                    {size !== 'big' && (
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
