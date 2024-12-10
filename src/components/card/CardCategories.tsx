import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useCourses } from '../../hooks/useCourses';
import { useUser } from '../../hooks/useUser';
import { Course } from '../../types/course';
import SearchComponent from '../SearchComponent';
import CardCourseComponent from './CardCourseComponent';

const CardCategories: React.FC = () => {
    const {allCourses, fetchAllCourses} = useCourses();
    const {currentUser, userRole} = useUser();
    const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
    const [courseTypes, setCourseTypes] = useState<string[]>([]);
    const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'popular'>(
        'newest',
    );
    const navigate = useNavigate();

    useEffect(() => {
        const loadCourses = async () => {
            if (currentUser?.uid) {
                const courses = await fetchAllCourses(
                    currentUser?.uid,
                    userRole,
                    'default',
                    sortBy,
                    true,
                    undefined,
                    courseTypes,
                );
                setFilteredCourses(courses);
                console.log('Course categories', courses);
            }
        };
        loadCourses();
    }, [currentUser, userRole, courseTypes, sortBy]);

    const handleCourseType = (event: React.ChangeEvent<HTMLInputElement>) => {
        const {value, checked} = event.target;
        setCourseTypes((checkType) =>
            checked
                ? [...checkType, value]
                : checkType.filter((type) => type !== value),
        );
    };

    const renderedCourse = filteredCourses.map((course) => (
        <CardCourseComponent
            key={course.course_id}
            thumbnail={course.course_thumbnail_url}
            title={course.course_title}
            instructor={course.course_instructor}
            pricing={course.course_pricing}
            buttonText='View Course'
            onButtonClick={() =>
                navigate(`/selectedcourse/${course.course_id}`)
            }
            size='sm'
        />
        // <div
        //     key={course.course_id}
        //     className="course-card bg-white shadow-lg p-6 rounded-lg border"
        // >
        //     <h3 className="text-xl font-semibold">{course.course_title}</h3>
        //     <p className="text-gray-700 mt-2">{course.course_description}</p>
        //     <p className="text-sm text-gray-500 mt-2">
        //         Enrolled: {course.course_enrollment_number}
        //     </p>
        //     <p className="text-sm text-gray-500">Type: {course.course_type}</p>
        //     <p className="text-sm text-gray-500">
        //         Created At: {new Date(course.course_created_at).toLocaleDateString()}
        //     </p>
        // </div>
    ));

    return (
        <div className='font-abhaya w-full mx-auto p-4'>
            {/* Flex Container for Filters and Courses */}
            <div className='flex flex-row'>
                {/* Filter Section */}
                <div className='filters pl-6 w-full lg:w-1/5'>
                    <div className='filter mb-6'>
                        <label className='block text-lg font-semibold'>
                            Course Type
                        </label>
                        <div className='space-y-2 mt-2'>
                            {[
                                'Web Development',
                                'Machine Learning',
                                'Mobile Development',
                                'Cybersecurity',
                            ].map((type) => (
                                <label key={type} className='flex items-center'>
                                    <input
                                        type='checkbox'
                                        value={type}
                                        checked={courseTypes.includes(type)}
                                        onChange={handleCourseType}
                                        className='mr-2 leading-tight'
                                    />
                                    {type}
                                </label>
                            ))}
                        </div>
                    </div>
                    <div className='filter'>
                        <label className='block text-lg font-semibold'>
                            Sort By
                        </label>
                        <div className='space-y-2 mt-2'>
                            {['newest', 'oldest', 'popular'].map(
                                (sortOption) => (
                                    <label
                                        key={sortOption}
                                        className='flex items-center'
                                    >
                                        <input
                                            type='radio'
                                            value={sortOption}
                                            checked={sortBy === sortOption}
                                            onChange={() =>
                                                setSortBy(
                                                    sortOption as
                                                        | 'newest'
                                                        | 'oldest'
                                                        | 'popular',
                                                )
                                            }
                                            className='mr-2 leading-tight'
                                        />
                                        {sortOption.charAt(0).toUpperCase() +
                                            sortOption.slice(1)}
                                    </label>
                                ),
                            )}
                        </div>
                    </div>
                </div>

                {/* Courses Section */}
                <div>
                    <SearchComponent />
                    <div className='mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6'>
                        {renderedCourse}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CardCategories;
