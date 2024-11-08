import {useDispatch, useSelector} from 'react-redux';
import {
    addCourse,
    deleteCourseById,
    getAllCourses,
    getCourseById,
    updateCourse,
} from '../services/FirebaseCourseService';
import FirebaseCourseService from '../services/FirebaseCourseService';
import {
    modifiedCourse,
    newCourse,
    setCourses,
    setSelectedCourse,
    updateCourse,
} from '../store/slices/courseSlice';

export const useCourses = () => {
    const dispatch = useDispatch();
    const courses = useSelector((state) => state.courses.courses);

    const addNewCourse = async (course) => {
        try {
            const addNewCourse = await addCourse(course);
            dispatch(newCourse(addNewCourse));
        } catch (error) {
            console.error('Failed to add new course: ', error);
        }
    };

    const fetchCourseById = async (course_id) => {
        try {
            const fetchCourseById = await getCourseById(course_id);
            dispatch(setSelectedCourse(fetchCourseById));
        } catch (error) {
            console.error('Failed to get course: ', error);
        }
    };

    const fetchAllCourses = async () => {
        try {
            const fetchAllCourses = await getAllCourses();
            dispatch(setCourses(fetchAllCourses));
        } catch (error) {
            console.error('Failed to fetch all courses: ', error.message);
        }
    };

    const modifyCourse = async (course_id, updatedCourse) => {
        try {
            await updateCourse(course_id, updatedCourse);
            dispatch(modifiedCourse({course_id, updatedCourse}));
        } catch (error) {
            console.error('Failed to update course: ', error.message);
        }
    };

    const removeCourse = async (course_id) => {
        try {
            await deleteCourseById(course_id);
            dispatch(modifiedCourse({course_id, updatedCourse: null}));
        } catch (error) {
            console.error('Failed to delete course: ', error.message);
        }
    };

    return {
        courses,
        addNewCourse,
        fetchCourseById,
        fetchAllCourses,
        modifyCourse,
        removeCourse,
    };
};
