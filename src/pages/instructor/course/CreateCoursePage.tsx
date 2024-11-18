// CreateCoursePage.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Course } from '../../../types/course';
import { useCourses } from './CourseContext';

interface CreateCoursePageProps {
    initialCourse?: Course | null;
}

const CreateCoursePage: React.FC<CreateCoursePageProps> = ({initialCourse}) => {
    const navigate = useNavigate();
    const {updateCourse, addCourse} = useCourses();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Form state
    const [courseData, setCourseData] = useState<Partial<Course>>({
        course_title: '',
        course_description: '',
        course_pricing: 0,
        course_requirements: [''],
        course_type: 'Online',
        course_thumbnail_url: '',
        course_enrollment_number: 0,
        course_number_of_section: 0,
        course_rating: 5,
        sections: [],
    });

    // Initialize form with existing course data if editing
    useEffect(() => {
        if (initialCourse) {
            setCourseData(initialCourse);
        }
    }, [initialCourse]);

    // Handle input changes
    const handleInputChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >,
    ) => {
        const {name, value} = e.target;
        setCourseData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Handle requirements array
    const handleRequirementChange = (index: number, value: string) => {
        const updatedRequirements = [...(courseData.course_requirements || [])];
        updatedRequirements[index] = value;
        setCourseData((prev) => ({
            ...prev,
            course_requirements: updatedRequirements,
        }));
    };

    const addRequirement = () => {
        setCourseData((prev) => ({
            ...prev,
            course_requirements: [...(prev.course_requirements || []), ''],
        }));
    };

    const removeRequirement = (index: number) => {
        setCourseData((prev) => ({
            ...prev,
            course_requirements: prev.course_requirements?.filter(
                (_, i) => i !== index,
            ),
        }));
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            if (initialCourse) {
                // Update existing course
                updateCourse(initialCourse.course_id, courseData as Course);
                console.log('Course updated:', courseData);
            } else {
                // Create new course
                addCourse(courseData as Course);
                console.log('Course created:', courseData);
            }

            // Redirect to the courses dashboard after successful creation/update
            navigate('/instructor/courses');
        } catch (err) {
            setError(
                err instanceof Error ? err.message : 'Failed to save course',
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className='space-y-6 font-abhaya'>
            {error && (
                <div className='bg-red-50 text-red-500 p-4 rounded-lg'>
                    {error}
                </div>
            )}

            {/* Basic Information */}
            <div className='space-y-4'>
                <h2 className='text-2xl font-bold font-abhaya'>
                    Basic Information
                </h2>

                <div>
                    <label
                        htmlFor='course_title'
                        className='block text-lg font-medium text-gray-700 mb-1'
                    >
                        Course Title*
                    </label>
                    <input
                        id='course_title'
                        name='course_title'
                        type='text'
                        value={courseData.course_title}
                        onChange={handleInputChange}
                        className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary'
                        required
                    />
                </div>

                <div>
                    <label
                        htmlFor='course_description'
                        className='block text-lg font-medium text-gray-700 mb-1'
                    >
                        Course Description*
                    </label>
                    <textarea
                        id='course_description'
                        name='course_description'
                        value={courseData.course_description}
                        onChange={handleInputChange}
                        rows={4}
                        className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary'
                        required
                    />
                </div>

                <div className='grid grid-cols-2 gap-4'>
                    <div>
                        <label
                            htmlFor='course_pricing'
                            className='block text-lg font-medium text-gray-700 mb-1'
                        >
                            Course Price*
                        </label>
                        <input
                            id='course_pricing'
                            name='course_pricing'
                            type='number'
                            min='0'
                            step='0.01'
                            value={courseData.course_pricing}
                            onChange={handleInputChange}
                            className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary'
                            required
                        />
                    </div>

                    <div>
                        <label
                            htmlFor='course_type'
                            className='block text-lg font-medium text-gray-700 mb-1'
                        >
                            Course Type*
                        </label>
                        <select
                            id='course_type'
                            name='course_type'
                            value={courseData.course_type}
                            onChange={handleInputChange}
                            className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary appearance-none'
                            required
                        >
                            <option value='Online'>Online</option>
                            <option value='Recorded'>Recorded</option>
                            <option value='Live'>Live</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Course Requirements */}
            <div className='space-y-4'>
                <h2 className='text-2xl font-bold font-abhaya'>
                    Course Requirements
                </h2>

                {courseData.course_requirements?.map((requirement, index) => (
                    <div key={index} className='flex gap-2'>
                        <input
                            type='text'
                            value={requirement}
                            onChange={(e) =>
                                handleRequirementChange(index, e.target.value)
                            }
                            className='flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary'
                            placeholder='Enter requirement'
                        />
                        <button
                            type='button'
                            onClick={() => removeRequirement(index)}
                            className='px-4 py-2 text-red-500 hover:text-red-700'
                        >
                            Remove
                        </button>
                    </div>
                ))}

                <button
                    type='button'
                    onClick={addRequirement}
                    className='text-primary hover:text-primary-dark'
                >
                    + Add Requirement
                </button>
            </div>

            {/* Course Thumbnail */}
            <div>
                <h2 className='text-2xl font-bold font-abhaya mb-4'>
                    Course Thumbnail
                </h2>

                <div>
                    <label
                        htmlFor='course_thumbnail_url'
                        className='block text-lg font-medium text-gray-700 mb-1'
                    >
                        Thumbnail URL*
                    </label>
                    <input
                        id='course_thumbnail_url'
                        name='course_thumbnail_url'
                        type='url'
                        value={courseData.course_thumbnail_url}
                        onChange={handleInputChange}
                        className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary'
                        required
                    />
                </div>
            </div>

            {/* Submit Button */}
            <div className='flex justify-end space-x-4'>
                <button
                    type='button'
                    onClick={() => navigate('/instructor/courses')}
                    className='px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50'
                >
                    Cancel
                </button>
                <button
                    type='submit'
                    disabled={isLoading}
                    className='px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:bg-gray-400'
                >
                    {isLoading
                        ? 'Saving...'
                        : initialCourse
                        ? 'Update Course'
                        : 'Create Course'}
                </button>
            </div>
        </form>
    );
};

export default CreateCoursePage;
