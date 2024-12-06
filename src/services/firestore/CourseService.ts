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
                if (course.instructor_id !== uid) {
                    console.warn(
                        `Instructor ID mismatch: course instructor is ${course.instructor_id}, but user ID is ${uid}`,
                    );
                    return null;
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

export const getAllCourses = async (
    uid: string | null,
    userRole: 'student' | 'instructor',
    filterType: 'default' | 'enrollment' | 'creator',
    sortBy?: 'newest' | 'oldest' | 'popular',
    readyForPublish?: boolean,
    limitCount?: number,
    courseType?: string[]
): Promise<Course[]> => {
    try {
        let coursesQuery = query(coursesCollection);

        // Apply filters based on filterType
        if (filterType === 'creator' && userRole === 'instructor') {
            coursesQuery = query(coursesCollection, where('instructor_id', '==', uid));
        } else if (filterType === 'default' && userRole === 'student') {
            if (readyForPublish) {
                coursesQuery = query(
                    coursesCollection,
                    where('ready_for_publish', '==', true)
                );
            } else {
                console.warn('Fetching default courses: readyForPublish is undefined.');
            }
        }

        // Apply course type filter
        if (courseType && courseType.length > 0) {
            coursesQuery = query(coursesQuery, where('course_type', 'in', courseType)); // Use the "in" operator for multiple values
        }

        // Apply sorting based on sortBy
        if (sortBy === 'newest') {
            coursesQuery = query(coursesQuery, orderBy('course_created_at', 'desc'));
        } else if (sortBy === 'oldest') {
            coursesQuery = query(coursesQuery, orderBy('course_created_at', 'asc'));
        } else if (sortBy === 'popular') {
            coursesQuery = query(
                coursesQuery,
                where('course_enrollment_number', '>', 0),
                orderBy('course_enrollment_number', 'desc')
            );
        }

        // Apply limit filter
        if (limitCount) {
            coursesQuery = query(coursesQuery, limit(limitCount));
        }

        // Fetch and transform results
        const querySnapshot = await getDocs(coursesQuery);
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

// /**
//  * Fetch all courses from Firestore based on filters.
//  * @param uid - User ID (required for certain filters like creator).
//  * @param userRole - Role of the user (student or instructor).
//  * @param filterType - Type of filter to apply (default, enrollment, or creator).
//  * @param readyForPublish - Fetch only courses ready for publish (optional).
//  * @param limitCount - Maximum number of courses to fetch (optional).
//  * @param popularCourses - Fetch courses sorted by enrollment (optional).
//  * @returns An array of courses matching the filters.
//  */
// export const getAllCourses = async (
//     uid: string | null,
//     userRole: 'student' | 'instructor',
//     filterType: 'default' | 'enrollment' | 'creator',
//     readyForPublish?: boolean,
//     limitCount?: number,
//     popularCourses?: boolean,
// ): Promise<Course[]> => {
//     try {
//         let coursesQuery = query(coursesCollection);

//         // Apply filters based on filterType
//         if (filterType === 'creator' && userRole === 'instructor') {
//             coursesQuery = query(coursesCollection, where('instructor_id', '==', uid));
//         } else if (filterType === 'default' && userRole === 'student') {
//             if (readyForPublish) {
//                 coursesQuery = query(
//                     coursesCollection,
//                     where('ready_for_publish', '==', true)
//                 );
//             } else {
//                 console.warn('Fetching default courses: readyForPublish is undefined.');
//             }
//         }

//         // Apply popular courses and limit filters
//         if (popularCourses && limitCount) {
//             coursesQuery = query(
//                 coursesQuery,
//                 where('course_enrollment_number', '!=', 0),
//                 orderBy('course_enrollment_number', 'desc'),
//                 limit(limitCount)
//             );
//         } else if (limitCount) {
//             coursesQuery = query(
//                 coursesQuery,
//                 orderBy('course_created_at', 'desc'),
//                 limit(limitCount)
//             );
//         }

//         // Fetch and transform results
//         const querySnapshot = await getDocs(coursesQuery);
//         const courses = querySnapshot.docs.map((doc) => ({
//             course_id: doc.id,
//             ...doc.data(),
//         })) as Course[];

//         console.log('Fetched courses:', courses);
//         return courses;
//     } catch (error) {
//         console.error('Error fetching courses:', error);
//         return [];
//     }
// };
