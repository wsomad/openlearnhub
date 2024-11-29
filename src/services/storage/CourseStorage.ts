import {
    deleteObject,
    getDownloadURL,
    getStorage,
    ref,
    uploadBytes,
} from 'firebase/storage';

// Define a reference to storage.
const storage = getStorage();

// Define a reference to `courses` storage.
const courseStorage = ref(storage, 'courses');

/**
 * Upload course content to `courses` storage.
 * @param course_id
 * @param content_url
 * @param section_id
 */
export const uploadContentToStorage = async (
    course_id: string,
    content_blob: Blob,
    section_id?: string,
    lesson_id?: string,
) => {
    try {
        // Check the condition if section id is not null.
        const filePath =
            section_id != null
                ? `${course_id}/files/${section_id}/${lesson_id}`
                : `${course_id}/thumbnail`;
        // Define a reference to a specific storage.
        const contentRef = ref(courseStorage, filePath);
        // Upload content into that specific storage.
        const uploadResult = await uploadBytes(contentRef, content_blob);
        // Get download url by getting the reference of storage.
        const downloadURL = await getDownloadURL(uploadResult.ref);
        console.log('Content successfully uploaded at: ', downloadURL);
        return downloadURL;
    } catch (error) {
        console.error('Failed to upload content to storage: ', error);
        throw error;
    }
};

/**
 * Delete course content from `courses` storage.
 * @param course_id
 * @param content_blob
 * @param section_id
 */
export const deleteContentFromStorage = async (
    course_id: string,
    content_blob: Blob,
    section_id?: string,
): Promise<void> => {
    try {
        // Check the condition if section id is not null.
        const filePath =
            section_id != null
                ? `${course_id}/files/${section_id}`
                : `${course_id}/thumbnail`;
        // Define a reference to that specific storage.
        const contentRef = ref(courseStorage, `${filePath}/${content_blob}`);
        // Delete content from that specific storage.
        const deleteResult = await deleteObject(contentRef);
        console.log('Content successfully deleted: ', deleteResult);
    } catch (error) {}
};
