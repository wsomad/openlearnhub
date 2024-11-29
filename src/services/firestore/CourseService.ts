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
    query,
    where,
    orderBy,
    limit,
} from 'firebase/firestore';
import {db} from '../../config/FirebaseConfiguration';
import {Course} from '../../types/course';
import {UserRole} from '../../types/user';

// Reference to `courses` collection (root reference for courses).
const coursesCollection = collection(db, 'courses');

/**
 * Add a new course to Firestore.
 * @param course_data - The course data to add.
 */
export const addCourse = async (course_data: Course): Promise<Course> => {
    try {
        // Check if course title already exists.
        const isExists = await checkCourseTitle(course_data.course_title);
        if (isExists) {
            throw new Error('A course with this title already exists.');
        }
        // Define a document reference for the course by passing two params: `coursesCollection` and title of course.
        const courseDocRef = doc(coursesCollection, course_data.course_id);
        // Set that document with data belongs to course.
        const course = {
            ...course_data,
            course_id: courseDocRef.id,
        } as Course;
        await setDoc(courseDocRef, course);
        console.log(`Course ${courseDocRef.id} successfully added.`);
        return course;
    } catch (error) {
        console.error('Error creating course:', error);
        throw error;
    }
};

/**
 * Get a course by its ID.
 * @param course_id - The ID of the course to retrieve = title of the course.
 * @param userRole - The role of the user ('student' | 'instructor').
 * @param uid - The ID of the user making the request (needed for instructor role).
 * @returns The course data if found and valid, otherwise `null`.
 */
export const getCourseById = async (
    course_id: string,
    userRole: 'student' | 'instructor',
    uid?: string | null,
): Promise<Course | null> => {
    try {
        // Define the document reference for the course by its ID.
        const courseDocRef = doc(coursesCollection, course_id);

        // Get the course document.
        const courseDoc = await getDoc(courseDocRef);

        if (courseDoc.exists()) {
            const course = {
                course_id,
                ...courseDoc.data(),
            } as Course;

            console.log(`Successfully fetched course: ${courseDoc.id}`);

            // Validate based on user role.
            if (userRole === 'instructor') {
                // Ensure the instructor ID matches the course's instructor field.
                if (course.instructor_id !== uid) {
                    console.warn(
                        `Instructor ID mismatch: course instructor is ${course.instructor_id}, but user ID is ${uid}`,
                    );
                    return null; // Instructor cannot edit a course they don't own.
                }
            }
            return course;
        } else {
            console.log('No such course found.');
            return null;
        }
    } catch (error) {
        console.error('Error getting course:', error);
        return null;
    }
};

/**
 * Get courses that match a specific query.
 * @param search_query - The search string to filter courses by title.
 * @returns An array of matching courses.
 */
export const searchSpecificCourse = async (
    search_query: string,
    uid?: string,
    user_role?: 'student' | 'instructor',
): Promise<Course[]> => {
    try {
        // Fetch the entire course collection
        const querySnapshot: QuerySnapshot<DocumentData> = await getDocs(
            coursesCollection,
        );

        // Initialize an empty array for storing filtered courses
        const courses: Course[] = [];

        // Iterate over each document in the course collection
        querySnapshot.forEach((doc) => {
            const courseData = doc.data();
            const courseTitle = courseData.course_title?.toLowerCase() ?? '';

            // Check if the course title matches the search query
            if (courseTitle.includes(search_query.toLowerCase())) {
                if (user_role === 'student') {
                    // For students, include all matching courses
                    courses.push({course_id: doc.id, ...courseData} as Course);
                } else if (
                    user_role === 'instructor' &&
                    courseData.instructor_id === uid
                ) {
                    // For instructors, only include courses they own
                    courses.push({course_id: doc.id, ...courseData} as Course);
                }
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
export const getAllCourses = async (
    uid: string | null,
    userRole: 'student' | 'instructor',
    filterType: 'default' | 'enrollment' | 'creator',
    readyForPublish?: boolean,
    limitCount?: number,
): Promise<Course[]> => {
    try {
        // Query the collection.
        let coursesQuery = query(coursesCollection);

        // Apply filters based on `filterType` and `userRole`.
        if (filterType === 'creator' && userRole === 'instructor') {
            coursesQuery = query(
                coursesCollection,
                where('instructor_id', '==', uid),
            );
        } else if (filterType === 'default' && userRole === 'student') {
            // if (uid && readyForPublish === true) {
            //     coursesQuery = query(
            //         coursesCollection,
            //         //where('enrolled_students', 'array-contains', uid),
            //         where('ready_for_publish', '!=', false),
            //     );
            // } else {
            //     console.warn('UID is null. Courses cannot be filtered.');
            // }
            if (readyForPublish === true) {
                coursesQuery = query(
                    coursesCollection,
                    where('ready_for_publish', '==', true), // Only fetch published courses
                );
            } else {
                console.warn(
                    'readyForPublish is undefined for student filter.',
                );
            }
        }

        // Order by creation date if we are fetching a limited number of courses.
        if (limitCount) {
            coursesQuery = query(
                coursesQuery,
                orderBy('course_created_at', 'desc'),
                limit(limitCount),
            );
        }

        // Get that documents.
        const querySnapshot = await getDocs(coursesQuery);

        // Map that documents to an array of courses.
        const courses = querySnapshot.docs.map((doc) => ({
            course_id: doc.id,
            ...doc.data(),
        })) as Course[];

        console.log('Fetched courses:', courses);
        return courses;
    } catch (error) {
        console.error('Error fetching courses:', error);
        return [];
    }
};

/**
 * Update a course by its ID.
 * @param course_id - The ID of the course to update.
 * @param updated_course - The updated course data.
 * @returns The updated course data.
 */
export const updateCourseById = async (
    course_id: string,
    updated_course: Partial<Course>,
): Promise<Course | void> => {
    try {
        // Define the document reference for the course by passing two params: `coursesCollection` and id of course.
        const courseDocRef = doc(coursesCollection, course_id);
        // Update that document with updated data of the course.
        await updateDoc(courseDocRef, updated_course);
        const course = {
            course_id,
            ...updated_course,
        } as Course;
        return course;
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

// export const getAllCourses = async (
//     uid: string | null,
//     userRole: 'student' | 'instructor',
//     filterType: 'default' | 'enrolled' | 'created',
//     limitCount?: number,
// ): Promise<Course[]> => {
//     try {
//         // Fetch all documents from the courses collection.
//         // const querySnapshot = await getDocs(coursesCollection);
//         const querySnapshot = query(coursesCollection);

//         // Map the documents to an array of courses.
//         // const courses = querySnapshot.docs.map((doc) => ({
//         //     course_id: doc.id,
//         //     ...doc.data(),
//         // })) as Course[];

//         let filteredCourses: Course[];

//         // Filter courses based on the filter type and user role.
//         if (filterType === 'created' && userRole === 'instructor') {
//             // Fetch courses where uid matches the instructor's uid.
//             // filteredCourses = courses.filter(
//             //     (course) => course.instructor_id === uid,
//             // );
//             querySnapshot = query();
//             console.log(
//                 'Successfully fetch all courses created by this instructor: ',
//                 uid,
//             );
//         } else if (filterType === 'enrolled' && userRole === 'student') {
//             if (uid) {
//                 filteredCourses = courses.filter((course) =>
//                     course.enrolled_students?.includes(uid),
//                 );
//             } else {
//                 console.warn('UID is null; cannot filter enrolled courses.');
//                 filteredCourses = []; // Return an empty array if uid is null
//             }
//         } else {
//             // Default case: fetch all courses.
//             filteredCourses = courses;
//         }

//         console.log('Filtered courses:', filteredCourses);
//         return filteredCourses;
//     } catch (error) {
//         console.error('Error fetching courses:', error);
//         return [];
//     }
// };
