import { useDispatch, useSelector } from 'react-redux';

// import { createNewQuestion } from '../components/enrollment/testingLesson/questionUtils';
import {
	addLesson,
	deleteLessonById,
	getAllLessons,
	getLessonById,
	updateLessonById,
} from '../services/firestore/LessonService';
import {
	clearLesson,
	clearLessonsState,
	modifyLesson,
	modifyLessonRemove,
	setLesson,
	setLessons,
} from '../store/slices/lessonSlice';
import { RootState } from '../store/store';
import { LessonBase } from '../types/lesson';
import { Question } from '../types/question';

export const useLessons = () => {
    // Initialize Redux dispatch
    const dispatch = useDispatch();

    // Select necessary state from Redux store
    const selectedLesson = useSelector(
        (state: RootState) => state.lessons.selectedLesson,
    );
    const lessonsBySection = useSelector(
        (state: RootState) => state.lessons.lessonsBySection,
    );

    /**
     * Retrieves lessons for a specific section
     * @param sectionId - ID of the section to get lessons for
     * @returns Array of lessons or empty array if section not found
     */
    const fetchLessonsForSection = async (
        sectionId: string,
        courseId: string,
    ) => {
        try {
            const lessons = await getAllLessons(courseId, sectionId);
            const serializedLessons = lessons
                .map(serializeLesson)
                .sort((a, b) => a.lesson_order - b.lesson_order);

            dispatch(
                setLessons({
                    sectionId: sectionId,
                    lessons: serializedLessons,
                }),
            );

            return serializedLessons;
        } catch (error) {
            console.error('Error fetching lessons for section:', error);
            return [];
        }
    };

    /**
     * Converts Firestore timestamps to ISO date strings in lesson data
     * @param lesson - Raw lesson data from Firestore
     * @returns Processed lesson data with proper date formats
     */
    const serializeLesson = (lesson: any): LessonBase => {
        // Convert any Timestamp fields to Date strings
        const serialized = {...lesson};

        // Convert timestamp fields if they exist
        if (serialized.created_at?.toDate) {
            serialized.created_at = serialized.created_at
                .toDate()
                .toISOString();
        }
        if (serialized.updated_at?.toDate) {
            serialized.updated_at = serialized.updated_at
                .toDate()
                .toISOString();
        }
        return serialized as LessonBase;
    };

    /**
     * Creates a new lesson in a specific section
     * @param course_id - Course identifier
     * @param section_id - Section identifier
     * @param lesson_data - Lesson data to be created
     */
    const createLessons = async (
        course_id: string,
        section_id: string,
        lesson_data: LessonBase,
    ): Promise<LessonBase | undefined> => {
        try {
            console.log('Creating lesson with:', {
                course_id,
                section_id,
                lesson_data,
            }); // Add debug log

            // Get existing lessons to determine order
            const currentLessons = await getAllLessons(course_id, section_id);

            // Calculate next lesson order number
            const nextLessonOrder =
                currentLessons.length > 0
                    ? Math.max(
                          ...currentLessons.map(
                              (lesson) => lesson.lesson_order,
                          ),
                      ) + 1
                    : 1;

            // Add order to lesson data and ensure section_id is set
            const lessonToAdd = {
                ...lesson_data,
                lesson_order: nextLessonOrder,
                section_id: section_id, // Explicitly set section_id
            };

            console.log('Lesson data to add:', lessonToAdd); // Add debug log

            // Create lesson in Firebase
            const addedLesson = await addLesson(
                course_id,
                section_id,
                lessonToAdd,
            );

            console.log('Lesson added to Firebase:', addedLesson); // Add debug log

            // Update Redux store
            dispatch(setLesson(serializeLesson(addedLesson)));

            // Refresh lessons list
            await fetchAllLessons(course_id, section_id);

            console.log('Lesson creation complete:', addedLesson);

            return addedLesson;
        } catch (error) {
            console.error('Failed to create lesson:', error);
            return undefined;
        }
    };

    /**
     * Fetches a specific lesson by ID
     * @param course_id - Course identifier
     * @param section_id - Section identifier
     * @param lesson_id - Lesson identifier
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
                dispatch(setLesson(serializeLesson(lesson)));
                console.log('Lesson fetched successfully:', lesson);
            }
        } catch (error) {
            console.error('Failed to fetch specific lesson:', error);
        }
    };

    /**
     * Fetches all lessons for a section
     * @param course_id - Course identifier
     * @param section_id - Section identifier
     * @returns Array of lessons
     */
    const fetchAllLessons = async (
        course_id: string,
        section_id: string,
    ): Promise<LessonBase[]> => {
        try {
            const lessons = await getAllLessons(course_id, section_id);
            if (lessons) {
                // Process and sort lessons
                const serializedLessons = lessons
                    .map(serializeLesson)
                    .filter((lesson) => lesson.section_id === section_id)
                    .sort((a, b) => a.lesson_order - b.lesson_order);

                // Update Redux store
                dispatch(
                    setLessons({
                        sectionId: section_id,
                        lessons: serializedLessons,
                    }),
                );
                return serializedLessons;
            }
            return [];
        } catch (error) {
            console.error('Failed to fetch all lessons:', error);
            throw error;
        }
    };

    /**
     * Updates an existing lesson
     * @param course_id - Course identifier
     * @param section_id - Section identifier
     * @param update_lesson - Updated lesson data
     */
    const updateLesson = async (
        course_id: string,
        section_id: string,
        update_lesson: LessonBase,
    ): Promise<void> => {
        try {
            const updated = await updateLessonById(
                course_id,
                section_id,
                update_lesson,
            );

            if (updated) {
                // Update Redux state
                dispatch(
                    modifyLesson({
                        section_id: section_id,
                        id: update_lesson.lesson_id,
                        updatedLessonObject: serializeLesson(update_lesson),
                    }),
                );

                // Refresh lessons list
                await fetchAllLessons(course_id, section_id);
                console.log('Lesson updated successfully:', updated);
            }
        } catch (error) {
            console.error('Failed to update lesson:', error);
            throw error;
        }
    };

    /**
     * Deletes a lesson and reorders remaining lessons in the section
     * @param course_id - Course identifier
     * @param section_id - Section identifier
     * @param lessonToDelete - Lesson to be deleted (either full lesson object or just ID)
     */
    const deleteLesson = async (
        course_id: string,
        section_id: string,
        lessonToDelete: LessonBase | string,
    ): Promise<void> => {
        try {
            // Get lesson ID whether passed full lesson object or just ID
            const lesson_id =
                typeof lessonToDelete === 'string'
                    ? lessonToDelete
                    : lessonToDelete.lesson_id;

            // Delete lesson from Firebase
            await deleteLessonById(course_id, section_id, lesson_id);

            // Update Redux state to remove lesson
            dispatch(
                modifyLessonRemove({
                    section_id: section_id,
                    lesson_id: lesson_id,
                }),
            );

            // Get current section lessons for reordering
            const sectionLessons = lessonsBySection[section_id] || [];

            // Reorder remaining lessons
            const remainingLessons = sectionLessons
                .filter((lesson) => lesson.lesson_id !== lesson_id)
                .sort((a, b) => a.lesson_order - b.lesson_order)
                .map((lesson, idx) => ({
                    ...lesson,
                    lesson_order: idx + 1,
                }));

            // Update all remaining lessons with new orders
            await Promise.all(
                remainingLessons.map((lesson) =>
                    updateLesson(course_id, section_id, lesson),
                ),
            );

            // Refresh lessons list
            await fetchAllLessons(course_id, section_id);

            console.log(
                'Lesson deleted and remaining lessons reordered successfully.',
            );
        } catch (error) {
            console.error('Error in deleteLesson:', error);
            throw error;
        }
    };

    const setSelectedLesson = (lesson: LessonBase) => {
        dispatch(setLesson(lesson));
    };

    const clearSelectedLesson = () => {
        dispatch(clearLesson());
    };

    // Quiz-related functions

    const resetLessonsState = () => {
        dispatch(clearLessonsState());
    };

    return {
        selectedLesson,
        fetchLessonsForSection,
        createLessons,
        fetchLessonById,
        fetchAllLessons,
        updateLesson,
        deleteLesson,
        setSelectedLesson,
        clearSelectedLesson,
        resetLessonsState,
    };
};
