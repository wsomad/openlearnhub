// In this service, it has:

// addCourse
// getCourseById
// getSpecificCourse
// getAllCourses
// updateCourseById
// deleteCourseById

import {
    doc,
    setDoc,
    getDoc,
    getDocs,
    updateDoc,
    deleteDoc,
    collection,
} from 'firebase/firestore';
import {db} from '../../config/FirebaseConfiguration';

export const addCourse = async (courseData) => {
    try {
        const courseDocRef = doc(db, 'courses');
        const courseDoc = await setDoc(courseDocRef, courseData);
        return {course_title: courseData.course_title, ...courseData};
    } catch (error) {
        console.error('Error creating course:', error.message);
    }
};

export const getCourseById = async (course_id) => {
    try {
        const courseDocRef = doc(db, 'courses', course_id);
        const courseDoc = await getDoc(courseDocRef);

        if (courseDoc.exists()) {
            console.log('Course data: ', courseDoc.data());
            return courseDoc.data();
        } else {
            console.log('No such course.');
            return null;
        }
    } catch (error) {
        console.error('Error getting course: ', error.message);
    }
};

export const getSpecificCourse = async (searchQuery) => {
    try {
        const coursesRef = collection(db, 'courses'); // Reference to the 'courses' collection
        const querySnapshot = await getDocs(coursesRef); // Get all documents in the 'courses' collection

        const courses = [];
        querySnapshot.forEach((doc) => {
            // Here, doc.id is the course title, so we can check if it matches the search query
            if (doc.id.toLowerCase().includes(searchQuery.toLowerCase())) {
                // Push matching course documents into the array
                courses.push({...doc.data(), course_title: doc.id}); // Add doc.id as course_title
            }
        });
        return courses; // Return all the matching courses
    } catch (error) {
        console.error('Error searching courses:', error);
        throw new Error('Failed to search courses');
    }
};

export const getAllCourses = async () => {
    try {
        const courseDocRef = collection(db, 'courses');
        const courseDoc = await getDocs(courseDocRef);
        const courses = courseDoc.docs.map((doc) => ({
            course_id: doc.id,
            ...doc.data(),
        }));
        console.log('All courses data: ', courses);
        return courses;
    } catch (error) {
        console.log('Error getting all courses: ', error.message);
    }
};

export const updateCourseById = async (course_id, updatedCourse) => {
    try {
        const courseDoc = doc(doc, 'courses', course_id);
        await updateDoc(courseDoc, updatedCourse);
        return {course_id, ...updatedCourse};
    } catch (error) {
        console.error('Error updating course: ', error.message);
    }
};

export const deleteCourseById = async (course_id) => {
    try {
        const courseDoc = doc(db, 'courses', course_id);
        await deleteDoc(courseDoc);
        return course_id;
    } catch (error) {
        console.log('Error deleting course: ', error.message);
    }
};
