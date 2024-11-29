import {useDispatch, useSelector} from 'react-redux';
import {
    addCourse,
    getAllCourses,
    getCourseById,
    updateCourseById,
    deleteCourseById,
    searchSpecificCourse,
} from '../services/firestore/CourseService';
import {
    setCourse,
    setCourses,
    modifyCourse,
    clearCourse,
    setSearchCourseResult,
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
    const currentUser = useSelector((state: RootState) => state.user.user);
    const userRole = useSelector((state: RootState) => state.user.userRole);
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
    const fetchCourseById = async (
        course_id: string,
        uid: string | null,
        userRole: 'student' | 'instructor',
    ): Promise<void> => {
        try {
            const course = await getCourseById(course_id, userRole, uid);
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
    const fetchAllCourses = async (
        uid: string | null,
        userRole: 'student' | 'instructor',
        filterType: 'default' | 'enrollment' | 'creator',
        readyForPublish?: boolean,
        limitCount?: number,
    ): Promise<Course[]> => {
        if (allCourses.length > 0 && filterType === 'default') {
            console.log('Courses already in Redux, skipping fetch.');
            return allCourses;
        }
        try {
            let coursesQuery = null;

            if (limitCount && readyForPublish) {
                coursesQuery = await getAllCourses(
                    uid,
                    userRole,
                    filterType,
                    readyForPublish,
                    limitCount,
                );
            } else {
                coursesQuery = await getAllCourses(uid, userRole, filterType);
            }

            if (coursesQuery) {
                dispatch(setCourses(coursesQuery));
                console.log('Courses fetched successfully:', coursesQuery);
                return coursesQuery;
            } else {
                console.log('No courses found for the given filter.');
            }
        } catch (error) {
            console.error('Failed to fetch all courses:', error);
        }
        return [];
    };

    /**
     * Search specific course with query.
     * @param search_query
     */
    const searchCourse = async (
        search_query: string,
        uid: string,
        user_role: 'student' | 'instructor',
    ): Promise<Course[]> => {
        try {
            const resultSearch = await searchSpecificCourse(
                search_query,
                uid,
                user_role,
            );
            if (resultSearch) {
                dispatch(setSearchCourseResult(resultSearch));
                console.log('Search courses found:', resultSearch);
                return resultSearch;
            } else {
                return [];
            }
        } catch (error) {
            console.error(
                'Failed to search any courses with this query:',
                error,
            );
            return [];
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
        currentUser,
        userRole,
        createCourse,
        fetchCourseById,
        fetchAllCourses,
        searchCourse,
        updateCourse,
        deleteCourse,
    };
};
