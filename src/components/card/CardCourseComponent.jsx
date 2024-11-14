import React from 'react';
import CardCourseDetails from './CardCourseDetails';

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
            cardSizeClass = 'w-[280px] h-[300px]';
            imageSizeClass = 'h-[250px]';
            break;
        case 'medium':
            cardSizeClass = 'w-[750px] h-[550px]';
            imageSizeClass = 'h-[500px]';
            break;
        case 'big':
            cardSizeClass = 'w-[full] h-[600px]';
            imageSizeClass = 'h-[700px]';
            break;
        default:
            cardSizeClass = 'w-[350px] h-[350px]';
            imageSizeClass = 'h-[200px]';
            break;
    }

    return (
        <div
            className={`card ${cardSizeClass} flex flex-col border border-gray shadow-sm box-border ${
                size === 'big' ? 'rounded-tl-lg' : 'rounded-lg'
            }`}
        >
            <img
                src={thumbnail}
                alt={title}
                className={`w-full ${imageSizeClass} object-cover ${
                    size === 'big' ? 'rounded-tl-md' : 'rounded-md'
                }`}
            />
            <CardCourseDetails
                title={title}
                instructor={instructor}
                size={size}
                pricing={pricing}
                hoursDuration={hoursDuration}
                numSections={numSections}
                numLectures={numLectures}
                buttonText={buttonText}
                onButtonClick={onButtonClick}
            ></CardCourseDetails>
        </div>
    );
}

export default CardCourseComponent;
