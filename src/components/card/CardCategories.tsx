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
    ));

    return (
        <div className='font-abhaya w-full mx-auto p-4'>
            <div className='flex'>
                {/* Filter Section */}
                <div className='min-h-screen w-64 border-r border-gray'>
                    {/* Course Type Section */}
                    <div className='mb-4'>
                        <h2 className='text-lg font-semibold mb-4'>
                            Course Type
                        </h2>
                        <div className='space-y-2 mb-4'>
                            {[
                                'Web Development',
                                'Machine Learning',
                                'Mobile Development',
                                'Cybersecurity',
                            ].map((type) => (
                                <label
                                    key={type}
                                    className='flex items-center cursor-pointer'
                                >
                                    <input
                                        type='checkbox'
                                        value={type}
                                        checked={courseTypes.includes(type)}
                                        onChange={handleCourseType}
                                        className='form-checkbox h-4 w-4 text-primary border-gray rounded'
                                    />
                                    <span className='ml-2'>{type}</span>
                                </label>
                            ))}
                        </div>
                        <div className='border-b border-gray'></div>
                    </div>

                    {/* Sort By Section */}
                    <div className='mb-4'>
                        <h2 className='text-lg font-semibold mb-4'>Sort By</h2>
                        <div className='space-y-2 mb-4'>
                            {['newest', 'oldest', 'popular'].map(
                                (sortOption) => (
                                    <label
                                        key={sortOption}
                                        className='flex items-center cursor-pointer'
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
                                            className='form-radio h-4 w-4 text-primary border-gray'
                                        />
                                        <span className='ml-2'>
                                            {sortOption
                                                .charAt(0)
                                                .toUpperCase() +
                                                sortOption.slice(1)}
                                        </span>
                                    </label>
                                ),
                            )}
                        </div>
                        <div className='border-b border-gray'></div>
                    </div>
                </div>

                {/* Main Content Section */}
                <div className='flex-1 pl-6'>
                    {/* Search Bar Container */}
                    <div className='w-full mb-4'>
                        <SearchComponent variant='full' />
                    </div>

                    {/* Course Grid */}
                    <div
                        className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                        style={{
                            columnGap: '1px',
                            rowGap: '24px',
                        }}
                    >
                        {renderedCourse}
                    </div>

                    {filteredCourses.length === 0 && (
                        <div className='text-center py-8'>
                            <p className='text-gray'>
                                No courses found matching your criteria.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CardCategories;
