// AddSectionModal.tsx
import React, { useState } from 'react';
import { IoCloseOutline } from 'react-icons/io5';

import { Section } from '../../types/Section';

interface AddSectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (
        newSection: Omit<Section, 'section_id' | 'lessons' | 'quizzes'>,
    ) => void;
}

const AddSectionModal: React.FC<AddSectionModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
}) => {
    const [sectionTitle, setSectionTitle] = useState<string>('');

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        if (!sectionTitle.trim()) {
            alert('Section title is required.');
            return;
        }

        const newSection = {
            section_title: sectionTitle,
            section_order: 0, // This will be set by the parent component
            course_id: '', // This will be set by the parent component
        };

        onSubmit(newSection);
        setSectionTitle(''); // Reset form
    };

    if (!isOpen) return null;

    return (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
            <div className='w-full max-w-lg p-6 bg-white rounded-3xl'>
                <form className='w-full' onSubmit={handleSubmit}>
                    <div className='flex items-center justify-between'>
                        <h1 className='font-abhaya text-3xl font-bold'>
                            Add New Section
                        </h1>
                        <button
                            type='button'
                            className='text-3xl w-16 h-16 flex items-center justify-center'
                            onClick={onClose}
                        >
                            <IoCloseOutline />
                        </button>
                    </div>

                    <div className='space-y-4'>
                        <div>
                            <label className='font-abhaya text-lg font-medium mb-1 block'>
                                Section Title
                            </label>
                            <input
                                className='w-full border-2 border-gray-100 rounded-3xl p-3 bg-transparent font-abhaya'
                                type='text'
                                placeholder='Enter section title'
                                value={sectionTitle}
                                onChange={(e) =>
                                    setSectionTitle(e.target.value)
                                }
                                required
                            />
                        </div>
                    </div>

                    <div className='mt-8'>
                        <button
                            className='w-full py-3 rounded-3xl bg-primary text-white text-lg active:scale-[.98] font-abhaya'
                            type='submit'
                        >
                            Create New Section
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddSectionModal;
