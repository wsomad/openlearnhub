// FirestoreUserService.js
import {doc, setDoc, getDoc} from 'firebase/firestore';
import {db} from './FirebaseConfiguration';
import UserModel from '../models/UserModel';

export const createUserDocument = async (userData) => {
    try {
        const userDocRef = doc(db, 'users', userData.uid);
        await setDoc(userDocRef, userData);
    } catch (error) {
        console.error('Error creating user document:', error.message);
    }
};

export const fetchUserDocument = async (uid) => {
    const userDocRef = doc(db, 'user', uid);
    const userDoc = await getDoc(userDocRef);
    console.log('Get user data from firestore');
    return userDoc.exists() ? fromJSON(userDoc) : null;
};
