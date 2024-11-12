import React, {useState} from 'react';
import SearchBar from '../components/elements/SearchBar'; // Assuming you have a SearchBar component
import {getSpecificCourse} from '../services/firestore/CourseService'; // Correct import

function SearchComponent() {
    const [queryText, setQueryText] = useState(''); // State for input
    const [results, setResults] = useState([]); // State for storing search results
    const [loading, setLoading] = useState(false); // Loading state

    const handleInputChange = (event) => {
        const value = event.target.value;
        setQueryText(value); // Update input text
        if (value) {
            searchCoursesHandler(value); // Start searching if input is non-empty
        } else {
            setResults([]); // Clear results if input is empty
        }
    };

    // Function to search courses
    const searchCoursesHandler = async (searchQuery) => {
        setLoading(true); // Start loading spinner
        try {
            const courses = await getSpecificCourse(searchQuery); // Call search function
            setResults(courses); // Store results in state
        } catch (error) {
            console.error('Error searching courses:', error); // Handle error
        } finally {
            setLoading(false); // Stop loading spinner
        }
    };

    const handleSelect = (course) => {
        console.log('Selected course:', course); // Log selected course
        setQueryText(''); // Clear input field
        setResults([]); // Clear search results
    };

    return (
        <div className='relative'>
            <SearchBar
                query={queryText}
                handleInputChange={handleInputChange} // Pass handler to SearchBar
            />
            {queryText && (
                <div className='absolute w-3/4 mt-2 mx-auto bg-white border border-gray rounded-md shadow-lg max-h-60 overflow-auto top-full left-1/2 transform -translate-x-1/2'>
                    {loading ? (
                        <div className='text-center py-2'>Loading...</div>
                    ) : results.length > 0 ? (
                        <ul>
                            {results.map((course) => (
                                <li
                                    key={course.id}
                                    className='px-4 py-2 cursor-pointer hover:bg-gray-100 font-abhaya text-lg'
                                    onClick={() => handleSelect(course)}
                                >
                                    {course.course_title}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className='px-4 py-2 text-center'>
                            No results found
                        </div> // No results message
                    )}
                </div>
            )}
        </div>
    );
}

export default SearchComponent;
