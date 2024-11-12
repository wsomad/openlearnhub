import {doc, setDoc, getDoc, updateDoc, deleteDoc} from 'firebase/firestore';
import {db} from '../config/firebaseConfiguration';

export const addCourse = async (courseData) => {
    try {
        const courseDocRef = doc(db, 'courses');
        const courseDoc = await setDoc(courseDocRef, courseData);
        return {course_id: courseDoc.id, ...courseData};
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
            //return courseDoc.data();
        } else {
            console.log('No such course.');
            //return null;
        }
    } catch (error) {
        console.error('Error getting course: ', error.message);
    }
};

export const getAllCourses = async () => {
    try {
        const courseDocRef = doc(db, 'courses');
        const courseDoc = await getDoc(courseDocRef);
        const courses = courseDoc.docs.map((doc) => ({
            course_id: doc.id,
            ...doc.data(),
        }));
        console.log('All courses data: ', courses);
        // return courses;
    } catch (error) {
        console.log('Error getting all courses: ', error.message);
    }
};

export const updateCourse = async (course_id, updatedCourse) => {
    try {
        const courseDoc = doc(doc, 'courses', course_id);
        await updateDoc(courseDoc, updatedCourse);
        return {id, ...updateCourse};
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
