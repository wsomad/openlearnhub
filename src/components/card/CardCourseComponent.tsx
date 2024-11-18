import React from 'react';

import { Course } from '../../types/Course'; // Import the Course interface
import CardCourseDetails from './CardCourseDetails';

interface CardCourseComponentProps {
    course: Course;
    buttonText: string;
    onButtonClick: () => void;
    size: 'small' | 'medium' | 'big' | 'default';
}

const CardCourseComponent = ({
    course,
    buttonText,
    onButtonClick,
    size,
}: CardCourseComponentProps) => {
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
                src={course.course_thumbnail_url} // Use properties from the course object
                alt={course.course_title}
                className={`w-full ${imageSizeClass} object-cover ${
                    size === 'big' ? 'rounded-tl-md' : 'rounded-t-md'
                }`}
            />
            <CardCourseDetails
                title={course.course_title}
                instructor={course.course_type} // Use course properties here
                size={size}
                pricing={course.course_pricing}
                hoursDuration={course.course_enrollment_number} // Example, adjust as needed
                numSections={course.course_number_of_section}
                numLectures={course.course_enrollment_number} // Example, adjust as needed
                buttonText={buttonText}
                onButtonClick={onButtonClick}
            />
        </div>
    );
};

export default CardCourseComponent;
