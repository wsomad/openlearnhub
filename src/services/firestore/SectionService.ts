import {
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    setDoc,
    updateDoc,
} from 'firebase/firestore';
import {Section} from '../../types/section';
import {db} from '../../config/FirebaseConfiguration';

/**
 * Add new section to specific course.
 * @param course_id
 * @param section_data
 */
export const addSection = async (
    course_id: string,
    section_data: Section,
): Promise<void> => {
    try {
        // Define a document reference based on specific section under specific course.
        const sectionDocRef = doc(
            collection(db, `courses/${course_id}/sections`),
            section_data.section_id,
        );
        // Set that document reference with data belongs to section.
        await setDoc(sectionDocRef, section_data);
        console.log(
            `Successfully added section ${section_data.section_id} to course ${course_id}.`,
        );
    } catch (error) {
        console.error('Error adding section:', error);
        throw error;
    }
};

/**
 * Get specific section under specific course.
 * @param course_id
 * @param section_id
 * @returns
 */
export const getSectionById = async (
    course_id: string,
    section_id: string,
): Promise<Section | null> => {
    try {
        const sectionDocRef = doc(
            collection(db, `courses/${course_id}/sections/${section_id}`),
        );
        const sectionDoc = await getDoc(sectionDocRef);
        if (sectionDoc.exists()) {
            const section = {
                section_id,
                ...sectionDoc.data(),
            } as Section;
            console.log(`Successfully get data from section ${sectionDoc.id}.`);
            return section;
        } else {
            console.log('No such section.');
            return null;
        }
    } catch (error) {
        console.error('Error getting section:', error);
        return null;
    }
};

/**
 * Get all sections under specific course.
 * @param course_id
 * @returns
 */
export const getAllSections = async (course_id: string): Promise<Section[]> => {
    try {
        // Define the collection reference that points to sections path.
        const sectionCollectionRef = collection(
            db,
            `courses/${course_id}/sections`,
        );
        // Get that whole collection with data belongs to all sections.
        const snapshot = await getDocs(sectionCollectionRef);
        // Mapped that section collection and get each document within it.
        const sections = snapshot.docs.map((doc) => ({
            section_id: doc.id,
            ...doc.data(),
        })) as Section[];
        console.log(
            `Successfully get all sections ${sections} under course ${course_id}`,
        );
        return sections;
    } catch (error) {
        console.error('Error fetching sections:', error);
        throw error;
    }
};

/**
 * Update a section by ID.
 * @param course_id
 * @param section
 */
export const updateSectionById = async (
    course_id: string,
    section: Partial<Section>,
): Promise<Section | void> => {
    try {
        // Define a document reference that points to specific section.
        const sectionDocRef = doc(
            db,
            `courses/${course_id}/sections/${section.section_id}`,
        );
        // Update that document with data belongs to a section.
        await updateDoc(sectionDocRef, {...section});
        console.log(
            `Successfully update section ${section.section_id} under course ${course_id}.`,
        );
    } catch (error) {
        console.error('Error updating section:', error);
        throw error;
    }
};

/**
 * Delete a section by Id.
 * @param course_id
 * @param section_id
 */
export const deleteSectionById = async (
    course_id: string,
    section_id: string,
): Promise<void> => {
    try {
        // Define a document reference that points to a specific section.
        const sectionDocRef = doc(
            db,
            `courses/${course_id}/sections/${section_id}`,
        );
        // Delete that document along with their children (lessons).
        await deleteDoc(sectionDocRef);
        console.log(
            `Successfully delete section ${section_id} under course ${course_id}.`,
        );
    } catch (error) {
        console.error('Error deleting section:', error);
        throw error;
    }
};
