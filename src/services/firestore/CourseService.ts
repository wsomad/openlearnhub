import {
    doc,
    setDoc,
    getDoc,
    getDocs,
    updateDoc,
    deleteDoc,
    collection,
    DocumentData,
    QuerySnapshot,
} from 'firebase/firestore';
import {db} from '../../config/FirebaseConfiguration';
import {Course} from '../../types/course'; // Assuming you have a Course type defined

const coursesCollection = collection(db, 'courses');

/**
 * Add a new course to Firestore.
 * @param courseData - The course data to add.
 */
export const addCourse = async (courseData: Course): Promise<Course> => {
    try {
        const courseDocRef = doc(coursesCollection);
        await setDoc(courseDocRef, courseData);
        console.log('Course successfully added.');

        return {...courseData, course_id: courseDocRef.id}; // Assuming `Course` has an `id` field to be populated
    } catch (error) {
        console.error('Error creating course:', error);
        throw error; // Rethrow the error so the calling function can handle it
    }
};

/**
 * Get a course by its ID.
 * @param course_id - The ID of the course to retrieve.
 * @returns The course data if found, otherwise `null`.
 */
export const getCourseById = async (
    course_id: string,
): Promise<Course | null> => {
    try {
        const courseDocRef = doc(coursesCollection, course_id);
        const courseDoc = await getDoc(courseDocRef);

        if (courseDoc.exists()) {
            console.log('Course data: ', courseDoc.data());
            return {course_id, ...courseDoc.data()} as Course;
        } else {
            console.log('No such course.');
            return null;
        }
    } catch (error) {
        console.error('Error getting course:', error);
        return null;
    }
};

/**
 * Get courses that match a specific query.
 * @param searchQuery - The search string to filter courses by title.
 * @returns An array of matching courses.
 */
export const getSpecificCourse = async (
    searchQuery: string,
): Promise<Course[]> => {
    try {
        const querySnapshot: QuerySnapshot<DocumentData> = await getDocs(
            coursesCollection,
        );
        const courses: Course[] = [];

        querySnapshot.forEach((doc) => {
            const courseTitle = doc.data().course_title?.toLowerCase() ?? '';
            if (courseTitle.includes(searchQuery.toLowerCase())) {
                courses.push({course_id: doc.id, ...doc.data()} as Course);
            }
        });

        return courses;
    } catch (error) {
        console.error('Error searching courses:', error);
        return [];
    }
};

/**
 * Get all courses in Firestore.
 * @returns An array of all courses.
 */
export const getAllCourses = async (): Promise<Course[]> => {
    try {
        const querySnapshot = await getDocs(coursesCollection);
        const courses = querySnapshot.docs.map((doc) => ({
            course_id: doc.id,
            ...doc.data(),
        })) as Course[];

        console.log('All courses data: ', courses);
        return courses;
    } catch (error) {
        console.error('Error getting all courses:', error);
        return [];
    }
};

/**
 * Update a course by its ID.
 * @param course_id - The ID of the course to update.
 * @param updatedCourse - The updated course data.
 * @returns The updated course data.
 */
export const updateCourseById = async (
    course_id: string,
    updatedCourse: Partial<Course>,
): Promise<Course | void> => {
    try {
        const courseDocRef = doc(coursesCollection, course_id);
        await updateDoc(courseDocRef, updatedCourse);

        return {course_id, ...updatedCourse} as Course;
    } catch (error) {
        console.error('Error updating course:', error);
    }
};

/**
 * Delete a course by its ID.
 * @param course_id - The ID of the course to delete.
 * @returns The ID of the deleted course.
 */
export const deleteCourseById = async (
    course_id: string,
): Promise<string | void> => {
    try {
        const courseDocRef = doc(coursesCollection, course_id);
        await deleteDoc(courseDocRef);
        console.log('Course successfully deleted.');
        return course_id;
    } catch (error) {
        console.error('Error deleting course:', error);
    }
};
