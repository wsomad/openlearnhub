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
import {Course} from '../../types/course';

// Reference to `courses` collection (root reference for courses).
const coursesCollection = collection(db, 'courses');

/**
 * Add a new course to Firestore.
 * @param courseData - The course data to add.
 */
export const addCourse = async (courseData: Course): Promise<Course> => {
    try {
        // Check if course title already exists.
        const isExists = await checkCourseTitle(courseData.course_title);
        if (isExists) {
            throw new Error('A course with this title already exists.');
        }

        // Define a document reference for the course by passing two params: `coursesCollection` and title of course.
        const courseDocRef = doc(coursesCollection, courseData.course_title);
        // Set that document with data belongs to course.
        await setDoc(courseDocRef, courseData);
        console.log('Course successfully added.');
        return {...courseData, course_id: courseDocRef.id};
    } catch (error) {
        console.error('Error creating course:', error);
        throw error;
    }
};

/**
 * Get a course by its ID.
 * @param course_id - The ID of the course to retrieve = title of the course.
 * @returns The course data if found, otherwise `null`.
 */
export const getCourseById = async (
    course_id: string,
): Promise<Course | null> => {
    try {
        // Define the document reference for the course by passing two params: `coursesCollection` and id of course.
        // Course ID = Course Title.
        const courseDocRef = doc(coursesCollection, course_id);
        // Get that document with data belongs to course.
        const courseDoc = await getDoc(courseDocRef);
        // If that document exists, returns data belongs to course.
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
        // Get whole course collection with data belongs to all courses.
        const querySnapshot: QuerySnapshot<DocumentData> = await getDocs(
            coursesCollection,
        );
        // Define an empty array of course.
        const courses: Course[] = [];

        // Iterate each course in course collection to find particular course.
        // Then, all matched queries are pushed into the array of course.
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
        // Get whole course collection with data belongs to all courses.
        const querySnapshot = await getDocs(coursesCollection);
        // Mapped that course collection and get each document within it.
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
        // Define the document reference for the course by passing two params: `coursesCollection` and id of course.
        const courseDocRef = doc(coursesCollection, course_id);
        // Update that document with updated data of the course.
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
        // Define the document reference for the course by passing two params: `coursesCollection` and id of course.
        const courseDocRef = doc(coursesCollection, course_id);
        // Delete that document with data belongs to course.
        await deleteDoc(courseDocRef);
        console.log('Course successfully deleted.');
        return course_id;
    } catch (error) {
        console.error('Error deleting course:', error);
    }
};

/**
 * Check if course title already exists.
 * @param course_title
 * @returns
 */
const checkCourseTitle = async (course_title: string): Promise<boolean> => {
    // Define the document reference for the course by passing two params: `coursesCollection` and title of course.
    const courseDocRef = doc(coursesCollection, course_title);
    // Get that document with data belongs to course.
    const courseDoc = await getDoc(courseDocRef);
    // Return if that document exists.
    return courseDoc.exists();
};
