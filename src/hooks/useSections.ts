import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../store/store';
import {Section} from '../types/section';
import {
    addSection,
    deleteSectionById,
    getAllSections,
    getSectionById,
    updateSectionById,
} from '../services/firestore/SectionService';
import {
    clearSection,
    modifySection,
    setSection,
    setSections,
} from '../store/slices/sectionSlice';

export const useSection = () => {
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
        section: Section,
    ): Promise<void> => {
        try {
            await addSection(course_id, section);
            dispatch(setSections([...allSections, section]));
            console.log('Section created successfully: ');
        } catch (error) {
            console.error('Failed to create section: ', error);
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
        if (allSections.length > 0) {
            console.log('Sections already in Redux, skipping fetch.');
            return;
        }
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
        update_section: Partial<Section>,
    ): Promise<void> => {
        try {
            const updated = await updateSectionById(course_id, update_section);
            if (updated) {
                dispatch(
                    modifySection({
                        id: course_id,
                        updatedSectionObject: update_section,
                    }),
                );
                console.log('Section updated successfully:', updated);
            }
        } catch (error) {
            console.error('Failed to update section:', error);
        }
    };

    /**
     * Delete section by ID.
     * @param course_id
     * @param section_id
     */
    const deleteSection = async (
        course_id: string,
        section_id: string,
    ): Promise<void> => {
        try {
            await deleteSectionById(course_id, section_id);
            dispatch(clearSection(section_id));
            console.log('Section deleted successfully.');
        } catch (error) {
            console.error('Failed to delete section:', error);
        }
    };

    return {
        selectedSection,
        allSections,
        createSections,
        fetchSectionById,
        fetchAllSections,
        updateSection,
        deleteSection,
    };
};
