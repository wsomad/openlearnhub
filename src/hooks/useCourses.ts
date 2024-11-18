import {useDispatch, useSelector} from 'react-redux';
import {
    addCourse,
    getAllCourses,
    getCourseById,
    updateCourseById,
    deleteCourseById,
} from '../services/firestore/CourseService';
import {
    setCourse,
    setCourses,
    modifyCourse,
    clearCourse,
} from '../store/slices/courseSlice';
import {RootState} from '../store/store';
import {Course} from '../types/course'; // Import the Course type

export const useCourses = () => {
    const dispatch = useDispatch();

    // Selectors with type annotations
    const selectedCourse = useSelector(
        (state: RootState) => state.courses.selectedCourse,
    );
    const courses = useSelector((state: RootState) => state.courses.allCourses);
    const userRole = useSelector((state: RootState) => state.users.userRole);

    const isInstructor = userRole === 'instructor';

    /**
     * Create a new course
     */
    const createCourse = async (course: Course): Promise<void> => {
        if (!isInstructor) {
            console.warn('Only instructors can create courses.');
            return;
        }

        try {
            const addedCourse = await addCourse(course);
            dispatch(setCourse(addedCourse)); // Dispatch the added course
            console.log('Course created successfully:', addedCourse);
        } catch (error) {
            console.error('Failed to add new course:', error);
        }
    };

    /**
     * Fetch a course by its ID
     */
    const fetchCourseById = async (course_id: string): Promise<void> => {
        try {
            const course = await getCourseById(course_id);
            if (course) {
                dispatch(setCourse(course));
                console.log('Course fetched successfully:', course);
            }
        } catch (error) {
            console.error('Failed to fetch specific course:', error);
        }
    };

    /**
     * Fetch all courses
     */
    const fetchAllCourses = async (): Promise<void> => {
        try {
            const allCourses = await getAllCourses();
            if (allCourses) {
                dispatch(setCourses(allCourses));
                // Optionally reset selectedCourse
                dispatch(setCourses([]));
                console.log('All courses fetched successfully:', allCourses);
            }
        } catch (error) {
            console.error('Failed to fetch all courses:', error);
        }
    };

    /**
     * Update a course by its ID
     */
    const updateCourse = async (
        course_id: string,
        updatedCourse: Partial<Course>,
    ): Promise<void> => {
        if (!isInstructor) {
            console.warn('Only instructors can update courses.');
            return;
        }
        try {
            const updated = await updateCourseById(course_id, updatedCourse);
            if (updated) {
                dispatch(
                    modifyCourse({
                        id: course_id,
                        updatedCourseObject: updatedCourse,
                    }),
                );
                console.log('Course updated successfully:', updated);
            }
        } catch (error) {
            console.error('Failed to update course:', error);
        }
    };

    /**
     * Delete a course by its ID
     */
    const deleteCourse = async (course_id: string): Promise<void> => {
        if (!isInstructor) {
            console.warn('Only instructors can delete courses.');
            return;
        }
        try {
            await deleteCourseById(course_id);
            dispatch(clearCourse(course_id));
            console.log('Course deleted successfully.');
        } catch (error) {
            console.error('Failed to delete course:', error);
        }
    };

    return {
        selectedCourse,
        courses,
        userRole,
        createCourse,
        fetchCourseById,
        fetchAllCourses,
        updateCourse,
        deleteCourse,
    };
};
