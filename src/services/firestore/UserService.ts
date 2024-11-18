import {
    collection,
    doc,
    setDoc,
    getDoc,
    updateDoc,
    deleteDoc,
} from 'firebase/firestore';
import {db} from '../../config/FirebaseConfiguration';
import {User} from '../../types/user'; // Assuming User type is defined here

// Reference to the `users` collection
const userCollection = collection(db, 'users');

/**
 * Add a new user to the Firestore database.
 * @param userData - The user data to add.
 */
export const addUser = async (userData: User): Promise<void> => {
    try {
        // Get a DocumentReference for the user
        const userDocRef = doc(userCollection, userData.uid);
        await setDoc(userDocRef, userData);
    } catch (error) {
        console.error('Failed to create user: ', error);
    }
};

// /**
//  * Add a new instructor user to the Firestore database.
//  * @param userData - The user data to add.
//  */
// export const addUserAsInstructor = async (userData: User): Promise<void> => {
//     try {
//         // Get a DocumentReference for the user
//         const userDocRef = doc(userCollection, userData.uid);
//         const instructorCollection = collection(userDocRef, 'instructor');
//         const instructorDocRef = doc(instructorCollection); // Create a new doc in the instructor subcollection
//         await setDoc(instructorDocRef, userData);
//     } catch (error) {
//         console.error('Failed to create instructor: ', error);
//     }
// };

// /**
//  * Add a new student user to the Firestore database.
//  * @param userData - The user data to add.
//  */
// export const addUserAsStudent = async (userData: User): Promise<void> => {
//     try {
//         // Get a DocumentReference for the user
//         const userDocRef = doc(userCollection, userData.uid);
//         const studentCollection = collection(userDocRef, 'student');
//         const studentDocRef = doc(studentCollection); // Create a new doc in the student subcollection
//         await setDoc(studentDocRef, userData);
//     } catch (error) {
//         console.error('Failed to create student: ', error);
//     }
// };

/**
 * Get user data by user ID.
 * @param uid - The user ID.
 * @returns A Promise containing the user data or undefined if the user is not found.
 */
export const getUserById = async (uid: string): Promise<User | undefined> => {
    try {
        // Get a DocumentReference for the user
        const userDocRef = doc(userCollection, uid);
        const userDoc = await getDoc(userDocRef);
        console.log('Get user data from Firestore: ', userDoc.data());
        return userDoc.data() as User | undefined;
    } catch (error) {
        console.error('Failed to get user: ', error);
    }
};

/**
 * Update user data by user ID.
 * @param uid - The user ID.
 * @param updatedUser - The updated user data.
 * @returns A Promise containing the updated user data.
 */
export const updateUserById = async (
    uid: string,
    updatedUser: Partial<User>,
): Promise<User | undefined> => {
    try {
        // Get a DocumentReference for the user
        const userDocRef = doc(userCollection, uid);
        await updateDoc(userDocRef, updatedUser);
        return {uid, ...updatedUser} as User;
    } catch (error) {
        console.error('Failed to update user: ', error);
    }
};

/**
 * Delete user data by user ID.
 * @param uid - The user ID.
 * @returns A Promise containing the user ID of the deleted user.
 */
export const deleteUserById = async (
    uid: string,
): Promise<string | undefined> => {
    try {
        // Get a DocumentReference for the user
        const userDocRef = doc(userCollection, uid);
        await deleteDoc(userDocRef);
        return uid;
    } catch (error) {
        console.error('Failed to delete user: ', error);
    }
};
