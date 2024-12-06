import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Section } from '../../types/section';

interface SectionState {
    selectedSection: Section | null;
    allSections: Section[];
}

const initialState: SectionState = {
    selectedSection: null,
    allSections: [],
};

<<<<<<< HEAD
// Create a slice named sections.
=======
>>>>>>> 94bc1c8a0abf751b72e56c1d52f2cde76ff522ba
const sectionSlice = createSlice({
    name: 'sections',
    initialState,
    reducers: {
        setSection(state, action: PayloadAction<Section>) {
<<<<<<< HEAD
            // action.payload contains data belongs to a section.
=======
>>>>>>> 94bc1c8a0abf751b72e56c1d52f2cde76ff522ba
            state.selectedSection = action.payload;
        },

        setSections(state, action: PayloadAction<Section[]>) {
<<<<<<< HEAD
            // action.payload contains data belongs to all sections.
            state.allSections = action.payload;
        },
        // Action to modify any sections in the list.
        // modifySection(
        //     state,
        //     action: PayloadAction<{
        //         id: string;
        //         updatedSectionObject: Partial<Section> | Partial<Section[]>;
        //     }>,
        // ) {
        //     // action.payload contains data belongs to a section.
        //     // We are accessing id and updatedSectionObject from action.payload.
        //     const {id, updatedSectionObject} = action.payload;
        //     // Since allSections is a list, we are mapping that list to find matches section ID.
        //     // const existingSection = state.allSections.find(
        //     //     (section: Section) => section.section_id === id,
        //     // );
        //     // // If that specific section exists, then merge the update data to that section.
        //     // if (existingSection) {
        //     //     Object.assign(existingSection, updatedSectionObject);
        //     // }

        //     // If the payload is an array (batch update), update each section
        //     if (Array.isArray(updatedSectionObject)) {
        //         updatedSectionObject.forEach((updatedData) => {
        //             const existingSection = state.allSections.find(
        //                 (section: Section) => section.section_id === id,
        //             );
        //             if (existingSection) {
        //                 Object.assign(existingSection, updatedData);
        //             }
        //         });
        //     } else {
        //         // For single section update
        //         const existingSection = state.allSections.find(
        //             (section: Section) => section.section_id === id,
        //         );
        //         if (existingSection) {
        //             Object.assign(existingSection, updatedSectionObject);
        //         }
        //     }
        // },
=======
            state.allSections = action.payload;
        },

>>>>>>> 94bc1c8a0abf751b72e56c1d52f2cde76ff522ba
        modifySection(
            state,
            action: PayloadAction<{
                id: string;
                updatedSectionObject: Partial<Section> | Partial<Section[]>;
            }>,
        ) {
<<<<<<< HEAD
            // action.payload contains data belongs to a section.
            // We are accessing id and updatedSectionObject from action.payload.
            const {id, updatedSectionObject} = action.payload;
            // Since allSections is a list, we are mapping that list to find matches section ID.
            // const existingSection = state.allSections.find(
            //     (section: Section) => section.section_id === id,
            // );
            // // If that specific section exists, then merge the update data to that section.
            // if (existingSection) {
            //     Object.assign(existingSection, updatedSectionObject);
            // }

            // If the payload is an array (batch update), update each section
            if (Array.isArray(updatedSectionObject)) {
                updatedSectionObject.forEach((updatedData) => {
                    if (updatedData && updatedData.section_id) {
                        const sectionIndex = state.allSections.findIndex(
                            (section: Section) =>
                                section.section_id === updatedData.section_id,
                        );
                        if (sectionIndex !== -1) {
                            state.allSections[sectionIndex] = {
                                ...state.allSections[sectionIndex],
                                ...updatedData,
                            };
                        }
                    }
                });
            } else {
                const sectionIndex = state.allSections.findIndex(
                    (section: Section) => section.section_id === id,
                );
                if (sectionIndex !== -1) {
                    state.allSections[sectionIndex] = {
                        ...state.allSections[sectionIndex],
                        ...updatedSectionObject,
                    };
                }
=======
            const {id, updatedSectionObject} = action.payload;
            const existingSection = state.allSections.find(
                (section: Section) => section.section_id === id,
            );
            if (existingSection) {
                Object.assign(existingSection, updatedSectionObject);
>>>>>>> 94bc1c8a0abf751b72e56c1d52f2cde76ff522ba
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

        resetSectionState: (state) => {
            state.selectedSection = null;
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
    resetSectionState,
} = sectionSlice.actions;
export default sectionSlice.reducer;
