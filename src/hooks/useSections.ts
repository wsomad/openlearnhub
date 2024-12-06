import { useDispatch, useSelector } from 'react-redux';

import {
	deleteLessonById,
	getAllLessons,
} from '../services/firestore/LessonService';
import {
	addSections,
	deleteSectionById,
	getAllSections,
	getSectionById,
	updateSectionById,
} from '../services/firestore/SectionService';
import {
	clearSection,
	clearSections,
	clearSingleSection,
	modifySection,
	resetSectionState,
	setSection,
	setSections,
} from '../store/slices/sectionSlice';
import { RootState } from '../store/store';
import { Section } from '../types/section';

export const useSections = () => {
    const dispatch = useDispatch();
    const selectedSection = useSelector(
        (state: RootState) => state.sections.selectedSection,
    );
    const allSections = useSelector(
        (state: RootState) => state.sections.allSections,
    );

    /**
     * Create new sections.
     * @param course_id
     * @param section
     */
    const createSections = async (
        course_id: string,
        section: Omit<Section, 'section_id'>,
    ): Promise<void> => {
        // try {
        //     await addSection(course_id, section);
        //     dispatch(setSections([...allSections, section]));
        //     console.log('Section created successfully: ');
        // } catch (error) {
        //     console.error('Failed to create section: ', error);
        // }
        try {
            const newSection = {
                ...section,
                section_id: '', // This will be set by Firebase
            };
            const addedSection = await addSections(course_id, newSection);
            // dispatch(setSections([...allSections, sections]));
            dispatch(setSection(addedSection));
            console.log('Sections created successfully:');
        } catch (error) {
            console.error('Failed to create sections:', error);
        }
    };

    /**
     * Fetch section by ID.
     * @param course_id
     * @param section_id
     */
    const fetchSectionById = async (
        course_id: string,
        section_id: string,
    ): Promise<void> => {
        try {
            const section = await getSectionById(course_id, section_id);
            if (section) {
                dispatch(setSection(section));
                console.log('Section fetched successfully:', section);
            }
        } catch (error) {
            console.error('Failed to fetch specific section:', error);
        }
    };

    /**
     * Fetch all sections.
     * @param course_id
     */
    const fetchAllSections = async (course_id: string): Promise<void> => {
        try {
            const sections = await getAllSections(course_id);
            if (sections) {
                dispatch(setSections(sections));
                console.log('All sections fetched successfully:', sections);
            }
        } catch (error) {
            console.error('Failed to fetch all sections:', error);
        }
    };

    /**
     * Update section by ID.
     * @param course_id
     * @param update_section
     */
    const updateSection = async (
        course_id: string,
        section_id: string,
        update_section: Partial<Section> | Partial<Section>[],
    ): Promise<void> => {
        try {
            const updatedSection = Array.isArray(update_section)
                ? update_section
                : [update_section];

            for (const updates of updatedSection) {
                await updateSectionById(course_id, section_id, {
                    ...updates,
                    section_id: section_id,
                });

                dispatch(
                    modifySection({
                        id: section_id,
                        updatedSectionObject: updates,
                    }),
                );
            }

            console.log('Sections updated successfully.');
        } catch (error) {
            console.error('Failed to update sections:', error);
        }
    };

    // const updateSection = async (
    //     course_id: string,
    //     section_id: string,
    //     update_section: Partial<Section>[],
    // ): Promise<void> => {
    //     try {
    //         // Ensure update_section is always treated as an array.
    //         if (Array.isArray(update_section)) {
    //             await updateSectionById(course_id, section_id, update_section);

    //             // Dispatch updates to Redux for each updated section.
    //             update_section.forEach((updatedData) => {
    //                 dispatch(
    //                     modifySection({
    //                         id: course_id,
    //                         updatedSectionObject: updatedData,
    //                     }),
    //                 );
    //             });
    //         } else {
    //             console.error(
    //                 'Expected update_section to be an array of partial updates.',
    //             );
    //         }
    //     } catch (error) {
    //         console.error('Failed to update section:', error);
    //     }
    // };

    // const updateSection = async (
    //     course_id: string,
    //     section_id: string,
    //     update_section: Partial<Section>[],
    // ): Promise<void> => {
    //     try {
    //         if (Array.isArray(update_section)) {
    //             await updateSectionById(course_id, section_id, update_section);
    //             update_section.forEach((updatedData) => {
    //                 dispatch(
    //                     modifySection({
    //                         id: course_id,
    //                         updatedSectionObject: updatedData || [],
    //                     }),
    //                 );
    //             });
    //         } else {
    //             const updated = await updateSectionById(
    //                 course_id,
    //                 section_id,
    //                 update_section,
    //             );
    //             if (updated) {
    //                 dispatch(
    //                     modifySection({
    //                         id: course_id,
    //                         updatedSectionObject: update_section,
    //                     }),
    //                 );
    //                 console.log('Section updated successfully:', updated);
    //             }
    //         }
    //     } catch (error) {
    //         console.error('Failed to update section:', error);
    //     }
    // };

    /**
     * Delete section by ID.
     * @param course_id
     * @param section_id
     */
    const deleteSection = async (
        course_id: string | null,
        section_id: string | null,
    ): Promise<void> => {
        try {
            // Validate input
            if (!course_id || !section_id) {
                console.error('Both course id and section id are required.');
                return;
            }

            // First delete all lessons in the section
            const sectionLessons = await getAllLessons(course_id, section_id);
            await Promise.all(
                sectionLessons.map((lesson) =>
                    deleteLessonById(course_id, section_id, lesson.lesson_id),
                ),
            );

            // Delete the section itself
            await deleteSectionById(course_id, section_id);

            // Get remaining sections and reorder them
            const sections = await getAllSections(course_id);
            const remainingSections = sections
                .filter((s) => s.section_id !== section_id)
                .sort((a, b) => a.section_order - b.section_order)
                .map((s, idx) => ({
                    ...s,
                    section_order: idx + 1,
                }));

            // Update each section's order in Firebase
            await updateSectionById(course_id, section_id, remainingSections);

            // Update Redux store
            dispatch(setSections(remainingSections));
            dispatch(clearSection(section_id));

            console.log('Section deleted successfully.');
        } catch (error) {
            console.error('Failed to delete section:', error);
            throw error;
        }
    };

    const setSelectedSection = (section: Section) => {
        dispatch(setSection(section));
    };

    const clearSelectedSection = () => {
        dispatch(clearSingleSection());
    };

    const clearAllSections = () => {
        dispatch(clearSections());
    };

    const resetSectionsState = () => {
        dispatch(resetSectionState());
    };

    return {
        selectedSection,
        allSections,
        createSections,
        fetchSectionById,
        fetchAllSections,
        updateSection,
        deleteSection,
        setSelectedSection,
        clearSelectedSection,
        clearAllSections,
        resetSectionsState,
    };
};
