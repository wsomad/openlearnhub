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
    const selectedCourse = useSelector(
        (state: RootState) => state.courses.selectedCourse,
    );
    const allCourses = useSelector(
        (state: RootState) => state.courses.allCourses,
    );
    const userRole = useSelector((state: RootState) => state.users.userRole);
    const isInstructor = userRole === 'instructor';

    /**
     * Create a new course.
     * @param course
     * @returns
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
     * Fetch course by ID.
     * @param course_id
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
     * Fetch all courses.
     * @returns
     */
    const fetchAllCourses = async (): Promise<void> => {
        if (allCourses.length > 0) {
            console.log('Courses already in Redux, skipping fetch.');
            return;
        }
        try {
            const courses = await getAllCourses();
            if (courses) {
                dispatch(setCourses(courses));
                console.log('All courses fetched successfully:', courses);
            }
        } catch (error) {
            console.error('Failed to fetch all courses:', error);
        }
    };

    /**
     * Update course by ID.
     * @param course_id
     * @param update_course
     * @returns
     */
    const updateCourse = async (
        course_id: string,
        update_course: Partial<Course>,
    ): Promise<void> => {
        if (!isInstructor) {
            console.warn('Only instructors can update courses.');
            return;
        }
        try {
            const updated = await updateCourseById(course_id, update_course);
            if (updated) {
                dispatch(
                    modifyCourse({
                        id: course_id,
                        updatedCourseObject: update_course,
                    }),
                );
                console.log('Course updated successfully:', updated);
            }
        } catch (error) {
            console.error('Failed to update course:', error);
        }
    };

    /**
     * Delete course by ID.
     * @param course_id
     * @returns
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
        allCourses,
        userRole,
        createCourse,
        fetchCourseById,
        fetchAllCourses,
        updateCourse,
        deleteCourse,
    };
};
