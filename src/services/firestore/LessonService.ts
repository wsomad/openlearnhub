import {
	collection,
	deleteDoc,
	doc,
	getDoc,
	getDocs,
	setDoc,
	updateDoc,
} from 'firebase/firestore';

import { db } from '../../config/FirebaseConfiguration';
import { Lesson, LessonBase } from '../../types/lesson';

/**
 * Adds a new lesson to a specific section in Firestore
 * @param course_id - Course Identifier
 * @param section_id - Section Identifier
 * @param lesson_data - Lesson data to be added
 */
export const addLesson = async (
    course_id: string,
    section_id: string,
    lesson_data: LessonBase,
): Promise<LessonBase> => {
    try {
        // Create a document reference using lesson_title as the document ID
        const lessonDocRef = doc(
            collection(
                db,
                `courses/${course_id}/sections/${section_id}/lessons`,
            ),
            lesson_data.lesson_title,
        );

        console.log('Lesson ID:', lessonDocRef.id);

        // Prepare the lesson data with additional metadata
        const lessonToAdd: LessonBase = {
            ...lesson_data,
            lesson_id: lessonDocRef.id,
            section_id: section_id,
        };

        // Write the lesson data to Firestore
        await setDoc(lessonDocRef, lessonToAdd);

        console.log(
            `Successfully added lesson with title ${lesson_data.lesson_title} to section ${section_id} in course ${course_id}.`,
        );

        return lessonToAdd;
    } catch (error) {
        console.error('Error adding lesson:', error);
        throw error;
    }
};

/**
 * Get specific lesson under specific section.
 * @param course_id - Identifier for the course
 * @param section_id - Identifier for the section
 * @param lesson_id - Identifier for the lesson to retrieve
 * @returns - Promise containing the lesson data or null if not found
 */
export const getLessonById = async (
    course_id: string,
    section_id: string,
    lesson_id: string,
): Promise<LessonBase | null> => {
    try {
        // Create reference to specific lesson document
        const lessonRef = doc(
            db,
            `courses/${course_id}/sections/${section_id}/lessons/${lesson_id}`,
        );

        // Retrieve the lesson document
        const lessonDoc = await getDoc(lessonRef);
        if (lessonDoc.exists()) {
            const lesson = {
                ...lessonDoc.data(),
                lesson_id: lessonDoc.id,
            } as LessonBase;
            console.log(`Successfully retrieved lesson ${lesson_id}`);
            return lesson;
        } else {
            console.log('No such lesson exists.');
            return null;
        }
    } catch (error) {
        console.error('Error getting lesson:', error);
        return null;
    }
};

/**
 * Get all lessons under specific section.
 * @param course_id - Identifier for the course
 * @param section_id - Identifier for the section
 * @returns - Promise containing array of lesson data
 */
export const getAllLessons = async (
    course_id: string,
    section_id: string,
): Promise<LessonBase[]> => {
    try {
        // Create reference to lessons collection
        const lessonsCollectionRef = collection(
            db,
            `courses/${course_id}/sections/${section_id}/lessons`,
        );

        // Get all documents in the collection
        const snapshot = await getDocs(lessonsCollectionRef);

        // Map documents to lesson objects with IDs
        const lessons = snapshot.docs.map((doc) => ({
            ...doc.data(),
            lesson_id: doc.id,
        })) as LessonBase[];

        console.log(
            `Successfully retrieved ${lessons.length} lessons from section ${section_id}`,
        );
        return lessons;
    } catch (error) {
        console.error('Error fetching lessons:', error);
        throw error;
    }
};

/**
 * Update a lesson by ID.
 * @param course_id - Identifier for the course
 * @param section_id - Identifier for the section
 * @param lesson - Identifier for the lesson to delete
 * @returns - Promise that resolves when update is complete

 */
export const updateLessonById = async (
    course_id: string,
    section_id: string,
    lesson: Partial<LessonBase>,
): Promise<Lesson | void> => {
    try {
        // Validate lesson ID exists
        if (!lesson.lesson_id) {
            throw new Error('Lesson ID is required for update');
        }

        // Create reference to specific lesson document
        const lessonRef = doc(
            db,
            `courses/${course_id}/sections/${section_id}/lessons/${lesson.lesson_id}`,
        );

        // Update the document with new data
        await updateDoc(lessonRef, {...lesson});
        console.log(`Successfully updated lesson ${lesson.lesson_id}`);
    } catch (error) {
        console.error('Error updating lesson:', error);
        throw error;
    }
};

/**
 * Delete a lesson by ID.
 * @param course_id - Identifier for the course
 * @param section_id - Identifier for the section
 * @param lesson_id - Promise that resolves when deletion is complete
 */
export const deleteLessonById = async (
    course_id: string,
    section_id: string,
    lesson_id: string,
): Promise<void> => {
    try {
        // Create reference to specific lesson document
        const lessonRef = doc(
            db,
            `courses/${course_id}/sections/${section_id}/lessons/${lesson_id}`,
        );

        // Delete the document
        await deleteDoc(lessonRef);
        console.log(
            `Successfully deleted lesson ${lesson_id} from section ${section_id}`,
        );
    } catch (error) {
        console.error('Error deleting lesson:', error);
        throw error;
    }
};
