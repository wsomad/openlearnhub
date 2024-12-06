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

const userCollection = collection(db, 'users');

export const addUser = async (
    userData: User,
    //updatedUser: Partial<User>,
    avatarUrl?: string,
): Promise<void> => {
    try {
        let userAvatar = userData.profile_image;
        if (avatarUrl) {
            userAvatar = await updateUserAvatar(userData.uid, avatarUrl);
        }
        const userDocRef = doc(userCollection, userData.uid);
        await setDoc(userDocRef, userData);
    } catch (error) {
        console.error('Failed to create user: ', error);
    }
};

export const getUserById = async (uid: string): Promise<User | undefined> => {
    try {
        const userDocRef = doc(userCollection, uid);
        const userDoc = await getDoc(userDocRef);
        console.log('Get user data from Firestore: ', userDoc.data());
        return userDoc.data() as User | undefined;
    } catch (error) {
        console.error('Failed to get user: ', error);
    }
};

export const updateUserById = async (
    uid: string,
    updatedUser: Partial<User>,
    avatarUrl?: string,
): Promise<User | undefined> => {
    try {
        let userAvatar = updatedUser.profile_image;

        if (avatarUrl) {
            userAvatar = await updateUserAvatar(uid, avatarUrl);
        }

        const userDocRef = doc(userCollection, uid);

        await updateDoc(userDocRef, {
            ...updatedUser,
            ...(updatedUser.student ? { student: updatedUser.student } : {}),
            ...(updatedUser.instructor ? { instructor: updatedUser.instructor } : {}),
        });

        console.log('What is user profile ima?', userAvatar)

        return {
            uid,
            ...updatedUser,
            //profile_image: userAvatar || updatedUser.profile_image,
        } as User;
    } catch (error) {
        console.error('Failed to update user: ', error);
    }
};

export const deleteUserById = async (
    uid: string,
): Promise<string | undefined> => {
    try {
        const userDocRef = doc(userCollection, uid);
        await deleteDoc(userDocRef);
        return uid;
    } catch (error) {
        console.error('Failed to delete user: ', error);
    }
};

export const updateUserAvatar = async (
    uid: string,
    contentUrl: string,
): Promise<string> => {
    try {
        const downloadUrl = await uploadUserAvatar(uid, contentUrl);
        return downloadUrl;
    } catch (error) {
        console.error('Failed to update user avatar', error);
        throw error;
    }
};


// export const updateUserById = async (
//     uid: string,
//     updatedUser: Partial<User>,
//     avatarUrl?: string,
// ): Promise<User | undefined> => {
//     try {
//         let userAvatar = updatedUser.profile_image;

//         if (avatarUrl) {
//             userAvatar = await updateUserAvatar(uid, avatarUrl);
//         }

//         const userDocRef = doc(userCollection, uid);

//         // Fetch the current user data
//         const userSnapshot = await getDoc(userDocRef);
//         if (!userSnapshot.exists()) {
//             throw new Error(`User with ID ${uid} does not exist.`);
//         }

//         const currentUserData = userSnapshot.data();

//         // Merge updated data for student and instructor fields if they exist
//         const updatedData = {
//             ...updatedUser,
//             ...(updatedUser.student
//                 ? {
//                       student: {
//                           ...(currentUserData.student || {}), // Existing student data or empty object
//                           ...updatedUser.student, // Updated fields
//                       },
//                   }
//                 : {}),
//             ...(updatedUser.instructor
//                 ? {
//                       instructor: {
//                           ...(currentUserData.instructor || {}), // Existing instructor data or empty object
//                           ...updatedUser.instructor, // Updated fields
//                       },
//                   }
//                 : {}),
//         };

//         // Update the document
//         await updateDoc(userDocRef, updatedData);

//         console.log('User updated successfully:', updatedData);

//         return {
//             uid,
//             ...updatedUser,
//             profile_image: userAvatar || updatedUser.profile_image,
//         } as User;
//     } catch (error) {
//         console.error('Failed to update user: ', error);
//     }
// };
