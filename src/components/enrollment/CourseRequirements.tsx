import React, { useEffect, useState } from 'react';

import { useCourses } from '../../hooks/useCourses';
import { useUser } from '../../hooks/useUser';

interface CourseRequirementsProps {
    course_id: string | null;
    //selectedCourse: Course | null;
    course_requirements: string[] | [];
}

const CourseRequirements: React.FC<CourseRequirementsProps> = ({
    course_id,
    course_requirements,
}) => {
    const {currentUser, userRole} = useUser();
    const {selectedCourse, fetchCourseById} = useCourses();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadCourse = async () => {
            if (course_id) {
                await fetchCourseById(course_id);
                console.log('Currently in selected course page.');
                setLoading(false);
            }
        };
        loadCourse();
    }, [currentUser, userRole]);

    const renderedRequirements = course_requirements.map((requirement) => {
        return <li key={course_id}>{requirement}</li>;
    });

    return (
        <div>
            <h2 className='font-abhaya px-6 text-2xl font-bold mb-2 mt-6'>
                Course Requirements
            </h2>
            {/* <hr className='border-t gray opacity-15 my-3 mx-6' /> */}
            <ul className='font-abhaya  px-6 text-lg list-disc list-inside mt-4'>
                {renderedRequirements}
            </ul>
        </div>
    );
};

export default CourseRequirements;
