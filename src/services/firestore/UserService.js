// In this service, it has:

// addUser
// getUserById
// updateUserById
// deleteUserById

import {
    collection,
    doc,
    setDoc,
    getDoc,
    updateDoc,
    deleteDoc,
} from 'firebase/firestore';
import {db} from '../../config/firebaseConfiguration';

const userCollection = collection(db, 'users');

export const addUser = async (userData) => {
    try {
        const userDocRef = doc(userCollection, userData.uid);
        await setDoc(userDocRef, userData);
    } catch (error) {
        console.error('Failed to create user: ', error);
    }
};

export const addUserAsInstructor = async (userData) => {
    try {
        const userDocRef = doc(userCollection, userData.uid);
        const instructorCollection = collection(userDocRef, 'instructor');
        await setDoc(instructorCollection, userData);
    } catch (error) {
        console.error('Failed to create instructor: ', error);
    }
};

export const addUserAsStudent = async (userData) => {
    try {
        const userDocRef = doc(userCollection, userData.uid);
        const studentCollection = collection(userDocRef, 'student');
        await setDoc(studentCollection, userData);
    } catch (error) {
        console.error('Failed to create student: ', error);
    }
};

export const getUserById = async (uid) => {
    try {
        const userDocRef = doc(userCollection, uid);
        const userDoc = await getDoc(userDocRef);
        console.log('Get user data from firestore: ', userDoc.data());
        return userDoc.data();
    } catch (error) {
        console.error('Failed to get user: ', error);
    }
};

export const updateUserById = async (uid, updatedUser) => {
    try {
        const userDoc = doc(db, 'users', uid);
        await updateDoc(userDoc, updatedUser);
        return {uid, ...updatedUser};
    } catch (error) {
        console.error('Failed to update user: ', error);
    }
};

export const deleteUserById = async (uid) => {
    try {
        const userDoc = doc(db, 'users', uid);
        await deleteDoc(userDoc);
        return uid;
    } catch (error) {
        console.error('Failed to delete user: ', error);
    }
};
