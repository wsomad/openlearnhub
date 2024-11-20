import {getDownloadURL, getStorage, ref, uploadBytes} from 'firebase/storage';
import {downloadAvatarUrl} from '../../api/diceBearApi';

// Define a reference to storage.
const storage = getStorage();

// Define a reference to `users` storage.
const userStorage = ref(storage, 'users');

/**
 * Upload user selected avatar to `user` storage.
 * @param uid
 * @param contentUrl
 */
export const uploadUserAvatar = async (
    uid: string,
    contentUrl: string,
): Promise<string> => {
    try {
        const avatarBlob = await downloadAvatarUrl(contentUrl);
        const avatarRef = ref(userStorage, `${uid}/profile/${contentUrl}`);
        const uploadResult = await uploadBytes(avatarRef, avatarBlob);
        const downloadURL = await getDownloadURL(uploadResult.ref);
        console.log('Avatar successfully uploaded at: ', downloadURL);
        return downloadURL;
    } catch (error) {
        console.error('Failed to upload user avatar', error);
        throw error;
    }
};
