import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {Section} from '../../types/section';

// Define the SectionState type.
interface SectionState {
    selectedSection: Section | null;
    allSections: Section[];
}

// Define the initial state of SectionState.
const initialState: SectionState = {
    selectedSection: null,
    allSections: [],
};

// Create a slice named `sections`.
const sectionSlice = createSlice({
    name: 'sections',
    initialState,
    // Reducers define how the state changes in response to specific actions.
    reducers: {
        // Action to set a section.
        setSection(state, action: PayloadAction<Section>) {
            // `action.payload` contains data belongs to a section.
            state.selectedSection = action.payload;
        },
        // Action to set all sections.
        setSections(state, action: PayloadAction<Section[]>) {
            // `action.payload` contains data belongs to all sections.
            state.allSections = action.payload;
        },
        // Action to modify any sections in the list.
        modifySection(
            state,
            action: PayloadAction<{
                id: string;
                updatedSectionObject: Partial<Section>;
            }>,
        ) {
            // `action.payload` contains data belongs to a section.
            // We are accessing `id` and `updatedSectionObject` from `action.payload`.
            const {id, updatedSectionObject} = action.payload;
            // Since `allSections` is a list, we are mapping that list to find matches section ID.
            const existingSection = state.allSections.find(
                (section: Section) => section.section_id === id,
            );
            // If that specific section exists, then merge the update data to that section.
            if (existingSection) {
                Object.assign(existingSection, updatedSectionObject);
            }
        },
        // Action to clear any section from the list.
        clearSection(state, action: PayloadAction<String>) {
            const id = action.payload;
            state.allSections = state.allSections.filter(
                (section: Section) => section.section_id !== id,
            );
        },
    },
});

// Export the actions and reducer.
export const {setSection, setSections, modifySection, clearSection} =
    sectionSlice.actions;
export default sectionSlice.reducer;
