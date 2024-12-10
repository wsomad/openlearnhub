import React, { useEffect, useState } from 'react';
import { IoCloseOutline } from 'react-icons/io5';

import { useCourses } from '../../hooks/useCourses';
import { useSections } from '../../hooks/useSections';
import { Section } from '../../types/section';

interface AddSectionModalProps {
    isOpen: boolean;
    isDraft?: boolean;
    onClose: () => void;
    onSubmit: (
        newSection: Omit<Section, 'section_id' | 'lessons' | 'quizzes'>,
    ) => void;
    sectionToEdit?: Section;
}

const AddSectionModal: React.FC<AddSectionModalProps> = ({
    isOpen,
    isDraft,
    onClose,
    onSubmit,
    sectionToEdit,
}) => {
    const [sectionTitle, setSectionTitle] = useState<string>('');
    const {allSections, deleteSelectedSection} = useSections();
    const {selectedCourse} = useCourses();

    useEffect(() => {
        if (sectionToEdit) {
            setSectionTitle(sectionToEdit.section_title);
        }
    }, [sectionToEdit]);

    // const handleSubmit = (): void => {
    //     if (!sectionTitle.trim()) {
    //         alert('Section title is required.');
    //         return;
    //     }

    //     const newSection = {
    //         section_title: sectionTitle,
    //         section_order:
    //             sectionToEdit?.section_order || allSections.length + 1,
    //         course_id: selectedCourse?.course_id || '',
    //         section_id: isDraft
    //             ? `draft-section-${Date.now()}`
    //             : sectionToEdit?.section_id || '', // Add section_id for drafts
    //     };

    //     onSubmit(newSection);
    //     onClose();
    //     deleteSelectedSection();
    //     setSectionTitle('');
    // };

    const handleSubmit = (): void => {
        if (!sectionTitle.trim()) {
            alert('Section title is required.');
            return;
        }

        const newSection = {
            section_title: sectionTitle,
            section_order: sectionToEdit?.section_order || 0,
            course_id: selectedCourse?.course_id || '',
            section_id: isDraft
                ? `draft-section-${Date.now()}`
                : sectionToEdit?.section_id || '',
        };

        onSubmit(newSection);
        onClose();
        deleteSelectedSection();
        setSectionTitle('');
    };

    if (!isOpen) return null;

    return (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
            <div className='w-full max-w-lg p-6 bg-white'>
                <div className='w-full'>
                    <div className='flex items-start justify-between'>
                        <h1 className='font-abhaya text-3xl font-bold'>
                            {sectionToEdit
                                ? 'Edit Section'
                                : 'Create New Section'}
                        </h1>
                        <button
                            type='button'
                            className='text-3xl w-16 h-16 flex items-start justify-end'
                            onClick={onClose}
                        >
                            <IoCloseOutline />
                        </button>
                    </div>

                    <div>
                        <label className='font-abhaya text-lg font-medium mb-1 block'>
                            Section Title
                        </label>
                        <input
                            className='w-full border border-gray p-3 bg-transparent font-abhaya focus:outline-none focus:ring-2 focus:ring-primary'
                            type='text'
                            placeholder='Section Title'
                            value={sectionTitle}
                            onChange={(e) => setSectionTitle(e.target.value)}
                            required
                        />
                    </div>

                    <div className='mt-8'>
                        <button
                            className='w-full py-3 bg-primary text-white text-lg active:scale-[.98] font-abhaya'
                            type='button'
                            onClick={handleSubmit}
                        >
                            {sectionToEdit
                                ? 'Update Section'
                                : 'Create Section'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddSectionModal;
