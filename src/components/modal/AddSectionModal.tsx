// AddSectionModal.tsx
import React, {useState} from 'react';
import {IoCloseOutline} from 'react-icons/io5';
import {useSections} from '../../hooks/useSections';
import {Section} from '../../types/section';
import {useCourses} from '../../hooks/useCourses';
import {clearSingleSection} from '../../store/slices/sectionSlice';
import {useDispatch} from 'react-redux';

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
    const {allSections} = useSections();
    const {selectedCourse} = useCourses();
    const dispatch = useDispatch();

    const handleSubmit = (): void => {
        if (!sectionTitle.trim()) {
            alert('Section title is required.');
            return;
        }

        const lengthOfSections = allSections.length;

        const newSection = {
            section_title: sectionTitle,
            section_order: lengthOfSections + 1,
            course_id: selectedCourse?.course_id || '',
        };

        onSubmit(newSection);
        onClose();
        dispatch(clearSingleSection());
        setSectionTitle(''); // Reset form
    };

    if (!isOpen) return null;

    return (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
            <div className='w-full max-w-lg p-6 bg-white'>
                {/* Replaced form with div and handled the logic manually */}
                <div className='w-full'>
                    <div className='flex items-start justify-between'>
                        <h1 className='font-abhaya text-3xl font-bold'>
                            Create New Section
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
                            Create Section Title
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
                            type='button' // Change button type to 'button'
                            onClick={handleSubmit}
                        >
                            Create Section
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddSectionModal;
