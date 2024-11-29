import {
    doc,
    collection,
    setDoc,
    getDoc,
    getDocs,
    updateDoc,
    deleteDoc,
} from 'firebase/firestore';
import {db} from '../../config/FirebaseConfiguration';
import {Lesson, LessonBase} from '../../types/lesson';

/**
 * Add new lesson to specific section.
 * @param courseId
 * @param sectionId
 * @param lesson_data
 */
export const addLesson = async (
    courseId: string,
    sectionId: string,
    lesson_data: LessonBase,
): Promise<void> => {
    try {
        const lessonDocRef = doc(
            collection(db, `courses/${courseId}/sections/${sectionId}/lessons`),
            lesson_data.lesson_id,
        );
        const lesson = {
            ...lesson_data,
            lesson_id: lessonDocRef.id,
        } as Lesson;
        await setDoc(lessonDocRef, lesson);

        console.log(
            `Lesson ${lesson_data.lesson_id} added successfully to section ${sectionId}.`,
        );
    } catch (error) {
        console.error('Error adding lesson:', error);
        throw error;
    }
};

/**
 * Get specific lesson under specific section.
 * @param course_id
 * @param section_id
 * @param lesson_id
 * @returns
 */
export const getLessonById = async (
    course_id: string,
    section_id: string,
    lesson_id: string,
): Promise<Lesson | null> => {
    try {
        const lessonDocRef = doc(
            collection(
                db,
                `courses/${course_id}/sections/${section_id}/lessons/${lesson_id}`,
            ),
        );
        const lessonDoc = await getDoc(lessonDocRef);
        if (lessonDoc.exists()) {
            const lesson = {
                lesson_id,
                ...lessonDoc.data(),
            } as Lesson;
            console.log(`Successfully get data from lesson ${lessonDoc.id}.`);
            return lesson;
        } else {
            console.log('No such lesson.');
            return null;
        }
    } catch (error) {
        console.error('Error getting lesson:', error);
        return null;
    }
};

/**
 * Get all lessons under specific section.
 * @param course_id
 * @param section_id
 * @returns
 */
export const getAllLessons = async (
    course_id: string,
    section_id: string,
): Promise<LessonBase[]> => {
    try {
        const lessonDocRef = collection(
            db,
            `courses/${course_id}/sections/${section_id}/lessons`,
        );
        const snapshot = await getDocs(lessonDocRef);
        const lessons = snapshot.docs.map((doc) => ({
            lesson_id: doc.id,
            ...doc.data(),
        })) as LessonBase[];
        console.log(
            `Successfully get all lessons: ${lessons} under section ${section_id}`,
        );
        return lessons;
    } catch (error) {
        console.error('Error fetching lessons:', error);
        throw error;
    }
};

/**
 * Update a lesson by ID.
 * @param course_id
 * @param section_id
 * @param lesson
 */
export const updateLessonById = async (
    course_id: string,
    section_id: string,
    lesson: Partial<LessonBase>,
): Promise<Lesson | void> => {
    try {
        const lessonDocRef = doc(
            db,
            `courses/${course_id}/sections/${section_id}/lessons/${lesson.lesson_id}`,
        );
        await updateDoc(lessonDocRef, {...lesson});
        console.log(
            `Successfully update lesson ${lesson.lesson_id} under section ${section_id}.`,
        );
    } catch (error) {
        console.error('Error updating lesson:', error);
        throw error;
    }
};

/**
 * Delete a lesson by ID.
 * @param course_id
 * @param section_id
 * @param lesson_id
 */
export const deleteLessonById = async (
    course_id: string,
    section_id: string,
    lesson_id: string,
): Promise<void> => {
    try {
        const lessonDocRef = doc(
            db,
            `courses/${course_id}/sections/${section_id}/lessons/${lesson_id}`,
        );
        await deleteDoc(lessonDocRef);
        console.log(
            `Successfully delete lesson ${lesson_id} under section ${section_id}.`,
        );
    } catch (error) {
        console.error('Error deleting lesson:', error);
        throw error;
    }
};
