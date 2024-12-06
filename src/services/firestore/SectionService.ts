import {
	collection,
	deleteDoc,
	doc,
	getDoc,
	getDocs,
	setDoc,
	updateDoc,
	writeBatch,
} from 'firebase/firestore';

import { db } from '../../config/FirebaseConfiguration';
import { Section } from '../../types/section';

/**
 * Add new section to specific course.
 * @param course_id
 * @param section_data
 */
export const addSections = async (
    course_id: string,
    section_data: Section, // Use a plural name for clarity
): Promise<Section> => {
    try {
        const sectionDocRef = doc(
            collection(db, `courses/${course_id}/sections`),
            section_data.section_title,
        );
        console.log('Section ID:', sectionDocRef.id); // Will print the section_title used as the ID

        // Add the section data to Firestore
        await setDoc(sectionDocRef, {
            ...section_data, // Spread the section data to store it in Firestore
            section_id: sectionDocRef.id, // Make sure to store the course_id if needed
        });

        console.log(
            `Successfully added section with title ${section_data.section_title} to course ${course_id}.`,
        );
        // const addedSections: Section[] = [];
        // // Loop through each section and add it to Firestore
        // for (const section of sections_data) {
        //     // Use the section_title as the document ID for each section

        // }
        // return addedSections; // Return the array of added sections
        return section_data;
    } catch (error) {
        console.error('Error adding sections:', error);
        throw error;
    }
};

// export const addSection = async (
//     course_id: string,
//     section_data: Section[],
// ): Promise<Section> => {
//     try {
//         // Define a document reference based on specific section under specific course.
//         const sectionDocRef = doc(
//             collection(db, `courses/${course_id}/sections`),
//             section_data.section_title, // Section title is used as the document ID.
//         );

//         // Add the generated document ID to section_data.
//         section_data.section_id = sectionDocRef.id;

//         // Set that document reference with updated section data.
//         await setDoc(sectionDocRef, section_data);

//         console.log(
//             `Successfully added section ${section_data.section_id} to course ${course_id}.`,
//         );

//         return section_data; // Return the updated section object.
//     } catch (error) {
//         console.error('Error adding section:', error);
//         throw error;
//     }
// };

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
            collection(db, `courses/${course_id}/sections`),
            section_id,
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
    section_id: string,
    section: Partial<Section> | Partial<Section>[],
): Promise<Section | void> => {
    try {
        if (Array.isArray(section)) {
            // Define write batch for multiple data updates.
            const batch = writeBatch(db);

            // Iterate over sections and create references for each one.
            section.forEach((updatedData) => {
                if (updatedData.section_id) {
                    const sectionDocRef = doc(
                        db,
                        `courses/${course_id}/sections/${updatedData.section_id}`,
                    );
                    batch.update(sectionDocRef, {
                        ...updatedData,
                        section_order: updatedData.section_order,
                    });
                } else {
                    console.warn(
                        'Skipping update for a section without an ID.',
                    );
                }
            });

            // Commit updated batch.
            await batch.commit();
            console.log(
                `Successfully updated ${section.length} sections under course ${course_id}.`,
            );
        } else {
            if (!course_id || !section_id) {
                throw new Error(
                    `Invalid arguments: course_id (${course_id}) and section_id (${section_id}) must be defined.`,
                );
            }
            // For single section updates, create a specific document reference.
            const sectionDocRef = doc(
                db,
                `courses/${course_id}/sections/${section_id}`,
            );

            // Update that document with the provided data.
            await updateDoc(sectionDocRef, {...section});
            console.log(
                `Successfully updated section ${section_id} under course ${course_id}.`,
            );
        }
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
