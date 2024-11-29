import {
    collection,
    doc,
    setDoc,
    getDoc,
    updateDoc,
    deleteDoc,
} from 'firebase/firestore';
import {db} from '../../config/FirebaseConfiguration';
import {User} from '../../types/user';
import {uploadUserAvatar} from '../storage/UserStorage';

// Reference to the `users` collection (root reference of user).
const userCollection = collection(db, 'users');

/**
 * Add a new user to the Firestore database.
 * @param userData - The user data to add.
 */
export const addUser = async (
    userData: User,
    //updatedUser: Partial<User>,
    avatarUrl?: string,
): Promise<void> => {
    try {
        // Define initial value for user avatar.
        let userAvatar = userData.profile_image;
        // If new avatar url is provided, then add it.
        if (avatarUrl) {
            userAvatar = await updateUserAvatar(userData.uid, avatarUrl);
        }
        // Define a document reference for the user by passing two params: `userCollection` and uid of user.
        const userDocRef = doc(userCollection, userData.uid);
        // Set that document with data belongs to user.
        await setDoc(userDocRef, userData);
    } catch (error) {
        console.error('Failed to create user: ', error);
    }
};

/**
 * Get user data by user ID.
 * @param uid - The user ID.
 * @returns - A Promise containing the user data or undefined if the user is not found.
 */
export const getUserById = async (uid: string): Promise<User | undefined> => {
    try {
        // Define the document reference for the user by passing two params: `userCollection` and uid of user.
        const userDocRef = doc(userCollection, uid);
        // Get that document with data belongs to user.
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
    avatarUrl?: string,
): Promise<User | undefined> => {
    try {
        // Define initial value for user avatar.
        let userAvatar = updatedUser.profile_image;
        // If new avatar url is provided, then update it.
        if (avatarUrl) {
            userAvatar = await updateUserAvatar(uid, avatarUrl);
        }
        // Define the document reference for the user by passing two params: `userCollection` and uid of user.
        const userDocRef = doc(userCollection, uid);
        // Update that document with updated data of the user.
        await updateDoc(userDocRef, updatedUser);
        console.log('Let see what is user avatar', userAvatar);
        console.log(
            'Let see what is profile picture:',
            updatedUser.profile_image,
        );
        return {
            uid,
            ...updatedUser,
            profile_image: userAvatar || updatedUser.profile_image,
        } as User;
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
        // Define the document reference for the user by passing two params: `userCollection` and uid of user.
        const userDocRef = doc(userCollection, uid);
        // Delete that document with data belongs to user.
        await deleteDoc(userDocRef);
        return uid;
    } catch (error) {
        console.error('Failed to delete user: ', error);
    }
};

/**
 * Update user avatar.
 * @param uid
 * @param contentUrl
 * @returns
 */
export const updateUserAvatar = async (
    uid: string,
    contentUrl: string,
): Promise<string> => {
    try {
        // Download avatar url with given url.
        const downloadUrl = await uploadUserAvatar(uid, contentUrl);
        return downloadUrl;
    } catch (error) {
        console.error('Failed to update user avatar', error);
        throw error;
    }
};
