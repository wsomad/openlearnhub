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
    setSearchCourseResult,
    setPopularCourses,
    clearCourse,
    clearCourses,
    clearSingleCourse,
} from '../store/slices/courseSlice';
import { RootState } from '../store/store';
import {Course} from '../types/course';

export const useCourses = () => {
    const dispatch = useDispatch();
    const selectedCourse = useSelector((state: RootState) => state.courses.selectedCourse);
    const allCourses = useSelector((state: RootState) => state.courses.allCourses);
    const popularCourses = useSelector((state: RootState) => state.courses.popularCourses);
    const currentUser = useSelector((state: RootState) => state.user.user);
    const userRole = useSelector((state: RootState) => state.user.userRole);
    const isInstructor = userRole === 'instructor';

    /**
     * Create course function.
     * @param course - Based on course object.
     * @returns
     */
    const createCourse = async (course: Course): Promise<void> => {
        if (!isInstructor) {
            console.warn('Only instructors can create courses.');
            return;
        }

        try {
            const addedCourse = await addCourse(course);
            dispatch(setCourse(addedCourse));
            console.log('Successfully create course with this data:', addedCourse);
        } catch (error) {
            console.error('Failed to create new course:', error);
        }
    };

    /**
     * Fetch course by ID function.
     * @param course_id - Based on course ID.
     * @param uid - Based on user ID.
     * @param userRole - Based on user role.
     */
    const fetchCourseById = async (course_id: string, uid: string | null, userRole: 'student' | 'instructor'): Promise<void> => {
        try {
            const course = await getCourseById(course_id, userRole, uid);

            if (course) {
                dispatch(setCourse(course));
                console.log(`Successfully fetch ${course.course_id} course.`);
            }
        } catch (error) {
            console.error('Failed to fetch this course:', error);
        }
    };

    const fetchAllCourses = async (
        uid: string | null,
        userRole: 'student' | 'instructor',
        filterType: 'default' | 'enrollment' | 'creator',
        sortBy?: 'newest' | 'oldest' | 'popular',
        readyForPublish?: boolean,
        limitCount?: number,
        courseType?: string[]
    ): Promise<Course[]> => {
        try {
            const coursesQuery = await getAllCourses(
                uid,
                userRole,
                filterType,
                sortBy,
                readyForPublish,
                limitCount,
                courseType // Pass course type filter
            );

            if (coursesQuery) {
                if (sortBy === 'popular') { // Check if we're fetching popular courses
                    dispatch(setPopularCourses(coursesQuery)); // Dispatch popular courses to Redux
                } else {
                    dispatch(setCourses(coursesQuery)); // Dispatch regular courses to Redux
                }
                console.log('Successfully fetched all courses.');
                return coursesQuery;
            }
        } catch (error) {
            console.error('Failed to fetch all courses:', error);
        }
        return [];
    };

    /**
     * Search course function.
     * @param search_query - Based on query.
     * @param uid - Based on user ID.
     * @param user_role - Based on user role.
     * @returns
     */
    const searchCourse = async (search_query: string, uid: string, user_role: 'student' | 'instructor'): Promise<Course[]> => {
        try {
            const resultSearch = await searchSpecificCourse(
                search_query,
                uid,
                user_role,
            );

            if (resultSearch) {
                dispatch(setSearchCourseResult(resultSearch));
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
     * Update course function.
     * @param course_id - Based on course ID.
     * @param update_course - Based on updated course object.
     */
    const updateCourse = async (course_id: string, update_course: Partial<Course>): Promise<void> => {
        try {
            const updated = await updateCourseById(course_id, update_course);
            if (updated) {
                dispatch(
                    modifyCourse({
                        id: course_id,
                        updatedCourseObject: update_course,
                    }),
                );
                console.log('Successfully update this course:', updated);
            }
        } catch (error) {
            console.error('Failed to update course:', error);
        }
    };

    /**
     * Delete course.
     * @param course_id | Based on course ID.
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
            console.log('Successfully delete this course.');
        } catch (error) {
            console.error('Failed to delete course:', error);
        }
    };

    /**
     * Clear all courses state.
     */
    const deleteAllCourses = () => {
        dispatch(clearCourses());
    }

    /**
     * Clear single course state.
     */
    const deleteSingleCourse = () => {
        dispatch(clearSingleCourse());
    }

    return {
        selectedCourse,
        allCourses,
        popularCourses,
        currentUser,
        userRole,
        createCourse,
        fetchCourseById,
        fetchAllCourses,
        searchCourse,
        updateCourse,
        deleteCourse,
        deleteAllCourses,
        deleteSingleCourse,
    };
};


// /**
//      * Fetch all courses.
//      * @param uid - Based on user ID.
//      * @param userRole - Based on user role.
//      * @param filterType - Can be 'default' | 'enrollment' | 'creator'.
//      * @param readyForPublish - Optional. Can be true | false | empty.
//      * @param limitCount - Optional. Can be number | empty.
//      * @param popularCourses - Optional.  Can be true | false | empty.
//      * @returns
//      */
// const fetchAllCourses = async (
//     uid: string | null,
//     userRole: 'student' | 'instructor',
//     filterType: 'default' | 'enrollment' | 'creator',
//     readyForPublish?: boolean,
//     limitCount?: number,
//     popularCourses?: boolean,
// ): Promise<Course[]> => {
//     try {
//         let coursesQuery: Course[] | null = null;

//         if (popularCourses) {
//             coursesQuery = await getAllCourses(uid, userRole, filterType, readyForPublish, limitCount, popularCourses);
//         } else if (readyForPublish && limitCount) {
//             coursesQuery = await getAllCourses(uid, userRole, filterType, readyForPublish, limitCount);
//         } else {
//             coursesQuery = await getAllCourses(uid, userRole, filterType);
//         }

//         if (coursesQuery) {
//             if (popularCourses) {
//                 dispatch(setPopularCourses(coursesQuery));
//             } else {
//                 dispatch(setCourses(coursesQuery));
//             }
//             console.log('Successfully fetch all course.')
//             return coursesQuery;
//         }
//     } catch (error) {
//         console.error('Failed to fetch all courses:', error);
//     }
//     return [];
// };
