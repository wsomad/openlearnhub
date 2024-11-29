import React, {useEffect, useState} from 'react';
import {Course} from '../types/course';
import SearchBar from './elements/SearchBar';
import {useCourses} from '../hooks/useCourses';
import {useDispatch} from 'react-redux';
import {clearSearchCourseResults} from '../store/slices/courseSlice';
import {useUser} from '../hooks/useUser';

const SearchComponent: React.FC = () => {
    const [queryText, setQueryText] = useState<string>('');
    const [results, setResults] = useState<Course[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const {searchCourse} = useCourses();
    const {currentUser, userRole} = useUser();
    const dispatch = useDispatch();

    useEffect(() => {
        // Clear search results when the role changes
        dispatch(clearSearchCourseResults());
    }, [dispatch, userRole]);

    // Handle any changes in search input.
    const handleInputChange = (
        event: React.ChangeEvent<HTMLInputElement>,
    ): void => {
        const value = event.target.value;
        setQueryText(value);
        if (value) {
            searchCoursesHandler(value);
        } else {
            setResults([]);
        }
    };

    // Handle searching process.
    const searchCoursesHandler = async (searchQuery: string): Promise<void> => {
        setLoading(true);
        try {
            if (currentUser?.uid) {
                // Search and fetch all results found with query.
                const courses = await searchCourse(
                    searchQuery,
                    currentUser?.uid,
                    userRole,
                );
                // Set the results.
                setResults(courses);
            }
        } catch (error) {
            console.error('Error searching courses:', error);
        } finally {
            setLoading(false);
        }
    };

    // Clear the input.
    const handleSelect = (course: Course): void => {
        console.log('Selected course:', course);
        setQueryText('');
        setResults([]);
    };

    return (
        <div className='relative'>
            <SearchBar
                query={queryText}
                handleInputChange={handleInputChange}
            />
            {queryText && (
                <div className='absolute w-3/4 mt-2 mx-auto bg-white border border-gray shadow-lg max-h-60 overflow-auto top-full left-1/2 transform -translate-x-1/2'>
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
                                    {course.course_title}
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
