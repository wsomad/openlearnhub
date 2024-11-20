import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../store/store';
import {Lesson} from '../types/lesson';
import {
    addLesson,
    deleteLessonById,
    getAllLessons,
    getLessonById,
    updateLessonById,
} from '../services/firestore/LessonService';
import {
    clearLesson,
    modifyLesson,
    setLesson,
    setLessons,
} from '../store/slices/lessonSlice';

export const useLessons = () => {
    const dispatch = useDispatch();
    const selectedLesson = useSelector(
        (state: RootState) => state.lessons.selectedLesson,
    );
    const allLessons = useSelector(
        (state: RootState) => state.lessons.allLessons,
    );

    /**
     * Create new lessons.
     * @param courseId
     * @param sectionId
     * @param lesson
     */
    const createLessons = async (
        courseId: string,
        sectionId: string,
        lesson: Lesson,
    ) => {
        try {
            await addLesson(courseId, sectionId, lesson);
            dispatch(setLessons([...allLessons, lesson]));
            console.log('Lesson created successfully: ');
        } catch (error) {
            console.error('Failed to create lesson: ', error);
        }
    };

    /**
     * Fetch lesson by ID.
     * @param course_id
     * @param section_id
     * @param lesson_id
     */
    const fetchLessonById = async (
        course_id: string,
        section_id: string,
        lesson_id: string,
    ): Promise<void> => {
        try {
            const lesson = await getLessonById(
                course_id,
                section_id,
                lesson_id,
            );
            if (lesson) {
                dispatch(setLesson(lesson));
                console.log('Lesson fetched successfully:', lesson);
            }
        } catch (error) {
            console.error('Failed to fetch specific lesson:', error);
        }
    };

    /**
     * Fetch all sections.
     * @param course_id
     */
    const fetchAllLessons = async (
        course_id: string,
        section_id: string,
    ): Promise<void> => {
        if (allLessons.length > 0) {
            console.log('Lessons already in Redux, skipping fetch.');
            return;
        }
        try {
            const sections = await getAllLessons(course_id, section_id);
            if (sections) {
                dispatch(setLessons(sections));
                console.log('All lessons fetched successfully:', sections);
            }
        } catch (error) {
            console.error('Failed to fetch all lessons:', error);
        }
    };

    /**
     * Update lesson by ID.
     * @param course_id
     * @param section_id
     * @param update_lesson
     */
    const updateLesson = async (
        course_id: string,
        section_id: string,
        update_lesson: Partial<Lesson>,
    ): Promise<void> => {
        try {
            const updated = await updateLessonById(
                course_id,
                section_id,
                update_lesson,
            );
            if (updated) {
                dispatch(
                    modifyLesson({
                        id: course_id,
                        updatedLessonObject: update_lesson,
                    }),
                );
                console.log('Lesson updated successfully:', updated);
            }
        } catch (error) {
            console.error('Failed to update lesson:', error);
        }
    };

    /**
     * Delete lesson by ID.
     * @param course_id
     * @param section_id
     * @param lesson_id
     */
    const deleteSection = async (
        course_id: string,
        section_id: string,
        lesson_id: string,
    ): Promise<void> => {
        try {
            await deleteLessonById(course_id, section_id, lesson_id);
            dispatch(clearLesson(lesson_id));
            console.log('Lesson deleted successfully.');
        } catch (error) {
            console.error('Failed to delete lesson:', error);
        }
    };

    return {
        selectedLesson,
        allLessons,
        addLesson,
        fetchLessonById,
        fetchAllLessons,
        updateLesson,
        deleteLessonById,
    };
};
