import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {Section} from '../../types/section';

interface SectionState {
    selectedSection: Section | null;
    allSections: Section[];
}

const initialState: SectionState = {
    selectedSection: null,
    allSections: [],
};

const sectionSlice = createSlice({
    name: 'sections',
    initialState,
    reducers: {
        setSection(state, action: PayloadAction<Section>) {
            state.selectedSection = action.payload;
        },

        setSections(state, action: PayloadAction<Section[]>) {
            state.allSections = action.payload;
        },

        modifySection(
            state,
            action: PayloadAction<{
                id: string;
                updatedSectionObject: Partial<Section> | Partial<Section[]>;
            }>,
        ) {
            const {id, updatedSectionObject} = action.payload;
            const existingSection = state.allSections.find(
                (section: Section) => section.section_id === id,
            );
            if (existingSection) {
                Object.assign(existingSection, updatedSectionObject);
            }

            //If the payload is an array (batch update), update each section
            // if (Array.isArray(updatedSectionObject)) {
            //     updatedSectionObject.forEach((updatedData) => {
            //         const existingSection = state.allSections.find(
            //             (section: Section) => section.section_id === id,
            //         );
            //         if (existingSection) {
            //             Object.assign(existingSection, updatedData);
            //         }
            //     });
            // } else {
            //     // For single section update
            //     const existingSection = state.allSections.find(
            //         (section: Section) => section.section_id === id,
            //     );
            //     if (existingSection) {
            //         Object.assign(existingSection, updatedSectionObject);
            //     }
            // }
        },

        clearSection(state, action: PayloadAction<String>) {
            const id = action.payload;
            state.allSections = state.allSections.filter(
                (section: Section) => section.section_id !== id,
            );
        },

        clearSingleSection(state) {
            state.selectedSection = null;
        },

        clearSections(state) {
            state.allSections = [];
        },
    },
});

export const {
    setSection,
    setSections,
    modifySection,
    clearSection,
    clearSingleSection,
    clearSections,
} = sectionSlice.actions;
export default sectionSlice.reducer;
