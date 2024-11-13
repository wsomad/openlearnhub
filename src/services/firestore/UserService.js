// In this service, it has:

// addUser
// getUserById
// updateUserById
// deleteUserById

import {doc, setDoc, getDoc, updateDoc, deleteDoc} from 'firebase/firestore';
import {db} from '../../config/firebaseConfiguration';

export const addUser = async (userData) => {
    try {
        const userDocRef = doc(db, 'users', userData.uid);
        await setDoc(userDocRef, userData);
    } catch (error) {
        console.error('Error creating user document:', error.message);
    }
};

export const getUserById = async (uid) => {
    const userDocRef = doc(db, 'users', uid);
    const userDoc = await getDoc(userDocRef);
    console.log('Get user data from firestore: ', userDoc.data());
    return userDoc.data();
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
