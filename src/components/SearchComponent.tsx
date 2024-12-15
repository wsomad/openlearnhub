import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { useCourses } from '../hooks/useCourses';
import { useUser } from '../hooks/useUser';
import { clearSearchCourseResults } from '../store/slices/courseSlice';
import { Course } from '../types/course';
import SearchBar from './elements/SearchBar';

interface SearchComponentProps {
    variant?: 'centered' | 'full';
}

const SearchComponent: React.FC<SearchComponentProps> = ({
    variant = 'centered',
}) => {
    const [queryText, setQueryText] = useState<string>('');
    const [results, setResults] = useState<Course[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const {searchCourse} = useCourses();
    const {currentUser, userRole} = useUser();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        // Clear search results when the role changes
        dispatch(clearSearchCourseResults());
    }, [dispatch, userRole]);

    useEffect(() => {
        const closeDropdown = () => setIsOpen(false);
        document.addEventListener('click', closeDropdown);

        return () => document.removeEventListener('click', closeDropdown);
    }, []);

    // Handle any changes in search input.
    const handleInputChange = (
        event: React.ChangeEvent<HTMLInputElement>,
    ): void => {
        const value = event.target.value;
        setQueryText(value);
        setIsOpen(true);
        if (value) {
            searchCoursesHandler(value);
        } else {
            setResults([]);
        }
    };

    // Handle searching process - add role-based filtering
    const searchCoursesHandler = async (searchQuery: string): Promise<void> => {
        setLoading(true);
        try {
            if (currentUser?.uid) {
                const courses = await searchCourse(
                    searchQuery,
                    currentUser.uid,
                    userRole,
                );

                // For instructors, only show their courses
                if (userRole === 'instructor') {
                    const instructorCourses = courses.filter(
                        (course) => course.instructor_id === currentUser.uid,
                    );
                    setResults(instructorCourses);
                } else {
                    // For students, show all published courses
                    const publishedCourses = courses.filter(
                        (course) => course.ready_for_publish,
                    );
                    setResults(publishedCourses);
                }
            }
        } catch (error) {
            console.error('Error searching courses:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSelect = (course: Course): void => {
        if (userRole === 'instructor') {
            // Navigate to edit course page for instructors
            navigate(`/instructor/dashboard/${course.course_id}/edit`);
        } else {
            // Navigate to selected course page for students
            navigate(`/selectedcourse/${course.course_id}`);
        }

        setQueryText('');
        setResults([]);
        setIsOpen(false);
    };

    const handleSearchClick = (e: React.MouseEvent) => {
        e.stopPropagation();
    };

    return (
        <div
            onClick={handleSearchClick}
            className={`relative ${
                variant === 'centered' ? 'w-3/4 mx-auto' : 'w-full'
            }`}
        >
            <SearchBar
                query={queryText}
                handleInputChange={handleInputChange}
                variant={variant}
            />
            {queryText && isOpen && (
                <div
                    className={`absolute w-full mt-2 bg-white border border-gray shadow-lg max-h-60 overflow-auto z-50`}
                >
                    {loading ? (
                        <div className='text-center py-2 text-gray'>
                            Wait, let's see what do we have here...
                        </div>
                    ) : results.length > 0 ? (
                        <ul>
                            {results.map((course) => (
                                <li
                                    key={course.course_id}
                                    className='px-4 py-2 cursor-pointer hover:bg-gray-100 font-abhaya text-lg'
                                    onClick={() => handleSelect(course)}
                                >
                                    <div className='flex flex-row items-center gap-4'>
                                        <img
                                            src={course.course_thumbnail_url}
                                            alt={course.course_title}
                                            className='w-15 h-8 object-cover'
                                        />
                                        {course.course_title}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className='px-4 py-2 text-center text-gray'>
                            No results match with this course
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default SearchComponent;
